import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

// Project imports
import EquipmentItem from "../../components/member/EquipmentItem";
import { useUser } from "../../helper/UserContext";
import type {
  ContainerObj,
  EquipmentObj,
  ItemObj,
} from "../../types/ModelTypes";
import { useEquipment } from "../../helper/EquipmentContext";
import ContainerItem from "../../components/member/ContainerItem";

/*
  Screen for viewing all equipment assigned to the current user
*/
export default function EquipmentScreen() {
  const { orgUserStorage } = useUser();
  const { itemData } = useEquipment();
  const chunkedEquipment = (items: ItemObj[], size: number) =>
    items.reduce(
      (acc, _, i) => (i % size ? acc : [...acc, items.slice(i, i + size)]),
      [] as ItemObj[][],
    );

  // Get the equipment assigned to the current user
  const userItems = itemData.get(orgUserStorage!.id);
  const items = userItems?.data || [];
  const chunkedData = chunkedEquipment(items, 3);

  return (
    <View style={styles.background}>
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.title}>My Equipment</Text>
          {chunkedData.map((group, index) => (
            <View key={index} style={styles.equipmentRow}>
              {group.map((equip) => (
                <View key={equip.id} style={styles.equipmentItemContainer}>
                  {equip.type === "equipment" ? (
                    <EquipmentItem
                      item={equip as EquipmentObj}
                      count={(equip as EquipmentObj).count}
                    />
                  ) : (
                    <ContainerItem item={equip as ContainerObj} />
                  )}
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
