import React, { useRef, useEffect } from "react";
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
  let isDragging = useRef(false);
  const itemRef = useRef(item); // avoid stale item state

  // update the itemRef when the item changes to avoid stale state
  useEffect(() => {
    itemRef.current = item;
  }, [item]);

  // we need to know where the equipment we start dragging is located
  // get the position and dimensions of the equipment object
  const onLayout = (event: LayoutChangeEvent) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    position.current = { x, y };
    dimensions.current = { width, height };
  };



  const panResponder = useRef(
    PanResponder.create({
      // on first touch, determine whether or not to start the pan responder
      onStartShouldSetPanResponder: () => {
        console.log("start!");
        return true;
      },
      onPanResponderGrant: (e, gestureState) => {
        console.log("grant!");
        onStart(itemRef.current, gestureState, position.current);
        setTimeout(() => {
          isDragging.current = true;
        }, 1500);
      },
      // called when the pan responder is moving
      onPanResponderMove: (event, gestureState) => {
        console.log("isDragging: ", isDragging.current);
        if(!isDragging.current) return;
        console.log("moving!");
        onMove(gestureState); // Pass the gesture state
        Animated.event([null, { dx: pan.x, dy: pan.y }], {
          useNativeDriver: false,
        })(event, gestureState);
      },
      // called when the pan responder is released
      onPanResponderRelease: (e, gesture) => {
        console.log("release!");
        onDrop(itemRef.current, gesture.moveY); // Pass the item and its drop position
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
        isDragging.current = false;
      },
      // called when the pan responder is terminated
      onPanResponderTerminate: () => {
        console.log("terminate!");
        onTerminate();
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
        isDragging.current = false;
      },
    }),
  ).current;

  return (
    <Animated.View
      onLayout={onLayout}
      style={[pan.getLayout(), styles.container]}
      {...panResponder.panHandlers}
    >
      <EquipmentItem item={itemRef.current} count={itemRef.current.count} />
    </Animated.View>
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
