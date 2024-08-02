import React, { useState, useContext, useEffect } from "react";
import { DataStore } from "@aws-amplify/datastore";
import { Equipment } from "../models";

import { EquipmentObj, OrgEquipmentObj } from "../types/ModelTypes";
import { EquipmentContextType } from "../types/ContextTypes";
import { useUser } from "./UserContext";
import { getOrgEquipment } from "./DataStoreUtils";

/* 
  Context only available within MemberTabs that distributes the equipment
  item and whether it's data is visible
*/
const EquipmentContext = React.createContext<EquipmentContextType | undefined>(
  undefined,
);

export const EquipmentProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [equipmentData, setEquipmentData] = useState<
    Map<string, OrgEquipmentObj>
  >(new Map());
  const [equipmentItem, setEquipmentItem] = useState<EquipmentObj | null>(null);
  const [visible, setVisible] = useState<boolean>(false);
  const { org } = useUser();

  useEffect(() => {
    async function handleGetEquipment() {
      const equipment = await getOrgEquipment(org!.id);
      setEquipmentData(equipment);
    }

    const subscription = DataStore.observeQuery(Equipment).subscribe(() => {
      handleGetEquipment();
    });

    return () => subscription.unsubscribe();
  }, [org]);

  const modifyEquipmentItem = (item: EquipmentObj, newId: string) => {
    // find the equipment object in the equipmentData map
    const equipment = equipmentData.get(item.assignedTo);
    if (!equipment) return;
    // find the index of the equipment object in the equipment array
    const index = equipment.equipment.findIndex((e) => e.id === item.id);
    if (index === -1) return;
    // create a new equipment object swapping the id with the new id
    const newEquipment = { ...item, id: newId };
    setEquipmentItem(newEquipment);
    // update the equipment array with the new equipment object
    equipment.equipment[index] = newEquipment;
    equipmentData.set(item.assignedTo, equipment);
  };

  return (
    <EquipmentContext.Provider
      value={{
        equipmentData,
        equipmentItem,
        setEquipmentItem,
        visible,
        setVisible,
        modifyEquipmentItem,
      }}
    >
      {children}
    </EquipmentContext.Provider>
  );
};

// ensure that UserContext isn't undefined in useUser
export const useEquipment = (): EquipmentContextType => {
  const context = useContext(EquipmentContext);
  if (!context) {
    throw new Error("useUEquipment must be used within a EquipmentProvider");
  }
  return context;
};
