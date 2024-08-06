import { DataStore } from "@aws-amplify/datastore";

import { Container, Equipment } from "../models";
import {
  EquipmentObj,
  OrgItem,
  ItemObj,
  ContainerObj,
} from "../types/ModelTypes";
import { OrgUserStorage } from "../models";
import { handleError } from "./Utils";

// speed up localCompare sorting by using a collator
const collator = new Intl.Collator("en", {
  numeric: true,
  sensitivity: "base",
});

// sort the orgUserStorages by name
export const sortOrgUserStorages = (
  orgUserStorages: OrgUserStorage[],
): OrgUserStorage[] => {
  return orgUserStorages.sort((a, b) => collator.compare(a.name, b.name));
};

// chunk the equipment into groups of size
export const chunkEquipment = (items: ItemObj[], size: number) =>
  items.reduce(
    (acc, _, i) => (i % size ? acc : [...acc, items.slice(i, i + size)]),
    [] as ItemObj[][],
  );

export const getOrgItems = async (
  orgId: string,
): Promise<Map<string, OrgItem>> => {
  // every orgUserStorage has a list of items assigned to it
  let orgItems = new Map<string, OrgItem>();
  const orgUserStorages = await DataStore.query(OrgUserStorage, (c) =>
    c.organizationUserOrStoragesId.eq(orgId),
  );
  // for each orgUserStorage, get the items assigned to it
  for (let i = 0; i < orgUserStorages.length; i++) {
    let userData: ItemObj[] = [];
    // get all the processed equipmentdata  assigned to the user
    const equipmentData = await getEquipment(orgUserStorages[i]);
    // set a container object map for the user
    const containerMap = await getContainers(orgUserStorages[i]);
    // separate equipment that is in a container to part of a containerObj
    equipmentData?.forEach((equip) => {
      if (equip.parent && equip.parent in containerMap) {
        containerMap.get(equip.parent)!.equipment.push(equip);
      } else {
        userData.push(equip);
      }
    });
    // add each containerObj to userData
    containerMap.forEach((value) => {
      userData.push(value);
    });
    // sort the array by name
    userData.sort((a, b) => collator.compare(a.label, b.label));
    orgItems.set(orgUserStorages[i].id, {
      assignedToName: orgUserStorages[i].name,
      data: userData,
    });
  }
  return orgItems;
};

export const sortOrgItems = (orgItems: Map<string, OrgItem>): OrgItem[] => {
  let orgItemsArray: OrgItem[] = [];
  let orgItemsArrayEmpty: OrgItem[] = [];
  orgItems.forEach((value) => {
    if (value.data.length > 0) {
      orgItemsArray.push(value);
    } else {
      orgItemsArrayEmpty.push(value);
    }
  });
  orgItemsArray.sort((a, b) =>
    collator.compare(a.assignedToName, b.assignedToName),
  );
  orgItemsArrayEmpty.sort((a, b) =>
    collator.compare(a.assignedToName, b.assignedToName),
  );
  return orgItemsArray.concat(orgItemsArrayEmpty);
};

//get the equipment for a user by OrgUserStorage id
//returns an array of processed equipment objects
export const getEquipment = async (
  orgUserStorage: OrgUserStorage,
): Promise<EquipmentObj[] | undefined> => {
  try {
    if (!orgUserStorage) throw new Error("OrgUserStorage does not exist!");
    const equipment = await DataStore.query(Equipment, (c) =>
      c.assignedTo.id.eq(orgUserStorage.id),
    );
    // group duplicates and merge their counts
    const equipmentData = processEquipmentData(equipment, orgUserStorage);
    return equipmentData;
  } catch (error) {
    handleError("GetEquipment", error as Error, null);
    return undefined;
  }
};

export const getContainers = async (
  orgUserStorage: OrgUserStorage,
): Promise<Map<string, ContainerObj>> => {
  // get all the containers assigned to the user
  const containers = await DataStore.query(Container, (c) =>
    c.assignedTo.id.eq(orgUserStorage.id),
  );
  // for each container id, create a map <containerId, containerObj>
  const containerMap = new Map<string, ContainerObj>();
  for (let j = 0; j < containers.length; j++) {
    const containerObj: ContainerObj = {
      id: containers[j].id,
      label: containers[j].name,
      assignedTo: orgUserStorage.id,
      assignedToName: orgUserStorage.name,
      type: "container",
      equipment: [],
    };
    containerMap.set(containers[j].id, containerObj);
  }
  return containerMap;
};

/*
  get duplicates and merge their counts
  using a map to count duplicates and converting to an array
*/
export const processEquipmentData = (
  equipment: Equipment[],
  orgUserStorage: OrgUserStorage,
): EquipmentObj[] => {
  const equipmentMap = new Map<string, EquipmentObj>();

  equipment.forEach((equip) => {
    // duplicate
    if (equipmentMap.has(equip.name)) {
      const existingEquip = equipmentMap.get(equip.name);
      existingEquip!.count += 1;
      existingEquip!.data.push(equip.id);
      existingEquip!.detailData.push(equip.details ? equip.details : "");
      equipmentMap.set(equip.name, existingEquip!);
    } else {
      // new equipment
      equipmentMap.set(equip.name, {
        id: equip.id,
        label: equip.name,
        count: 1,
        type: "equipment",
        data: [equip.id],
        detailData: [equip.details ? equip.details : ""],
        assignedTo: orgUserStorage.id,
        assignedToName: orgUserStorage.name,
        parent: equip.containerEquipmentId ? equip.containerEquipmentId : null,
      });
    }
  });

  // Convert the Map back to an array
  const processedEquipmentData = Array.from(equipmentMap.values());
  return processedEquipmentData;
};