import React from "react";
import { View, Text, StyleSheet, Dimensions, Pressable } from "react-native";
import Entypo from "react-native-vector-icons/Entypo";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import { EquipmentObj } from "../../types/ModelTypes";
import { useEquipment } from "../../helper/EquipmentContext";

/*
  EquipmentItem is a component that displays an equipment object with a label and
  a count. It is used in the DraggableEquipment component to display the equipment
  objects that can be dragged around the screen.
*/
export default function EquipmentItem({
  item,
  count,
}: {
  item: EquipmentObj | null;
  count: number;
}) {
  const { setVisible, setEquipmentItem } = useEquipment();

  const tapGesture = Gesture.Tap()
    .onEnd(() => {
      setEquipmentItem(item);
      setVisible(true);
    })
    .runOnJS(true);

  return (
    <>
      {item && count > 0 && (
        <GestureDetector gesture={tapGesture}>
          <View style={equipment.container}>
            <Pressable
              style={({ pressed }) => [
                {
                  backgroundColor: pressed
                    ? "rgb(100, 155, 175)"
                    : "rgb(135, 206, 235)",
                },
                equipment.equipment,
              ]}
            >
              <Entypo name="camera" size={50} color="black" />
              <View style={equipment.circle}>
                <Text style={equipment.count}>{count}</Text>
              </View>
            </Pressable>
            <View style={{ alignItems: "center", height: 40 }}>
              <Text style={{ fontSize: 12 }}>{item.label}</Text>
            </View>
          </View>
        </GestureDetector>
      )}
    </>
  );
}

const equipment = StyleSheet.create({
  container: {
    alignItems: "center",
    maxWidth: Dimensions.get("window").width / 5,
  },
  equipment: {
    width: Dimensions.get("window").width / 5,
    height: Dimensions.get("window").width / 5,
    borderRadius: Dimensions.get("window").width / 14,
    justifyContent: "center",
    alignItems: "center",
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
