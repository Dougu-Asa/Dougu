import { View } from "react-native";
import React, { useEffect } from "react";
import { useState } from "react";
import { ScrollView } from "react-native-gesture-handler";

// project imports
import UserEquipment from "../../components/member/UserEquipment";
import { useUser } from "../../helper/UserContext";
import { sortOrgItems } from "../../helper/EquipmentUtils";
import type { OrgItem } from "../../types/ModelTypes";
import { useEquipment } from "../../helper/EquipmentContext";

/*
  Screen for viewing all equipment in the organization
  Groups equipment by the orgUserStorage it is assigned to
*/
export default function TeamEquipmentScreen() {
  const [orgItems, setOrgItems] = useState<OrgItem[]>([]);
  const { org } = useUser();
  const { itemData } = useEquipment();

  useEffect(() => {
    const handleGetItems = async () => {
      const items = sortOrgItems(itemData);
      setOrgItems(items);
    };

    handleGetItems();
  }, [itemData, org]);

  return (
    <View style={{ backgroundColor: "white", minHeight: "100%" }}>
      <ScrollView>
        {orgItems.map((orgItem, index) => (
          <UserEquipment
            key={index}
            list={orgItem.data}
            name={orgItem.assignedToName}
          />
        ))}
      </ScrollView>
    </View>
  );
}
