import React from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { Dimensions } from "react-native";
import EquipmentItem from "./EquipmentItem";
import { EquipmentObj, ItemObj, ContainerObj } from "../../types/ModelTypes";
import ContainerItem from "./ContainerItem";

/* 
  Displays a user's equipment in a horizontal scroll view
  this represents one row from TeamEquipment
  @param list: list of equipment
  @param name: name of the user
  @returns a view with the user's equipment
*/
export default function UserEquipment({
  list,
  name,
}: {
  list: ItemObj[];
  name: string;
}) {
  return (
    <View style={styles.userContainer}>
      <Text style={styles.scrollText}>{name}</Text>
      <ScrollView
        horizontal={true}
        decelerationRate={"normal"}
        showsHorizontalScrollIndicator={false}
      >
        <View style={styles.scrollTable}>
          <View style={styles.scrollRow}>
            {list.map((item, index) => (
              <View key={index} style={styles.equipmentWrapper}>
                {item.type === "equipment" ? (
                  <EquipmentItem
                    item={item as EquipmentObj}
                    count={(item as EquipmentObj).count}
                  />
                ) : (
                  <ContainerItem item={item as ContainerObj} />
                )}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  equipmentWrapper: {
    marginHorizontal: 8,
  },
  userContainer: {
    minHeight: 200,
    backgroundColor: "white",
  },
  info: {
    height: 80,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  infoTxt: {
    fontSize: 16,
    fontWeight: "bold",
  },
  scrollRow: {
    flex: 1,
    flexDirection: "row",
  },
  scrollTable: {
    flex: 1,
    flexDirection: "column",
    marginHorizontal: 20,
    minWidth: Dimensions.get("window").width,
  },
  scrollText: {
    height: 40,
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 20,
    borderTopColor: "grey",
    borderTopWidth: 0.5,
  },
});
