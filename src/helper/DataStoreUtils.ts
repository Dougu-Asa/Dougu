import { DataStore } from "@aws-amplify/datastore";

import { Equipment } from "../models";
import { EquipmentObj, OrgEquipmentObj } from "../types/ModelTypes";
import { OrgUserStorage } from "../models";
import { handleError } from "./Error";

// speed up localCompare sorting by using a collator
const collator = new Intl.Collator("en", {
  numeric: true,
  sensitivity: "base",
});

/* 
  sort the orgUserStorages by name
  and disregards upper/lower case
  returns the sorted array
*/
export function sortOrgUserStorages(
  orgUserStorages: OrgUserStorage[],
): OrgUserStorage[] {
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
export async function getOrgEquipment(
  orgId: string,
): Promise<OrgEquipmentObj[]> {
  const orgUserStorages = await DataStore.query(OrgUserStorage, (c) =>
    c.organization.id.eq(orgId),
  );
  // sort orgUserStorages by name
  const sortedMembers = sortOrgUserStorages(orgUserStorages);
  // for each orgUserStorage, get the equipment assigned to it
  // distinguish between orgUserStorages with equipment and without
  let orgEquipmentWithContent = [];
  let orgEquipmentWithoutContent = [];
  for (let i = 0; i < sortedMembers.length; i++) {
    const processedEquipment = await getEquipment(sortedMembers[i]);
    const length = processedEquipment ? processedEquipment.length : 0;
    if (length > 0) {
      orgEquipmentWithContent.push({
        assignedToName: sortedMembers[i].name,
        equipment: processedEquipment!,
      });
    } else {
      orgEquipmentWithoutContent.push({
        assignedToName: sortedMembers[i].name,
        equipment: [],
      });
    }
  }
  // return orgEquipment with those that have equipment first
  const orgEquipment = orgEquipmentWithContent.concat(
    orgEquipmentWithoutContent,
  );
  return orgEquipment;
}

/*
  get duplicates and merge their counts
  using a map to count duplicates and converting to an array
*/
export function processEquipmentData(
  equipment: Equipment[],
  orgUserStorage: OrgUserStorage,
): EquipmentObj[] {
  const equipmentMap = new Map<string, EquipmentObj>();

  equipment.forEach((equip) => {
    // duplicate
    if (equipmentMap.has(equip.name)) {
      const existingEquip = equipmentMap.get(equip.name);
      existingEquip!.count += 1;
      existingEquip!.data.push(equip.id);
      equipmentMap.set(equip.name, existingEquip!);
    } else {
      // new equipment
      equipmentMap.set(equip.name, {
        id: equip.id,
        label: equip.name,
        count: 1,
        data: [equip.id],
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
