import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, LayoutChangeEvent } from "react-native";
import { Dimensions } from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import {
  GestureHandlerRootView,
  ScrollView,
  GestureStateChangeEvent,
  PanGestureHandlerEventPayload,
  GestureUpdateEvent,
  PanGestureChangeEventPayload,
  LongPressGestureHandlerEventPayload,
} from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
  withTiming,
} from "react-native-reanimated";

// project imports
import { OrgUserStorage } from "../../models";
import { useUser } from "../../helper/UserContext";
import CurrMembersDropdown from "../../components/CurrMembersDropdown";
import DraggableEquipment from "../../components/member/DraggableEquipment";
import DraggableContainer from "./DraggableContainer";
import {
  EquipmentObj,
  Position,
  TopOrBottom,
  ContainerObj,
  ItemObj,
} from "../../types/ModelTypes";
import EquipmentItem from "../../components/member/EquipmentItem";
import ContainerItem from "../../components/member/ContainerItem";

/*
    this section focuses on handling draggin and dropping equipment
    as well as the overlay calculations. It is intended to handle 
    all the gesture functionality and logic
  */
export default function SwapGestures({
  listOne,
  listTwo,
  handleSet,
  resetValue,
  swapUser,
  reassignEquipment,
}: {
  listOne: ItemObj[];
  listTwo: ItemObj[];
  handleSet: (user: OrgUserStorage | null) => void;
  resetValue: boolean;
  swapUser: React.MutableRefObject<OrgUserStorage | null>;
  reassignEquipment: (equipment: EquipmentObj, swapId: string) => void;
}) {
  const { orgUserStorage } = useUser();
  const start = useRef<TopOrBottom | null>(null);
  const headerHeight = useHeaderHeight();
  let halfLine = useRef(0);
  // this is half the width of the equipment item (for centering)
  const halfEquipment = Dimensions.get("window").width / 10;
  // these are for handling dragging overlay animation
  const [draggingItem, setDraggingItem] = useState<ItemObj | null>(null);
  const draggingOffset = useSharedValue<Position>({
    x: 0,
    y: 0,
  });
  const size = useSharedValue(1);
  const startPosition = useSharedValue<Position>({ x: 0, y: 0 });
  const movingStyles = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: draggingOffset.value.x },
        { translateY: draggingOffset.value.y },
        { scale: size.value },
      ],
    };
  });

  // this is for the scrollview to take priority in scrolling
  const topScrollViewRef = useRef<ScrollView>(null);
  const bottomScrollViewRef = useRef<ScrollView>(null);

  // we need to know the size of our container
  const onLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    halfLine.current = height + 120 + headerHeight;
  };

  // set the equipment item to be dragged through the JS thread
  const handleSetItem = (
    item: ItemObj,
    gestureState: GestureStateChangeEvent<LongPressGestureHandlerEventPayload>,
  ) => {
    setDraggingItem(item);
    start.current =
      gestureState.absoluteY > halfLine.current ? "bottom" : "top";
  };

  // we need to know where the equipment we start dragging is located
  // and also calculate the offsets of the dragging equipment
  const handleStart = (
    gestureState: GestureStateChangeEvent<LongPressGestureHandlerEventPayload>,
  ) => {
    "worklet";
    size.value = withSpring(1.2);
    draggingOffset.value = {
      x: gestureState.absoluteX - halfEquipment,
      y: gestureState.absoluteY - headerHeight - 40,
    };
    // save the start position so we can snap back to it at the end
    startPosition.value = {
      x: gestureState.absoluteX - halfEquipment,
      y: gestureState.absoluteY - headerHeight - 40,
    };
  };

  // we need to know how much the equipment has been moved
  const handleMove = (
    gestureState: GestureUpdateEvent<
      PanGestureChangeEventPayload & PanGestureHandlerEventPayload
    >,
  ) => {
    "worklet";
    console.log("gestureState", gestureState);
    draggingOffset.value = {
      x: gestureState.changeX + draggingOffset.value.x,
      y: gestureState.changeY + draggingOffset.value.y,
    };
  };

  // handle finalizing the drag and drop animation
  const handleFinalize = () => {
    "worklet";
    size.value = withTiming(0, undefined, (isFinished) => {
      if (isFinished) {
        runOnJS(setDraggingItem)(null);
      }
    });
  };

  // decide where to reassign the equipment (this runs on the JS thread)
  const handleReassign = async (
    gestureEvent: GestureStateChangeEvent<PanGestureHandlerEventPayload>,
  ) => {
    const assignedTo =
      gestureEvent.absoluteY > halfLine.current ? "bottom" : "top";
    if (
      swapUser.current == null ||
      assignedTo === start.current ||
      draggingItem == null
    )
      return;
    const swapId =
      assignedTo === "bottom" ? swapUser.current.id : orgUserStorage!.id;
    // SETUP ASSIGNMENTS FOR CONTAINER
    //runOnJS(reassignEquipment)(draggingItem!, swapId);
    setDraggingItem(null);
  };

  const handleLayout = (layoutEvent: LayoutChangeEvent) => {
    const { x, y, width, height } = layoutEvent.nativeEvent.layout;
    console.log(
      "x: " + x + " y: " + y + " width: " + width + " height: " + height,
    );
  };

  return (
    <GestureHandlerRootView style={styles.scrollContainer}>
      <View style={styles.info}>
        <Text style={styles.infoTxt}>
          To swap equipment, drag-and-drop your equipment with a team member!
        </Text>
      </View>
      <Text style={styles.scrollText}>My Equipment</Text>
      <ScrollView
        horizontal={true}
        decelerationRate={"normal"}
        showsHorizontalScrollIndicator={false}
        ref={topScrollViewRef}
      >
        <View style={styles.scrollRow} onLayout={onLayout}>
          <View style={styles.scroll}>
            {listOne.map((item) => (
              <View key={item.id} onLayout={handleLayout}>
                {item.type === "equipment" ? (
                  <DraggableEquipment
                    item={item as EquipmentObj}
                    scrollViewRef={topScrollViewRef}
                    setItem={handleSetItem}
                    onStart={handleStart}
                    onMove={handleMove}
                    onFinalize={handleFinalize}
                    onReassign={handleReassign}
                  />
                ) : (
                  <DraggableContainer
                    item={item as ContainerObj}
                    scrollViewRef={topScrollViewRef}
                    setItem={handleSetItem}
                    onStart={handleStart}
                    onMove={handleMove}
                    onFinalize={handleFinalize}
                    onReassign={handleReassign}
                  />
                )}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      <CurrMembersDropdown
        setUser={handleSet}
        isCreate={false}
        resetValue={resetValue}
      />
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        ref={bottomScrollViewRef}
      >
        <View style={styles.scrollRow}>
          <View style={styles.scroll}>
            {listTwo.map((item) => (
              <View key={item.id} onLayout={handleLayout}>
                {item.type === "equipment" ? (
                  <DraggableEquipment
                    item={item as EquipmentObj}
                    scrollViewRef={bottomScrollViewRef}
                    setItem={handleSetItem}
                    onStart={handleStart}
                    onMove={handleMove}
                    onFinalize={handleFinalize}
                    onReassign={handleReassign}
                  />
                ) : (
                  <DraggableContainer
                    item={item as ContainerObj}
                    scrollViewRef={bottomScrollViewRef}
                    setItem={handleSetItem}
                    onStart={handleStart}
                    onMove={handleMove}
                    onFinalize={handleFinalize}
                    onReassign={handleReassign}
                  />
                )}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      <Animated.View style={[styles.floatingItem, movingStyles]}>
        {draggingItem?.type === "equipment" ? (
          <EquipmentItem item={draggingItem as EquipmentObj} count={1} />
        ) : (
          <ContainerItem item={draggingItem as ContainerObj} />
        )}
      </Animated.View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  floatingItem: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  scrollContainer: {
    height: "100%",
    flexDirection: "column",
    backgroundColor: "white",
  },
  info: {
    height: 80,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  infoTxt: {
    fontSize: 16,
    fontWeight: "bold",
  },
  scrollRow: {
    flex: 1,
    flexDirection: "column",
    marginHorizontal: 20,
    minWidth: Dimensions.get("window").width,
  },
  scrollText: {
    height: 40,
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 20,
    borderTopColor: "grey",
    borderTopWidth: 0.5,
  },
  scroll: {
    flex: 1,
    flexDirection: "row",
  },
  item: {
    margin: 5,
  },
});
