import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

// Project imports
import { useUser } from "../../helper/context/UserContext";
import { useEquipment } from "../../helper/context/EquipmentContext";
import { chunkEquipment } from "../../helper/EquipmentUtils";
import Item from "../../components/member/Item";

/*
  Screen for viewing all equipment assigned to the current user
*/
export default function EquipmentScreen() {
  const { orgUserStorage } = useUser();
  const { itemData } = useEquipment();

  // Get the equipment assigned to the current user
  const userItems = itemData.get(orgUserStorage!.id);
  const items = userItems?.data || [];
  const chunkedData = chunkEquipment(items, 3);

  return (
    <View style={styles.background}>
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.title}>My Equipment</Text>
          {chunkedData.map((group, index) => (
            <View key={index} style={styles.equipmentRow}>
              {group.map((equip) => (
                <View key={equip.id} style={styles.equipmentItemContainer}>
                  <Item data={equip} countData={undefined} swapable={false} />
                </View>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: "#fff",
    height: "100%",
    width: "100%",
  },
  container: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 20,
    color: "#000",
  },
  equipmentRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    width: "90%",
    marginBottom: 20,
    marginLeft: "auto",
    marginRight: "auto",
  },
  equipmentItemContainer: {
    flexBasis: "33.33%",
    alignItems: "center",
  },
});
