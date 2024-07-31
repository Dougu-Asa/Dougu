import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Entypo from "react-native-vector-icons/Entypo";
import { EquipmentObj } from "../../types/ModelTypes";
import { GestureDetector, Gesture } from "react-native-gesture-handler";

/*
  EquipmentItem is a component that displays an equipment object with a label and
  a count. It is used in the DraggableEquipment component to display the equipment
  objects that can be dragged around the screen.
*/
export default function EquipmentItem({
  item,
  count,
}: {
  item: EquipmentObj;
  count: number;
}) {
  const tapGesture = Gesture.Tap().onEnd(() => {
    "worklet";
    console.log("Tapped");
  });

  return (
    <GestureDetector gesture={tapGesture}>
      <View style={equipment.container}>
        <View style={equipment.equipment}>
          <Entypo name="camera" size={50} color="black" />
          <View style={equipment.circle}>
            <Text style={equipment.count}>{count ? count : item.count}</Text>
          </View>
        </View>
        <Text style={{ fontSize: 12 }}>{item.label}</Text>
      </View>
    </GestureDetector>
  );
}

const equipment = StyleSheet.create({
  container: {
    alignItems: "center",
    maxWidth: 100,
  },
  containerPressed: {
    opacity: 0.75,
  },
  equipment: {
    backgroundColor: "skyblue",
    width: Dimensions.get("window").width / 5,
    height: Dimensions.get("window").width / 5,
    borderRadius: Dimensions.get("window").width / 14,
    justifyContent: "center",
    alignItems: "center",
  },
  equipmentPressed: {
    backgroundColor: "red",
  },
  circle: {
    backgroundColor: "white",
    width: 35,
    height: 35,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    right: -7,
    bottom: -7,
    borderWidth: 1,
  },
  count: {
    fontSize: 10,
    fontWeight: "bold",
  },
});
