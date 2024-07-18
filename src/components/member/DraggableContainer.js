import React, { useRef, useState } from "react";
import { Text, Animated, PanResponder, StyleSheet, View } from "react-native";

const DraggableEquipment = ({ item, onDrop, onStart, onMove, onTerminate }) => {
  const pan = useRef(new Animated.ValueXY()).current;
  let position = useRef(null);

  // we need to know where the equipment we start dragging is located
  const onLayout = (event) => {
    const { x, y } = event.nativeEvent.layout;
    position.current = { x, y };
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt, gestureState) => {
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
      },
    }),
  ).current;

  return (
    <Animated.View
      onLayout={onLayout}
      style={[pan.getLayout(), styles.equipment]}
      {...panResponder.panHandlers}
    >
      <Text>{item.label}</Text>
      <View style={styles.circle}>
        <Text style={styles.count}>{item.count}</Text>
      </View>
    </Animated.View>
  );
};

export default DraggableEquipment;

const styles = StyleSheet.create({
  equipment: {
    backgroundColor: "skyblue",
    margin: 8,
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: "center",
    alignItems: "center",
  },
  circle: {
    backgroundColor: "white",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    right: 5,
    bottom: 5,
    borderWidth: 1,
  },
  count: {
    fontSize: 10,
    fontWeight: "bold",
  },
});
