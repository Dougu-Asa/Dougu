import { View } from "react-native";
import React, { useEffect } from "react";
import { useState } from "react";
import { ScrollView } from "react-native-gesture-handler";

// project imports
import UserEquipment from "../../components/member/UserEquipment";
import { useUser } from "../../helper/UserContext";
import { sortOrgEquipment } from "../../helper/DataStoreUtils";
import type { OrgEquipmentObj } from "../../types/ModelTypes";
import { useEquipment } from "../../helper/EquipmentContext";

/*
  Screen for viewing all equipment in the organization
  Groups equipment by the orgUserStorage it is assigned to
*/
export default function TeamEquipmentScreen() {
  const [orgEquipment, setOrgEquipment] = useState<OrgEquipmentObj[]>([]);
  const { org } = useUser();
  const { equipmentData } = useEquipment();

  useEffect(() => {
    const handleGetEquipment = async () => {
      const equipment = sortOrgEquipment(equipmentData);
      setOrgEquipment(equipment);
    };

    handleGetEquipment();
  }, [equipmentData, org]);

  return (
    <View style={{ backgroundColor: "white", minHeight: "100%" }}>
      <ScrollView>
        {orgEquipment.map((orgEquipment, index) => (
          <UserEquipment
            key={index}
            list={orgEquipment.equipment}
            name={orgEquipment.assignedToName}
          />
        ))}
      </ScrollView>
    </View>
  );
}
