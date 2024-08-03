import React, { useState, useContext, useEffect } from "react";
import { DataStore } from "@aws-amplify/datastore";
import { Equipment } from "../models";

import {
  EquipmentObj,
  OrgEquipmentObj,
  ContainerObj,
} from "../types/ModelTypes";
import { EquipmentContextType } from "../types/ContextTypes";
import { useUser } from "./UserContext";
import { getOrgEquipment } from "./DataStoreUtils";
import { ItemType } from "../types/ModelTypes";

/* 
  Context only available within MemberTabs that distributes the equipment
  item and whether it's data is visible. By allowing all membertabs screens
  to share equipmentData, we ensure consistency and also custom selection of 
  which equipment id you'd like to swap
*/
const EquipmentContext = React.createContext<EquipmentContextType | undefined>(
  undefined,
);

export default function EquipmentProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [equipmentData, setEquipmentData] = useState<
    Map<string, OrgEquipmentObj>
  >(new Map());
  const [containerData, setContainerData] = useState<Map<string, ContainerObj>>(
    new Map(),
  );
  const [equipmentItem, setEquipmentItem] = useState<EquipmentObj | null>(null);
  const [containerItem, setContainerItem] = useState<ContainerObj | null>(null);
  const [itemData, setItemData] = useState<Map<string, ItemType[]>>(new Map());
  const [visible, setVisible] = useState<boolean>(false);
  const { org } = useUser();

  // subscribe to and get all equipment in the organization
  useEffect(() => {
    const handleGetEquipment = async () => {
      const equipment = await getOrgEquipment(org!.id);
      setEquipmentData(equipment);
    };

    const subscription = DataStore.observeQuery(Equipment).subscribe(() => {
      handleGetEquipment();
    });

    return () => subscription.unsubscribe();
  }, [org]);

  // select a new default id for the equipment item passed in
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
}

// ensure that UserContext isn't undefined in useUser
export const useEquipment = (): EquipmentContextType => {
  const context = useContext(EquipmentContext);
  if (!context) {
    throw new Error("useUEquipment must be used within a EquipmentProvider");
  }
  return context;
};
