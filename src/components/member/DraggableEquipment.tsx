import React, { useRef, useEffect } from "react";
import {
  Animated,
  LayoutChangeEvent,
  PanResponder,
  PanResponderGestureState,
  StyleSheet,
  Dimensions,
  Pressable,
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
  const itemRef = useRef(item); // avoid stale item state
  let dragEnabledRef = useRef(false);
  let timeoutRef = useRef<NodeJS.Timeout | null>(null);

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
      // prioritize panResponder over pressable in equipmentItem
      onMoveShouldSetPanResponder: () => false,
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: () => false,
      onPanResponderGrant: () => {
        console.log("Start Timer!");
        timeoutRef.current = setTimeout(() => {
          dragEnabledRef.current = true;
          console.log("ref Enabled!");
        }, 800);
      },
      onPanResponderMove: (event, gestureState) => {
        console.log("dragRefEnabled: ", dragEnabledRef.current);
        if (dragEnabledRef.current) {
          Animated.event([null, { dx: pan.x, dy: pan.y }], {
            useNativeDriver: false,
          })(event, gestureState);
        }
      },
      onPanResponderRelease: (e, gesture) => {
        console.log("release!");
        //onDrop(itemRef.current, gesture.moveY);
        clearTimeout(timeoutRef.current!);
        dragEnabledRef.current = false;
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
      },
      onPanResponderTerminate: () => {
        console.log("terminate!");
        clearTimeout(timeoutRef.current!);
        dragEnabledRef.current = false;
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
      },
    }),
  ).current;

  const handlePress = () => {
    console.log("press!");
  };

  return (
    <Pressable onLayout={onLayout}>
      <Animated.View
        style={[pan.getLayout(), styles.container]}
        {...panResponder.panHandlers}
      >
        <EquipmentItem item={itemRef.current} count={itemRef.current.count} />
      </Animated.View>
    </Pressable>
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
