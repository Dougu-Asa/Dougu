import React, { useState, useContext, useEffect } from "react";
import { DataStore } from "@aws-amplify/datastore";

import { EquipmentObj, ContainerObj, OrgItem } from "../../types/ModelTypes";
import { EquipmentContextType } from "../../types/ContextTypes";
import { useUser } from "./UserContext";
import { getOrgItems } from "../EquipmentUtils";
import { Equipment, Container } from "../../models";

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
  const [equipmentItem, setEquipmentItem] = useState<EquipmentObj | null>(null);
  const [containerItem, setContainerItem] = useState<ContainerObj | null>(null);
  const [itemData, setItemData] = useState<Map<string, OrgItem>>(new Map());
  const [visible, setVisible] = useState<boolean>(false);
  const [containerVisible, setContainerVisible] = useState<boolean>(false);
  const { org } = useUser();

  // subscribe to and get all equipment in the organization
  useEffect(() => {
    const handleGetItems = async () => {
      const items = await getOrgItems(org!.id);
      setItemData(items);
    };

    const equipmentSubscription = DataStore.observeQuery(Equipment).subscribe(
      () => {
        handleGetItems();
      },
    );
    const containerSubscription = DataStore.observeQuery(Container).subscribe(
      () => {
        handleGetItems();
      },
    );

    return () => {
      equipmentSubscription.unsubscribe();
      containerSubscription.unsubscribe();
    };
  }, [org]);

  // select a new default id for the equipment item passed in
  const modifyEquipmentItem = (item: EquipmentObj, newId: string) => {
    // find the equipment object in the equipmentData map
    const orgItem = itemData.get(item.assignedTo);
    if (!orgItem) return;
    // find the index of the equipment object in the equipment array
    const index = orgItem.data.findIndex((e) => e.id === item.id);
    if (index === -1) return;
    // create a new equipment object swapping the id with the new id
    const newEquipment = { ...item, id: newId };
    setEquipmentItem(newEquipment);
    // update the equipment array with the new equipment object
    orgItem.data[index] = newEquipment;
    itemData.set(item.assignedTo, orgItem);
  };

  return (
    <EquipmentContext.Provider
      value={{
        itemData,
        equipmentItem,
        setEquipmentItem,
        containerItem,
        setContainerItem,
        visible,
        setVisible,
        containerVisible,
        setContainerVisible,
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
