import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Entypo from "react-native-vector-icons/Entypo";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import { ContainerObj } from "../../types/ModelTypes";
import { useEquipment } from "../../helper/EquipmentContext";

/*
  EquipmentItem is a component that displays an equipment object with a label and
  a count. It is used in the DraggableEquipment component to display the equipment
  objects that can be dragged around the screen.
*/
export default function ContainerItem({ item }: { item: ContainerObj | null }) {
  const tapGesture = Gesture.Tap()
    .onEnd(() => {
      console.log("Tap!");
    })
    .runOnJS(true);

  return (
    <>
      {item && (
        <GestureDetector gesture={tapGesture}>
          <View style={equipment.container}>
            <View style={equipment.equipment}>
              <Entypo name="camera" size={50} color="black" />
            </View>
            <Text style={{ fontSize: 12 }}>{item.label}</Text>
          </View>
        </GestureDetector>
      )}
    </>
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
    backgroundColor: "white",
    width: Dimensions.get("window").width / 5,
    height: Dimensions.get("window").width / 5,
    borderRadius: Dimensions.get("window").width / 14,
    justifyContent: "center",
    alignItems: "center",
  },
});
