import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { DataStore } from "@aws-amplify/datastore";
import { ScrollView } from "react-native-gesture-handler";

// Project imports
import { Equipment } from "../../models";
import EquipmentItem from "../../components/member/EquipmentItem";
import { useUser } from "../../helper/UserContext";
import type { EquipmentObj } from "../../types/EquipmentTypes";

const EquipmentScreen = () => {
  const [equipment, setEquipment] = useState<EquipmentObj[][]>([[]]);
  const { user, org, orgUserStorage } = useUser();

  useEffect(() => {
    async function getEquipment() {
      const equipment = await DataStore.query(Equipment, (c) =>
        c.assignedTo.id.eq(orgUserStorage!.id),
      );
      const equipmentData = processEquipmentData(equipment);
      const groupedEquipment = chunkedEquipment(equipmentData, 3);
      setEquipment(groupedEquipment);
    }

    const subscription = DataStore.observeQuery(Equipment).subscribe(
      (snapshot) => {
        const { items, isSynced } = snapshot;
        console.log(
          `myEquipment [Snapshot] item count: ${items.length}, isSynced: ${isSynced}`,
        );
        getEquipment();
      },
    );
    console.log("user: ", user);
    console.log("org: ", org);
    console.log("orgUserStorage: ", orgUserStorage);

    return () => subscription.unsubscribe();
  }, [org, orgUserStorage, user]);

  // get duplicates and merge their counts
  function processEquipmentData(equipment: Equipment[]) {
    const equipmentMap = new Map<string, EquipmentObj>();

    equipment.forEach((equip) => {
      // duplicate
      if (equipmentMap.has(equip.name)) {
        const existingEquip = equipmentMap.get(equip.name);
        existingEquip!.count += 1;
        existingEquip!.data.push(equip.id);
        equipmentMap.set(equip.name, existingEquip!);
      } else {
        // new equipment
        equipmentMap.set(equip.name, {
          id: equip.id,
          label: equip.name,
          count: 1,
          data: [equip.id],
        });
      }
    });

    // Convert the Map back to an array
    const processedEquipmentData = Array.from(equipmentMap.values());
    return processedEquipmentData;
  }

  // Function to chunk the equipment array into subarrays of size items each
  const chunkedEquipment = (equipment: EquipmentObj[], size: number) =>
    equipment.reduce(
      (acc, _, i) => (i % size ? acc : [...acc, equipment.slice(i, i + size)]),
      [] as EquipmentObj[][],
    );

  return (
    <View style={{ backgroundColor: "white", width: "100%", height: "100%" }}>
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.title}>My Equipment</Text>
          {equipment.map((group, index) => (
            <View key={index} style={styles.equipmentRow}>
              {group.map((equip) => (
                <EquipmentItem
                  key={equip.id}
                  item={equip}
                  count={equip.count}
                />
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
    width: "90%", // Adjust width as needed
    marginBottom: 20, // Adjust spacing between rows as needed
  },
});
