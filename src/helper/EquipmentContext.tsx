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

  return (
    <EquipmentContext.Provider
      value={{
        equipmentData,
        equipmentItem,
        setEquipmentItem,
        visible,
        setVisible,
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
