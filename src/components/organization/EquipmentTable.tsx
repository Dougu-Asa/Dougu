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
import { Equipment } from "../../models";
import { useUser } from "../../helper/UserContext";
import { useLoad } from "../../helper/LoadingContext";
import { handleError } from "../../helper/Utils";
import { EquipmentObj } from "../../types/ModelTypes";
import { sortOrgEquipment } from "../../helper/DataStoreUtils";
import { useEquipment } from "../../helper/EquipmentContext";

/*
  Component for displaying all equipment in the organization
  in a table format
*/
export default function EquipmentTable({
  searchFilter,
}: {
  searchFilter: string;
}) {
  const tableHead = ["Name", "Assigned To", "Quantity", ""];
  // table data is the equipment in the organization
  const [tableData, setTableData] = useState<EquipmentObj[]>([]);
  // filtered data is the equipment that matches the search filter
  const [filteredData, setFilteredData] = useState<EquipmentObj[]>([]);
  const isManager = useRef<boolean>(false);
  const { user, org } = useUser();
  const { equipmentData } = useEquipment();
  const { setIsLoading } = useLoad();

  // subscribe to and get all equipment in the organization
  useEffect(() => {
    // get all equipment in the organization by concating all equipment arrays
    // from each of the assigned users/storages
    const handleGetEquipment = () => {
      const data = sortOrgEquipment(equipmentData);
      let tableData: EquipmentObj[] = [];
      // Iterate over equipmentData and concatenate the equipment arrays
      data.forEach((assignedEquipment) => {
        tableData = tableData.concat(assignedEquipment.equipment);
      });
      setTableData(tableData);
      setFilteredData(tableData);
    };

    isManager.current = org!.manager === user!.attributes.sub ? true : false;
    handleGetEquipment();
  }, [equipmentData, org, user]);

  // listen for changes in the search bar
  useEffect(() => {
    /*filter the equipment based on the search filter,
    where the equipment label or assigned to name includes the search filter */
    if (searchFilter.length > 0) {
      const filteredData = tableData.filter(
        (equipment) =>
          equipment.label.toLowerCase().includes(searchFilter.toLowerCase()) ||
          equipment.assignedToName
            .toLowerCase()
            .includes(searchFilter.toLowerCase()),
      );
      setFilteredData(filteredData);
    } else {
      setFilteredData(tableData);
    }
  }, [searchFilter, tableData]);

  // delete equipment from the organization
  const handleDelete = async (equipment: EquipmentObj) => {
    try {
      setIsLoading(true);
      const datastoreEquipment = await DataStore.query(Equipment, equipment.id);
      if (datastoreEquipment == null) throw new Error("Equipment not found");
      await DataStore.delete(datastoreEquipment);
      setIsLoading(false);
      Alert.alert("Equipment Deleted Successfully!");
    } catch (error) {
      handleError("handleDelete", error as Error, setIsLoading);
    }
  };

  // make sure the owner wants to delete the equipment
  const handleEdit = (equipment: EquipmentObj) => {
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
          onPress: () => handleDelete(equipment),
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
        {filteredData.map((equipment, index) => (
          <View key={index} style={styles.row}>
            <View style={[styles.cell, { flex: 8 }]}>
              <Text>{equipment.label}</Text>
            </View>
            <View style={[styles.cell, { flex: 10 }]}>
              <Text>{equipment.assignedToName}</Text>
            </View>
            <View style={[styles.cell, { flex: 3 }]}>
              <Text>{equipment.count}</Text>
            </View>
            <TouchableOpacity
              style={styles.icon}
              onPress={() => handleEdit(equipment)}
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
