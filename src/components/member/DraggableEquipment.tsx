import React, { useRef, useEffect, useState } from "react";
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
const DraggableEquipment = ({
  item,
  scrollViewRef,
  setItem,
  onStart,
  onMove,
  onFinalize,
}: {
  item: EquipmentObj;
  scrollViewRef: React.RefObject<ScrollView>;
  setItem: (item: EquipmentObj) => void;
  onStart: (
    e: GestureStateChangeEvent<LongPressGestureHandlerEventPayload>,
  ) => void;
  onMove: (
    e: GestureUpdateEvent<
      PanGestureHandlerEventPayload & PanGestureChangeEventPayload
    >,
  ) => void;
  onFinalize: (
    e: GestureStateChangeEvent<PanGestureHandlerEventPayload>,
  ) => void;
}) => {
  // avoid stale item state
  const itemRef = useRef(item);

  // update the itemRef when the item changes to avoid stale state
  useEffect(() => {
    itemRef.current = item;
  }, [item]);

  let isDragging = useSharedValue(false);
  const [stateDragging, setStateDragging] = useState(false);

  const panGesture = Gesture.Pan()
    .onChange((e) => {
      "worklet";
      if (!isDragging.value) return;
      try {
        onMove(e);
      } catch (e) {
        console.error("Error moving equipment: ", e);
      }
    })
    .onFinalize((e) => {
      "worklet";
      isDragging.value = false;
      try {
        onFinalize(e);
      } catch (e) {
        console.error("Error dropping equipment: ", e);
      }
      // looks weird if the item immediately reappears
      runOnJS(setStateDragging)(false);
    })
    .requireExternalGestureToFail(scrollViewRef);

  const longPressGesture = Gesture.LongPress().onStart((e) => {
    "worklet";
    isDragging.value = true;
    runOnJS(setItem)(itemRef.current);
    runOnJS(setStateDragging)(true);
    onStart(e);
  });

  const panPressGesture = Gesture.Simultaneous(panGesture, longPressGesture);

  return (
    <GestureDetector gesture={panPressGesture}>
      <Animated.View style={styles.container}>
        <EquipmentItem
          item={itemRef.current}
          count={
            stateDragging ? itemRef.current.count - 1 : itemRef.current.count
          }
        />
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get("window").width / 5,
    height: Dimensions.get("window").width / 5,
    marginHorizontal: 8,
  },
});

export default DraggableEquipment;
