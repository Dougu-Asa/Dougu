import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Entypo from "react-native-vector-icons/Entypo";
import { EquipmentObj } from "../../types/ModelTypes";

/*
  This is basically EquipmentItem but much smaller, as it
  is used inside of container items.
*/
const size = Dimensions.get("window").width / 20;
export default function MiniEquipmentItem({
  item,
}: {
  item: EquipmentObj | null;
}) {
  return (
    <>
      {item && (
        <View style={equipment.equipment}>
          <Entypo name="camera" size={size / 1.8} color="black" />
        </View>
      )}
    </>
  );
}

const equipment = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  equipment: {
    width: size,
    height: size,
    borderRadius: Dimensions.get("window").width / 60,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgb(135, 206, 235)",
  },
});
