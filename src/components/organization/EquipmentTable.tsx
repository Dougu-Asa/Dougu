import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import Entypo from "react-native-vector-icons/Entypo";

import Animated, { LinearTransition } from "react-native-reanimated";

// project imports
import { useUser } from "../../helper/context/UserContext";
import { useLoad } from "../../helper/context/LoadingContext";
import { ContainerObj, EquipmentObj, ItemObj } from "../../types/ModelTypes";
import { sortOrgItems } from "../../helper/EquipmentUtils";
import { useEquipment } from "../../helper/context/EquipmentContext";
import { handleEdit } from "../../helper/EditUtils";

/*
  Component for displaying all equipment in the organization
  in a table format
*/
function SubEquipmentRow({
  equipment,
  isManager,
}: {
  equipment: EquipmentObj;
  isManager: boolean;
}) {
  const { setIsLoading } = useLoad();

  return (
    <View style={styles.row}>
      <View style={[styles.cell, { flex: 2 }]}>
        <Entypo name="minus" size={20} />
      </View>
      <View style={[styles.cell, { flex: 10 }]}>
        <Text style={styles.text}>{equipment.assignedToName}</Text>
      </View>
      <View style={[styles.cell, { flex: 8 }]}>
        <Text style={styles.text}>{equipment.label}</Text>
      </View>
      <View style={[styles.cell, { flex: 3, alignItems: "center" }]}>
        <Text style={styles.text}>{equipment.count}</Text>
      </View>
      <TouchableOpacity
        style={styles.icon}
        onPress={() => handleEdit(equipment, isManager, setIsLoading)}
      >
        <Entypo name="dots-three-vertical" size={20} />
      </TouchableOpacity>
    </View>
  );
}

function TableRow({ item, isManager }: { item: ItemObj; isManager: boolean }) {
  const [openContainer, setOpenContainer] = useState(false);
  const { setIsLoading } = useLoad();

  return (
    <>
      <View style={styles.row}>
        <View style={[styles.cell, { flex: 2 }]}>
          {item.type === "container" && (
            <TouchableOpacity
              style={styles.icon}
              onPress={() => setOpenContainer(!openContainer)}
            >
              {openContainer ? (
                <Entypo name="chevron-down" size={20} />
              ) : (
                <Entypo name="chevron-right" size={20} />
              )}
            </TouchableOpacity>
          )}
        </View>
        <View style={[styles.cell, { flex: 10 }]}>
          <Text style={styles.text}>{item.assignedToName}</Text>
        </View>
        <View style={[styles.cell, { flex: 8 }]}>
          <Text style={styles.text}>{item.label}</Text>
        </View>
        <View style={[styles.cell, { flex: 3, alignItems: "center" }]}>
          <Text style={styles.text}>
            {item.type === "equipment" ? (item as EquipmentObj).count : 1}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.icon}
          onPress={() => handleEdit(item, isManager, setIsLoading)}
        >
          <Entypo name="dots-three-vertical" size={20} />
        </TouchableOpacity>
      </View>
      {item.type === "container" &&
        openContainer &&
        (item as ContainerObj).equipment.map((equipment) => (
          <SubEquipmentRow
            equipment={equipment}
            isManager={isManager}
            key={equipment.id}
          />
        ))}
    </>
  );
}

export default function EquipmentTable({
  searchFilter,
}: {
  searchFilter: string;
}) {
  const tableHead = ["", "Location", "Name", "Count", ""];
  // table data is the equipment in the organization
  const [tableData, setTableData] = useState<ItemObj[]>([]);
  // filtered data is the equipment that matches the search filter
  const [filteredData, setFilteredData] = useState<ItemObj[]>([]);
  const { user, org } = useUser();
  const { itemData } = useEquipment();
  const isManager = org?.manager === user?.id;

  // subscribe to and get all equipment in the organization
  useEffect(() => {
    // get all equipment in the organization by concating all equipment arrays
    // from each of the assigned users/storages
    const handleGetEquipment = () => {
      const data = sortOrgItems(itemData);
      let tableData: ItemObj[] = [];
      // Iterate over equipmentData and concatenate the equipment arrays
      data.forEach((assignedEquipment) => {
        tableData = tableData.concat(assignedEquipment.data);
      });
      setTableData(tableData);
      setFilteredData(tableData);
    };

    handleGetEquipment();
  }, [itemData, org, user]);

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

  return (
    <View style={styles.table}>
      <View style={styles.row}>
        <View style={[styles.cell, { flex: 2 }]}>
          <Text style={styles.headerText}>{tableHead[0]}</Text>
        </View>
        <View style={[styles.cell, { flex: 10 }]}>
          <Text style={styles.headerText}>{tableHead[1]}</Text>
        </View>
        <View style={[styles.cell, { flex: 8 }]}>
          <Text style={styles.headerText}>{tableHead[2]}</Text>
        </View>
        <View style={[styles.cell, { flex: 3 }]}>
          <Text style={styles.headerText}>{tableHead[3]}</Text>
        </View>
        <View style={[styles.cell, { flex: 1 }]}>
          <Text style={styles.headerText}>{tableHead[4]}</Text>
        </View>
      </View>
      <Animated.FlatList
        data={filteredData}
        renderItem={({ item }) => (
          <TableRow item={item} isManager={isManager} />
        )}
        keyExtractor={(item) => item.id}
        itemLayoutAnimation={LinearTransition}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  headerText: {
    color: "gray",
    fontSize: 12,
  },
  cell: {
    marginLeft: 10,
    justifyContent: "center",
  },
  icon: {
    justifyContent: "center",
    marginRight: 5,
  },
  row: {
    flexDirection: "row",
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: "gray",
  },
  table: {
    width: "100%",
  },
  text: {
    fontSize: 12,
  },
});
