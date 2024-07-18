import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Dimensions } from "react-native";
import Entypo from "react-native-vector-icons/Entypo";
import { EquipmentObj } from "../../types/ModelTypes";

export default function EquipmentItem({
  item,
  count,
}: {
  item: EquipmentObj;
  count: number;
}) {
  return (
    <View style={equipment.container}>
      <View style={equipment.equipment}>
        <Entypo name="camera" size={50} color="black" />
        <View style={equipment.circle}>
          <Text style={equipment.count}>{count ? count : item.count}</Text>
        </View>
      </View>
      <Text style={{ fontSize: 12 }}>{item.label}</Text>
    </View>
  );
}

const equipment = StyleSheet.create({
  container: {
    alignItems: "center",
    maxWidth: Dimensions.get("window").width / 4,
    marginHorizontal: 8,
  },
  equipment: {
    backgroundColor: "skyblue",
    width: Dimensions.get("window").width / 4,
    height: Dimensions.get("window").width / 4,
    borderRadius: Dimensions.get("window").width / 8,
    justifyContent: "center",
    alignItems: "center",
  },
  circle: {
    backgroundColor: "white",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    right: 0,
    bottom: 0,
    borderWidth: 1,
  },
  count: {
    fontSize: 10,
    fontWeight: "bold",
  },
});
