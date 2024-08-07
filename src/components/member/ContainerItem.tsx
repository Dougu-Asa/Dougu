import React from "react";
import { View, Text, Pressable } from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import { ContainerObj, EquipmentObj } from "../../types/ModelTypes";
import { useEquipment } from "../../helper/context/EquipmentContext";
import { chunkEquipment } from "../../helper/EquipmentUtils";
import MiniEquipmentItem from "./MiniEquipmentItem";
import { itemStyles } from "../../styles/ItemStyles";

/*
  EquipmentItem is a component that displays an equipment object with a label and
  a count. It is used in the DraggableEquipment component to display the equipment
  objects that can be dragged around the screen.
*/
export default function ContainerItem({
  item,
  swapable,
}: {
  item: ContainerObj | null;
  swapable: boolean;
}) {
  const { setContainerItem, setContainerVisible, setSwapContainerVisible } =
    useEquipment();
  const firstNine = item?.equipment.slice(0, 9);
  const chunkedData = chunkEquipment(firstNine ? firstNine : [], 3);

  const tapGesture = Gesture.Tap()
    .onEnd(() => {
      setContainerItem(item);
      if (swapable) {
        setSwapContainerVisible(true);
      } else {
        setContainerVisible(true);
      }
    })
    .runOnJS(true);

  return (
    <>
      {item && (
        <GestureDetector gesture={tapGesture}>
          <View style={itemStyles.container}>
            <View style={itemStyles.backDrop}>
              <Pressable
                style={({ pressed }) => [
                  {
                    opacity: pressed ? 0.7 : 1,
                  },
                  itemStyles.containerItem,
                ]}
              >
                <View style={itemStyles.table}>
                  {chunkedData.map((row, index) => (
                    <View key={index} style={itemStyles.equipmentRow}>
                      {row.map((equip) => (
                        <View
                          key={equip.id}
                          style={itemStyles.equipmentItemContainer}
                        >
                          <MiniEquipmentItem item={equip as EquipmentObj} />
                        </View>
                      ))}
                    </View>
                  ))}
                </View>
              </Pressable>
            </View>
            <Text style={itemStyles.text}>{item.label}</Text>
          </View>
        </GestureDetector>
      )}
    </>
  );
}
