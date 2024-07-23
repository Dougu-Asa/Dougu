import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import Entypo from "react-native-vector-icons/Entypo";
import { DataStore } from "aws-amplify";

// project imports
import { Equipment, OrgUserStorage } from "../../models";
import { useUser } from "../../helper/UserContext";
import { useLoad } from "../../helper/LoadingContext";
import { handleError } from "../../helper/Error";
import { TableEquipmentObj, TableEquipmentData } from "../../types/ModelTypes";

/*
  Component for displaying all equipment in the organization
  in a table format
*/
export default function EquipmentTable() {
  const tableHead = ["Name", "Assigned To", "Quantity", ""];
  const [tableData, setTableData] = useState<TableEquipmentData[]>([]);
  const isManager = useRef<boolean>(false);
  const { user, org } = useUser();
  const { setIsLoading } = useLoad();

  // subscribe to and get all equipment in the organization
  useEffect(() => {
    async function getEquipment() {
      // check if the user is the manager
      const equipment = await DataStore.query(Equipment, (c) =>
        c.organization.id.eq(org!.id),
      );
      const equipmentData = await Promise.all(
        equipment.map(async (equip) => {
          let assignedTo = await DataStore.query(OrgUserStorage, (c) =>
            c.equipment.id.eq(equip.id),
          );
          return {
            id: equip.id,
            name: equip.name,
            quantity: 1,
            assignedTo: assignedTo[0] ? assignedTo[0].id : "UNASSIGNED",
            assignedToName: assignedTo[0] ? assignedTo[0].name : "UNASSIGNED",
          };
        }),
      );
      const processedEquipmentData = processData(equipmentData);
      return processedEquipmentData;
    }

    isManager.current =
      org!.organizationManagerUserId === user!.attributes.sub ? true : false;
    const subscription = DataStore.observeQuery(Equipment).subscribe(() => {
      getEquipment().then((equipmentData) => {
        setTableData(equipmentData);
      });
    });

    return () => subscription.unsubscribe();
  }, [org, user]);

  function processData(equipment: TableEquipmentObj[]) {
    const equipmentMap = new Map();

    equipment.forEach((equip) => {
      let key = equip.name + equip.assignedTo;
      if (equipmentMap.has(key)) {
        const existingEquip = equipmentMap.get(key);
        existingEquip.quantity += 1;
        existingEquip.data.push(equip.id);
        equipmentMap.set(key, existingEquip);
      } else {
        equipmentMap.set(key, {
          id: equip.id,
          name: equip.name,
          quantity: 1,
          data: [equip.id],
          assignedTo: equip.assignedTo,
          assignedToName: equip.assignedToName,
        });
      }
    });

    // Convert the Map back to an array
    const processedEquipmentData = Array.from(equipmentMap.values());
    return processedEquipmentData;
  }

  // delete equipment from the organization
  const handleDelete = async (rowData: TableEquipmentData) => {
    try {
      setIsLoading(true);
      const equipment = await DataStore.query(Equipment, rowData.id);
      if (equipment == null) throw new Error("Equipment not found");
      await DataStore.delete(equipment);
      setIsLoading(false);
      Alert.alert("Equipment Deleted Successfully!");
    } catch (error) {
      handleError("handleDelete", error as Error, setIsLoading);
    }
  };

  // make sure the owner wants to delete the equipment
  const handleEdit = (rowData: TableEquipmentData) => {
    if (!isManager.current) {
      Alert.alert("You must be a manager to edit equipment");
      return;
    }
    Alert.alert(
      "Delete Equipment",
      "Would you like to delete this equipment?",
      [
        {
          text: "Delete",
          onPress: () => handleDelete(rowData),
          style: "destructive",
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
    );
  };

  return (
    <View style={styles.table}>
      <View style={styles.row}>
        <Text style={[styles.headerText, { flex: 8 }]}>{tableHead[0]}</Text>
        <Text style={[styles.headerText, { flex: 10 }]}>{tableHead[1]}</Text>
        <Text style={[styles.headerText, { flex: 3 }]}>{tableHead[2]}</Text>
        <Text style={[styles.headerText, { flex: 1 }]}>{tableHead[3]}</Text>
      </View>
      <ScrollView>
        {tableData.map((rowData, index) => (
          <View key={index} style={styles.row}>
            <View style={[styles.cell, { flex: 8 }]}>
              <Text>{rowData.name}</Text>
            </View>
            <View style={[styles.cell, { flex: 10 }]}>
              <Text>{rowData.assignedToName}</Text>
            </View>
            <View style={[styles.cell, { flex: 3 }]}>
              <Text>{rowData.quantity}</Text>
            </View>
            <TouchableOpacity
              style={styles.icon}
              onPress={() => handleEdit(rowData)}
            >
              <Entypo name="dots-three-vertical" size={20} />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  table: {
    flex: 1,
    width: "100%",
    borderWidth: 1,
  },
  row: {
    flexDirection: "row",
    width: "100%",
    minHeight: 50,
    borderBottomWidth: 1,
    borderBottomColor: "gray",
  },
  headerText: {
    padding: 10,
    fontWeight: "bold",
    fontSize: 8,
    color: "gray",
  },
  cell: {
    marginLeft: 10,
    justifyContent: "center",
  },
  icon: {
    justifyContent: "center",
    marginRight: 5,
  },
});
