import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { DataStore } from "@aws-amplify/datastore";
import { ScrollView } from "react-native-gesture-handler";

// Project imports
import { Equipment } from "../../models";
import EquipmentItem from "../../components/member/EquipmentItem";
import { useUser } from "../../helper/UserContext";
import type { EquipmentObj } from "../../types/ModelTypes";
import { getEquipment } from "../../helper/DataStoreUtils";

/*
  Screen for viewing all equipment assigned to the current user
*/
const EquipmentScreen = () => {
  const [equipment, setEquipment] = useState<EquipmentObj[][]>([[]]);
  const { user, org, orgUserStorage } = useUser();

  useEffect(() => {
    // Function to chunk the equipment array into subarrays of size items each
    const chunkedEquipment = (equipment: EquipmentObj[], size: number) =>
      equipment.reduce(
        (acc, _, i) =>
          i % size ? acc : [...acc, equipment.slice(i, i + size)],
        [] as EquipmentObj[][],
      );

    // Get the equipment assigned to the current user and set the state
    const setEquipmentState = async () => {
      const equipment = await getEquipment(orgUserStorage!);
      if (!equipment) return;
      setEquipment(chunkedEquipment(equipment, 3));
    };

    // Observe the Equipment table for changes and update the state
    const subscription = DataStore.observeQuery(Equipment).subscribe(() => {
      setEquipmentState();
    });

    return () => subscription.unsubscribe();
  }, [org, orgUserStorage, user]);

  return (
    <View style={styles.background}>
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.title}>My Equipment</Text>
          {equipment.map((group, index) => (
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
};

export default EquipmentScreen;

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
