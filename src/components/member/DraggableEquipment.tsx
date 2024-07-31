import React, { useRef, useEffect } from "react";
import {
  LayoutChangeEvent,
  PanResponderGestureState,
  StyleSheet,
  Dimensions,
} from "react-native";
import EquipmentItem from "./EquipmentItem";
import { EquipmentObj } from "../../types/ModelTypes";
import type { DimensionsType, Position } from "../../types/ModelTypes";
import {
  GestureDetector,
  Gesture,
  ScrollView,
} from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

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
  scrollViewRef,
}: {
  item: EquipmentObj;
  onDrop: (item: EquipmentObj, dropPositionY: number) => void;
  onStart: (
    item: EquipmentObj,
    gestureState: PanResponderGestureState,
    position: Position | null,
  ) => void;
  onMove: (gestureState) => void;
  onTerminate: () => void;
  scrollViewRef: React.RefObject<ScrollView>;
}) => {
  //const pan = useRef(new Animated.ValueXY()).current;
  let dimensions = useRef<DimensionsType | null>(null);
  let position = useRef<Position | null>(null);
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

  const offset = useSharedValue({ x: 0, y: 0 });
  let isDragging = useSharedValue(false);
  let isPressed = useSharedValue(false);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: offset.value.x },
        { translateY: offset.value.y },
        { scale: withSpring(isPressed.value ? 1.2 : 1) },
      ],
      zIndex: isDragging.value ? 100 : 0,
    };
  });

  const panGesture = Gesture.Pan()
    .onChange((e) => {
      "worklet";
      if (!isDragging.value) return;
      offset.value = {
        x: e.changeX + offset.value.x,
        y: e.changeY + offset.value.y,
      };
      try {
        onMove(e);
      } catch (error) {
        console.error("Error in onMove:", error);
      }
    })
    .onFinalize(() => {
      "worklet";
      isDragging.value = false;
      isPressed.value = false;
      offset.value = withSpring({ x: 0, y: 0 });
    })
    .requireExternalGestureToFail(scrollViewRef);

  const longPressGesture = Gesture.LongPress().onStart(() => {
    "worklet";
    isDragging.value = true;
    isPressed.value = true;
  });

  const panPressGesture = Gesture.Simultaneous(panGesture, longPressGesture);

  return (
    <GestureDetector gesture={panPressGesture}>
      <Animated.View
        onLayout={onLayout}
        style={[styles.container, animatedStyles]}
      >
        <EquipmentItem item={itemRef.current} count={itemRef.current.count} />
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
