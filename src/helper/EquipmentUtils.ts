import { DataStore } from "@aws-amplify/datastore";

import { Container, Equipment } from "../models";
import {
  EquipmentObj,
  OrgItem,
  ItemObj,
  ContainerObj,
  csvSheet,
  Hex,
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
export const chunkArray = <T>(items: T[], size: number) =>
  items.reduce(
    (acc, _, i) => (i % size ? acc : [...acc, items.slice(i, i + size)]),
    [] as T[][],
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
    const { equipmentData, containerMap } = await getEquipmentAndContainers(
      orgUserStorages[i],
    );
    // separate equipment that is in a container to part of a containerObj
    equipmentData?.forEach((equip) => {
      if (equip.container && containerMap.has(equip.container)) {
        containerMap.get(equip.container)!.equipment.push(equip);
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
  let emptyItemsArray: OrgItem[] = [];
  orgItems.forEach((value) => {
    if (value.data.length > 0) {
      orgItemsArray.push(value);
    } else {
      emptyItemsArray.push(value);
    }
  });
  orgItemsArray.sort((a, b) =>
    collator.compare(a.assignedToName, b.assignedToName),
  );
  emptyItemsArray.sort((a, b) =>
    collator.compare(a.assignedToName, b.assignedToName),
  );
  return orgItemsArray.concat(emptyItemsArray);
};

// get equipment and containers assigned to the orgUserStorage
// return the processed equipment data and a map of containers
const getEquipmentAndContainers = async (
  orgUserStorage: OrgUserStorage,
): Promise<{
  equipmentData: EquipmentObj[];
  containerMap: Map<string, ContainerObj>;
}> => {
  if (!orgUserStorage) return { equipmentData: [], containerMap: new Map() };

  try {
    const [equipment, containers] = await Promise.all([
      DataStore.query(Equipment, (c) => c.assignedTo.id.eq(orgUserStorage.id)),
      DataStore.query(Container, (c) => c.assignedTo.id.eq(orgUserStorage.id)),
    ]);

    // Create a map of containers
    const containerMap = new Map<string, ContainerObj>(
      containers.map((container) => [
        container.id,
        {
          id: container.id,
          label: container.name,
          color: container.color as Hex,
          assignedTo: orgUserStorage.id,
          assignedToName: orgUserStorage.name,
          type: "container",
          equipment: [],
        },
      ]),
    );

    // Process the equipment data
    const equipmentData = processEquipmentData(equipment, orgUserStorage);

    return { equipmentData, containerMap };
  } catch (error) {
    handleError("GetEquipmentAndContainers", error as Error, null);
    return { equipmentData: [], containerMap: new Map() };
  }
};

/*
  get duplicates and merge their counts
  using a map to count duplicates and converting to an array
*/
const processEquipmentData = (
  equipment: Equipment[],
  orgUserStorage: OrgUserStorage,
): EquipmentObj[] => {
  const equipmentMap = new Map<string, EquipmentObj>();
  equipment.forEach((equip) => {
    // duplicate
    const key = equip.containerId ? equip.name + equip.containerId : equip.name;
    const existingEquip = equipmentMap.get(key);
    if (existingEquip) {
      existingEquip.count += 1;
      existingEquip.data.push(equip.id);
      existingEquip.detailData.push(equip.details || "");
    } else {
      // new equipment
      equipmentMap.set(key, {
        id: equip.id,
        label: equip.name,
        color: equip.color as Hex,
        count: 1,
        type: "equipment",
        image: equip.image,
        data: [equip.id],
        detailData: [equip.details || ""],
        assignedTo: orgUserStorage.id,
        assignedToName: orgUserStorage.name,
        container: equip.containerId || null,
      });
    }
  });

  return Array.from(equipmentMap.values());
};

// get the csv data for the organization to export to google sheets
export const getCsvData = (
  orgItems: Map<string, OrgItem>,
  showEmpty: boolean,
  showContainerEquip: boolean,
): csvSheet => {
  const counts: { [key: string]: { [key: string]: number } } = {};
  // get all the unique equipment labels
  const uniqueLabels: { [key: string]: number } = {};
  // fill out dictionary with equipment counts for each user
  orgItems.forEach((value) => {
    const { assignedToName, data } = value;
    // skip empty users if showEmpty is false
    if (!showEmpty && data.length === 0) return;
    counts[assignedToName] = {};
    data.forEach((equip) => {
      counts[assignedToName][equip.label] ??= 0;
      uniqueLabels[equip.label] ??= 0;
      if (equip.type === "equipment") {
        const count = (equip as EquipmentObj).count;
        counts[assignedToName][equip.label] += count;
        uniqueLabels[equip.label] += count;
      } else {
        // count the container
        counts[assignedToName][equip.label] += 1;
        uniqueLabels[equip.label] += 1;
        // if showContainerEquip is false, don't count the equipment in the container
        if (!showContainerEquip) return;
        // count the equipment in the container
        (equip as ContainerObj).equipment.forEach((equip) => {
          counts[assignedToName][equip.label] ??= 0;
          uniqueLabels[equip.label] ??= 0;
          counts[assignedToName][equip.label] += equip.count;
          uniqueLabels[equip.label] += equip.count;
        });
      }
    });
  });
  const assignedToNames = Object.keys(counts).sort();
  const equipmentLabels = Object.keys(uniqueLabels).sort();
  const identityCol = [...assignedToNames, "Total"];
  let csvContent: string[][] = [];
  // column major order
  equipmentLabels.forEach((label) => {
    const col: string[] = [];
    assignedToNames.forEach((name) => {
      const countStr = counts[name][label]
        ? counts[name][label].toString()
        : "0";
      col.push(countStr);
    });
    // add the total count for each equipment label
    col.push(uniqueLabels[label].toString());
    csvContent.push(col);
  });
  return {
    header: equipmentLabels,
    identityCol: identityCol,
    values: csvContent,
  };
};
