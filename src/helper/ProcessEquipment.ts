import { Equipment } from "../models";
import { EquipmentObj } from "../types/ModelTypes";

// get duplicates and merge their counts
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
