import { Equipment } from "../models";
import { EquipmentObj } from "../types/ModelTypes";
import { DataStore } from "@aws-amplify/datastore";
import { OrgUserStorage } from "../models";
import { handleError } from "./Error";

/* 
  get the equipment for a user by OrgUserStorage id
  returns an array of processed equipment objects
*/
export const getEquipment = async (id: string) => {
  try {
    const orgUserStorage = await DataStore.query(OrgUserStorage, id);
    if (!orgUserStorage) throw new Error("OrgUserStorage does not exist!");
    const equipment = await DataStore.query(Equipment, (c) =>
      c.assignedTo.id.eq(orgUserStorage.id),
    );
    const equipmentData = processEquipmentData(equipment);
    return equipmentData;
  } catch (error) {
    handleError("GetEquipment", error as Error, null);
  }
};

/*
  get duplicates and merge their counts
  using a map to count duplicates and converting to an array
*/
export function processEquipmentData(equipment: Equipment[]) {
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
      });
    }
  });

  // Convert the Map back to an array
  const processedEquipmentData = Array.from(equipmentMap.values());
  return processedEquipmentData;
}
