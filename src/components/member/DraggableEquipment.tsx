import React, { useState } from "react";
import { StyleSheet, Dimensions } from "react-native";
import EquipmentItem from "./EquipmentItem";
import {
  GestureDetector,
  Gesture,
  ScrollView,
  GestureStateChangeEvent,
  PanGestureHandlerEventPayload,
  GestureUpdateEvent,
  PanGestureChangeEventPayload,
  LongPressGestureHandlerEventPayload,
} from "react-native-gesture-handler";
import Animated, { useSharedValue, runOnJS } from "react-native-reanimated";

import { EquipmentObj } from "../../types/ModelTypes";

/*
  Draggable Equipment is a component that allows the user to drag equipment objects
  around the screen. It uses the PanResponder API to handle touch events and the
  Animated API to move the equipment objects.
*/
export default function DraggableEquipment({
  item,
  scrollViewRef,
  setItem,
  onStart,
  onMove,
  onFinalize,
  onReassign,
}: {
  item: EquipmentObj;
  scrollViewRef: React.RefObject<ScrollView>;
  setItem: (
    item: EquipmentObj,
    gestureState: GestureStateChangeEvent<LongPressGestureHandlerEventPayload>,
  ) => void;
  onStart: (
    e: GestureStateChangeEvent<LongPressGestureHandlerEventPayload>,
  ) => void;
  onMove: (
    e: GestureUpdateEvent<
      PanGestureHandlerEventPayload & PanGestureChangeEventPayload
    >,
  ) => void;
  onFinalize: () => void;
  onReassign: (
    e: GestureStateChangeEvent<PanGestureHandlerEventPayload>,
  ) => void;
}) {
  let isDragging = useSharedValue(false);
  const [stateDragging, setStateDragging] = useState(false);

  const panGesture = Gesture.Pan()
    .onChange((e) => {
      "worklet";
      if (!isDragging.value) return;
      onMove(e);
    })
    .onFinalize((e) => {
      "worklet";
      isDragging.value = false;
      onFinalize();
      runOnJS(onReassign)(e);
      // looks weird if the item immediately reappears
      runOnJS(setStateDragging)(false);
    })
    .requireExternalGestureToFail(scrollViewRef)
    .activateAfterLongPress(0);

  const longPressGesture = Gesture.LongPress().onStart((e) => {
    "worklet";
    isDragging.value = true;
    onStart(e);
    runOnJS(setItem)(item, e);
    runOnJS(setStateDragging)(true);
  });
  const panPressGesture = Gesture.Simultaneous(panGesture, longPressGesture);

  return (
    <GestureDetector gesture={panPressGesture}>
      <Animated.View style={styles.container}>
        <EquipmentItem
          item={item}
          count={stateDragging ? item.count - 1 : item.count}
        />
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get("window").width / 5,
    height: Dimensions.get("window").width / 5,
    marginHorizontal: 8,
  },
});
