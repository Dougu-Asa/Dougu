import { DataStore } from "@aws-amplify/datastore";

import { Equipment } from "../models";
import { EquipmentObj, OrgEquipmentObj } from "../types/ModelTypes";
import { OrgUserStorage } from "../models";
import { handleError } from "./Utils";

// speed up localCompare sorting by using a collator
const collator = new Intl.Collator("en", {
  numeric: true,
  sensitivity: "base",
});

/* 
  sort the orgUserStorages by name
  and disregards upper/lower case
  returns the sorted array 
  USED ONLY IN USERSTORAGES
*/
export const sortOrgUserStorages = (
  orgUserStorages: OrgUserStorage[],
): OrgUserStorage[] => {
  return orgUserStorages.sort((a, b) => collator.compare(a.name, b.name));
}

/* 
  get the equipment for a user by OrgUserStorage id
  returns an array of processed equipment objects
*/
export const getEquipment = async (
  orgUserStorage: OrgUserStorage,
): Promise<EquipmentObj[] | undefined> => {
  try {
    if (!orgUserStorage) throw new Error("OrgUserStorage does not exist!");
    const equipment = await DataStore.query(Equipment, (c) =>
      c.assignedTo.id.eq(orgUserStorage.id),
    );
    const equipmentData = processEquipmentData(equipment, orgUserStorage);
    return equipmentData;
  } catch (error) {
    handleError("GetEquipment", error as Error, null);
    return undefined;
  }
};

/* getEquipment but for every OrgUserStorage in the organization */
export const getOrgEquipment = async (
  orgId: string,
): Promise<Map<string, OrgEquipmentObj>> => {
  let orgEquipment = new Map<string, OrgEquipmentObj>();
  const orgUserStorages = await DataStore.query(OrgUserStorage, (c) =>
    c.organizationUserOrStoragesId.eq(orgId),
  );
  // for each orgUserStorage, get the equipment assigned to it
  for (let i = 0; i < orgUserStorages.length; i++) {
    const processedEquipment = await getEquipment(orgUserStorages[i]);
    let orgEquipmentObj = {
      assignedToName: orgUserStorages[i].name,
      equipment: processedEquipment ? processedEquipment : [],
    };
    orgEquipment.set(orgUserStorages[i].id, orgEquipmentObj);
  }
  return orgEquipment;
}

// sort orgEquipmentObj map by assignedToName, and having those with equipment first
export const sortOrgEquipment = (
  orgEquipment: Map<string, OrgEquipmentObj>,
): OrgEquipmentObj[] => {
  let orgEquipmentWithContent: OrgEquipmentObj[] = [];
  let orgEquipmentWithoutContent: OrgEquipmentObj[] = [];
  orgEquipment.forEach((value) => {
    const length = value.equipment.length;
    if (length > 0) {
      orgEquipmentWithContent.push(value);
    } else {
      orgEquipmentWithoutContent.push(value);
    }
  });
  // sort each array by assignedToName
  orgEquipmentWithContent.sort((a, b) =>
    collator.compare(a.assignedToName, b.assignedToName),
  );
  orgEquipmentWithoutContent.sort((a, b) =>
    collator.compare(a.assignedToName, b.assignedToName),
  );
  // return orgEquipment with those that have equipment first
  return orgEquipmentWithContent.concat(orgEquipmentWithoutContent);
}

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
        data: [equip.id],
        detailData: [equip.details ? equip.details : ""],
        assignedTo: orgUserStorage.id,
        assignedToName: orgUserStorage.name,
      });
    }
  });

  // Sort map by the keys so equipment names are in alphabetical order
  const sortedMap = new Map(
    [...equipmentMap.entries()].sort((a, b) => collator.compare(a[0], b[0])),
  );
  // Convert the Map back to an array
  const processedEquipmentData = Array.from(sortedMap.values());
  return processedEquipmentData;
}
