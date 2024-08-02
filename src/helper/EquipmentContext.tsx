import React, { useState, useContext } from "react";
import { EquipmentObj } from "../types/ModelTypes";
import { EquipmentContextType } from "../types/ContextTypes";

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
  const [equipmentItem, setEquipmentItem] = useState<EquipmentObj | null>(null);
  const [visible, setVisible] = useState<boolean>(false);

  return (
    <EquipmentContext.Provider
      value={{
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
