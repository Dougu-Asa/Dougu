import React from "react";
import { View, Text, StyleSheet, Dimensions, Pressable } from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import { ContainerObj, EquipmentObj } from "../../types/ModelTypes";
import { useEquipment } from "../../helper/EquipmentContext";
import { chunkEquipment } from "../../helper/EquipmentUtils";
import MiniEquipmentItem from "./MiniEquipmentItem";

/*
  EquipmentItem is a component that displays an equipment object with a label and
  a count. It is used in the DraggableEquipment component to display the equipment
  objects that can be dragged around the screen.
*/
export default function ContainerItem({ item }: { item: ContainerObj | null }) {
  const { setContainerItem, setContainerVisible } = useEquipment();
  const firstNine = item?.equipment.slice(0, 9);
  const chunkedData = chunkEquipment(firstNine ? firstNine : [], 3);

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
            <Pressable
              style={({ pressed }) => [
                {
                  backgroundColor: pressed
                    ? "rgb(180, 180, 180)"
                    : "rgb(222, 222, 222)",
                },
                equipment.equipment,
              ]}
            >
              <View style={equipment.table}>
                {chunkedData.map((row, index) => (
                  <View key={index} style={equipment.equipmentRow}>
                    {row.map((equip) => (
                      <View
                        key={equip.id}
                        style={equipment.equipmentItemContainer}
                      >
                        <MiniEquipmentItem item={equip as EquipmentObj} />
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            </Pressable>
            <Text style={{ fontSize: 12, overflow: "hidden" }}>
              {item.label}
            </Text>
          </View>
        </GestureDetector>
      )}
    </>
  );
}

const equipment = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  equipment: {
    width: Dimensions.get("window").width / 5,
    height: Dimensions.get("window").width / 5,
    borderRadius: Dimensions.get("window").width / 14,
    flexDirection: "column",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  equipmentRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    flexBasis: "33.33%",
    alignItems: "center",
  },
  equipmentItemContainer: {
    width: "33.33%",
    alignItems: "center",
  },
  table: {
    width: "90%",
    height: "90%",
  },
});
