import { DataStore } from "@aws-amplify/datastore";

import { Equipment } from "../models";
import { EquipmentObj, OrgEquipmentObj } from "../types/ModelTypes";
import { OrgUserStorage } from "../models";
import { handleError } from "./Error";

/* 
  get the equipment for a user by OrgUserStorage id
  returns an array of processed equipment objects
*/
export const getEquipment = async (
  id: string,
): Promise<EquipmentObj[] | undefined> => {
  try {
    const orgUserStorage = await DataStore.query(OrgUserStorage, id);
    if (!orgUserStorage) throw new Error("OrgUserStorage does not exist!");
    const equipment = await DataStore.query(Equipment, (c) =>
      c.assignedTo.id.eq(orgUserStorage.id),
    );
    const equipmentData = processEquipmentData(equipment, orgUserStorage);
    return equipmentData;
  } catch (error) {
    handleError("GetEquipment", error as Error, null);
  }
};

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
      });
    }
  });

  // Convert the Map back to an array
  const processedEquipmentData = Array.from(equipmentMap.values());
  return processedEquipmentData;
}

/* getEquipment but for every OrgUserStorage in the organization */
export async function getOrgEquipment(
  orgId: string,
): Promise<OrgEquipmentObj[]> {
  const orgUserStorages = await DataStore.query(OrgUserStorage, (c) =>
    c.organization.id.eq(orgId),
  );
  // for each orgUserStorage, get the equipment assigned to it
  let equipment = [];
  for (let i = 0; i < orgUserStorages.length; i++) {
    const processedEquipment = await getEquipment(orgUserStorages[i].id);
    equipment.push(processedEquipment ? processedEquipment : []);
  }
  // return both orgUserStorages and equipment as one object
  const orgEquipment = orgUserStorages.map((orgUserStorage, index) => ({
    assignedToName: orgUserStorage.name,
    equipment: equipment[index],
  }));
  return orgEquipment;
}
