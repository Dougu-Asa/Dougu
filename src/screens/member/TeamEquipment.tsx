import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { useState } from "react";

// project imports
import { useUser } from "../../helper/context/UserContext";
import { sortOrgItems } from "../../helper/EquipmentUtils";
import type { OrgItem } from "../../types/ModelTypes";
import { useEquipment } from "../../helper/context/EquipmentContext";
import ScrollRow from "../../components/member/ScrollRow";

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
      <FlatList
        data={orgItems}
        keyExtractor={(orgItem, index) => index.toString()}
        renderItem={({ item: orgItem }) => (
          <View style={styles.userContainer}>
            <Text style={styles.scrollText}>{orgItem.assignedToName}</Text>
            <ScrollRow listData={orgItem.data} isSwap={false} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  scrollText: {
    height: 40,
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 20,
  },
  userContainer: {
    minHeight: 200,
    backgroundColor: "white",
  },
});
