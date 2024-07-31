import React, { useRef } from "react";
import { StyleSheet, View, Text, Dimensions } from "react-native";
import {
  GestureDetector,
  Gesture,
  ScrollView,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

function Ball({ scrollViewRef }) {
  const isPressed = useSharedValue(false);
  const offset = useSharedValue({ x: 0, y: 0 });
  let isDragging = useSharedValue(false);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: offset.value.x },
        { translateY: offset.value.y },
        { scale: withSpring(isPressed.value ? 1.2 : 1) },
      ],
      backgroundColor: isPressed.value ? "yellow" : "blue",
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
    })
    .onFinalize(() => {
      "worklet";
      isDragging.value = false;
      isPressed.value = false;
    })
    .requireExternalGestureToFail(scrollViewRef);

  const longPressGesture = Gesture.LongPress().onStart(() => {
    "worklet";
    isDragging.value = true;
    isPressed.value = true;
  });

  const tapGesture = Gesture.Tap().onEnd(() => {
    "worklet";
    console.log("Tapped");
  });

  const panPressGesture = Gesture.Simultaneous(panGesture, longPressGesture);

  return (
    <GestureDetector gesture={panPressGesture}>
      <Animated.View style={[styles.ball, animatedStyles]}>
        <GestureDetector gesture={tapGesture}>
          <View style={[styles.innerBall]}>
            <Text>Inner Text</Text>
          </View>
        </GestureDetector>
      </Animated.View>
    </GestureDetector>
  );
}

export default function SwapTest() {
  const scrollViewRef = useRef(null);

  return (
    <GestureHandlerRootView style={styles.container}>
      <ScrollView style={styles.scrollView} ref={scrollViewRef}>
        <Ball scrollViewRef={scrollViewRef} />
        <Ball scrollViewRef={scrollViewRef} />
        <Ball scrollViewRef={scrollViewRef} />
        <Ball scrollViewRef={scrollViewRef} />
        <Ball scrollViewRef={scrollViewRef} />
        <Ball scrollViewRef={scrollViewRef} />
        <Ball scrollViewRef={scrollViewRef} />
        <Ball scrollViewRef={scrollViewRef} />
        <Ball scrollViewRef={scrollViewRef} />
        <Ball scrollViewRef={scrollViewRef} />
        <Ball scrollViewRef={scrollViewRef} />
        <Ball scrollViewRef={scrollViewRef} />
      </ScrollView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  ball: {
    width: 100,
    height: 100,
    borderRadius: 100,
    backgroundColor: "blue",
    justifyContent: "center",
  },
  innerBall: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: "white",
    alignSelf: "center",
  },
  scrollView: {
    height: 1000,
  },
});
