import React, { useRef, useState } from "react";
import { Text, Animated, PanResponder, StyleSheet, View } from "react-native";
import EquipmentItem from "./EquipmentItem";

const DraggableEquipment = ({ item, onDrop, onStart, onMove, onTerminate }) => {
  const pan = useRef(new Animated.ValueXY()).current;
  let dimensions = useRef(null);
  let position = useRef(null);

  // we need to know where the equipment we start dragging is located
  const onLayout = (event) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    position.current = { x, y };
    dimensions.current = { width, height };
  };

  // Check if the touch is within the bounds of the equipment
  const isWithinBounds = (gestureState) => {
    const { x0, y0 } = gestureState;
    const withinXBounds =
      x0 >= position.x && x0 <= position.x + dimensions.width / 2;
    const withinYBounds =
      y0 >= position.y && y0 <= position.y + dimensions.height / 2;
    return withinXBounds && withinYBounds;
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) =>
        isWithinBounds(gestureState),
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt, gestureState) => {
        console.log(item);
        onStart(item, gestureState, position.current); // Pass the item and its start position
      },
      onPanResponderMove: (event, gestureState) => {
        onMove(gestureState); // Pass the gesture state
        Animated.event([null, { dx: pan.x, dy: pan.y }], {
          useNativeDriver: false,
        })(event, gestureState);
      },
      onPanResponderRelease: (e, gesture) => {
        onDrop(item, gesture.moveY); // Pass the item and its drop position
        Animated.spring(pan, {
          toValue: { x: 0, y: 0, zIndex: 0 },
          useNativeDriver: false,
        }).start();
      },
      onPanResponderTerminate: () => {
        onTerminate();
        Animated.spring(pan, {
          toValue: { x: 0, y: 0, zIndex: 0 },
          useNativeDriver: false,
        }).start();
      },
    }),
  ).current;

  return (
    <Animated.View
      onLayout={onLayout}
      style={[pan.getLayout()]}
      {...panResponder.panHandlers}
    >
      <EquipmentItem item={item} />
    </Animated.View>
  );
};

export default DraggableEquipment;
