import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import { ContainerObj } from "../../types/ModelTypes";
import { useEquipment } from "../../helper/EquipmentContext";

/*
  EquipmentItem is a component that displays an equipment object with a label and
  a count. It is used in the DraggableEquipment component to display the equipment
  objects that can be dragged around the screen.
*/
export default function ContainerItem({ item }: { item: ContainerObj | null }) {
  const { setContainerItem, setContainerVisible } = useEquipment();

  const tapGesture = Gesture.Tap()
    .onEnd(() => {
      setContainerItem(item);
      setContainerVisible(true);
    })
    .runOnJS(true);

  return (
    <>
      {item && (
        <GestureDetector gesture={tapGesture}>
          <View style={equipment.container}>
            <View style={equipment.equipment} />
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
    backgroundColor: "rgba(222, 222, 222, 1)",
    width: Dimensions.get("window").width / 5,
    height: Dimensions.get("window").width / 5,
    borderRadius: Dimensions.get("window").width / 14,
    justifyContent: "center",
    alignItems: "center",
  },
});
