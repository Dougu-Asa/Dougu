import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

// Project imports
import EquipmentItem from "../../components/member/EquipmentItem";
import { useUser } from "../../helper/UserContext";
import type { EquipmentObj } from "../../types/ModelTypes";
import { useEquipment } from "../../helper/EquipmentContext";

/*
  Screen for viewing all equipment assigned to the current user
*/
export default function EquipmentScreen() {
  const { orgUserStorage } = useUser();
  const { equipmentData } = useEquipment();
  const chunkedEquipment = (equipment: EquipmentObj[], size: number) =>
    equipment.reduce(
      (acc, _, i) => (i % size ? acc : [...acc, equipment.slice(i, i + size)]),
      [] as EquipmentObj[][],
    );

  // Get the equipment assigned to the current user
  const userEquipment = equipmentData.get(orgUserStorage!.id);
  const equipment = userEquipment?.equipment || [];
  const chunkedData = chunkedEquipment(equipment, 3);

  return (
    <View style={styles.background}>
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.title}>My Equipment</Text>
          {chunkedData.map((group, index) => (
            <View key={index} style={styles.equipmentRow}>
              {group.map((equip) => (
                <View key={equip.id} style={styles.equipmentItemContainer}>
                  <EquipmentItem
                    key={equip.id}
                    item={equip}
                    count={equip.count}
                  />
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
