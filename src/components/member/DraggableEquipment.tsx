import React, { useRef } from "react";
import {
  Animated,
  LayoutChangeEvent,
  PanResponder,
  PanResponderGestureState,
  StyleSheet,
  Dimensions,
} from "react-native";
import EquipmentItem from "./EquipmentItem";
import { EquipmentObj } from "../../types/ModelTypes";
import type { DimensionsType, Position } from "../../types/ModelTypes";

/*
  Draggable Equipment is a component that allows the user to drag equipment objects
  around the screen. It uses the PanResponder API to handle touch events and the
  Animated API to move the equipment objects.
*/
const DraggableEquipment = ({
  item,
  onDrop,
  onStart,
  onMove,
  onTerminate,
}: {
  item: EquipmentObj;
  onDrop: (item: EquipmentObj, dropPositionY: number) => void;
  onStart: (
    item: EquipmentObj,
    gestureState: PanResponderGestureState,
    position: Position | null,
  ) => void;
  onMove: (gestureState: PanResponderGestureState) => void;
  onTerminate: () => void;
}) => {
  const pan = useRef(new Animated.ValueXY()).current;
  let dimensions = useRef<DimensionsType | null>(null);
  let position = useRef<Position | null>(null);

  // we need to know where the equipment we start dragging is located
  // get the position and dimensions of the equipment object
  const onLayout = (event: LayoutChangeEvent) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    position.current = { x, y };
    dimensions.current = { width, height };
  };

  // Check if the touch is within the bounds of the equipment
  const isWithinBounds = (gestureState: PanResponderGestureState) => {
    if (!position.current || !dimensions.current) return false;
    const { x0, y0 } = gestureState;
    console.log("current position: ", position.current.x, position.current.y);
    console.log(
      "current dimensions: ",
      dimensions.current.width,
      dimensions.current.height,
    );
    console.log("current touch: ", x0, y0);
    const withinXBounds =
      x0 >= position.current.x &&
      x0 <= position.current.x + dimensions.current.width / 2;
    const withinYBounds =
      y0 >= position.current.y &&
      y0 <= position.current.y + dimensions.current.height / 2;
    console.log("within bounds: ", withinXBounds, withinYBounds);
    return withinXBounds && withinYBounds;
  };

  const panResponder = useRef(
    PanResponder.create({
      // determine whether or not to start the pan responder
      /*onStartShouldSetPanResponder: (evt, gestureState) =>
        isWithinBounds(gestureState), */
      // called when the pan responder is granted/starts moving
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt, gestureState) => {
        console.log(item);
        onStart(item, gestureState, position.current); // Pass the item and its start position
      },
      // called when the pan responder is moving
      onPanResponderMove: (event, gestureState) => {
        onMove(gestureState); // Pass the gesture state
        Animated.event([null, { dx: pan.x, dy: pan.y }], {
          useNativeDriver: false,
        })(event, gestureState);
      },
      // called when the pan responder is released
      onPanResponderRelease: (e, gesture) => {
        onDrop(item, gesture.moveY); // Pass the item and its drop position
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
      },
      // called when the pan responder is terminated
      onPanResponderTerminate: () => {
        onTerminate();
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
      },
    }),
  ).current;

  return (
    <Animated.View
      onLayout={onLayout}
      style={[pan.getLayout(), styles.container]}
      {...panResponder.panHandlers}
    >
      <EquipmentItem item={item} count={item.count} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get("window").width / 4,
    height: Dimensions.get("window").width / 4,
    marginHorizontal: 8,
  },
});

export default DraggableEquipment;
