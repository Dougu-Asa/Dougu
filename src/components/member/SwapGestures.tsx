import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, LayoutChangeEvent } from "react-native";
import { Dimensions } from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import {
  GestureHandlerRootView,
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
  runOnUI,
} from "react-native-reanimated";

// project imports
import { OrgUserStorage } from "../../models";
import { useUser } from "../../helper/UserContext";
import CurrMembersDropdown from "../../components/CurrMembersDropdown";
import {
  EquipmentObj,
  Position,
  TopOrBottom,
  ContainerObj,
  ItemObj,
} from "../../types/ModelTypes";
import EquipmentItem from "../../components/member/EquipmentItem";
import ContainerItem from "../../components/member/ContainerItem";
import ScrollRow from "./ScrollRow";

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
  const equipmentWidth = Dimensions.get("window").width / 5;
  // so that only 4 items are visible at a time.
  const offset = Dimensions.get("window").width / 4;
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
      x: gestureState.absoluteX - equipmentWidth / 2,
      y: gestureState.absoluteY - headerHeight - 40,
    };
    // save the start position so we can snap back to it at the end
    startPosition.value = {
      x: gestureState.absoluteX - equipmentWidth / 2,
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

  // onHover necessary calculations
  const [topOffset, setTopOffset] = useState(0);
  const [bottomOffset, setBottomOffset] = useState(0);
  // map that keeps track of where the container items are
  const topContainers = useRef(new Map<number, ItemObj>());
  const bottomContainers = useRef(new Map<number, ItemObj>());
  const topYRange = {
    start: headerHeight + 120,
    end: headerHeight + 120 + equipmentWidth,
  };
  const bottomYRange = {
    start: halfLine.current + 40,
    end: halfLine.current + equipmentWidth + 40,
  };
  let prevPosition = "";

  //Determine if an equiment item is hovering over a container item
  //and change the size of the equipment item accordingl
  const handleHover = (
    gestureState: GestureUpdateEvent<
      PanGestureChangeEventPayload & PanGestureHandlerEventPayload
    >,
  ) => {
    const top = gestureState.absoluteY < halfLine.current;
    let range;
    let horizontalOffset;
    if (top) {
      range = topYRange;
      horizontalOffset = topOffset;
    } else {
      range = bottomYRange;
      horizontalOffset = bottomOffset;
    }
    // check if the equipmentItem is within range
    let currPosition;
    let position;
    if (
      gestureState.absoluteY < range.start ||
      gestureState.absoluteY > range.end
    ) {
      currPosition = "out";
      position = 0;
    } else {
      position = Math.ceil(
        (gestureState.absoluteX + horizontalOffset) / offset,
      );
      currPosition = `${top}-${position}`;
    }
    if (currPosition === prevPosition) {
      return;
    }
    console.log("positionKey", currPosition);
    changePosition(top, position);
    prevPosition = currPosition;
  };

  const changePosition = (isTop: boolean | null, position: number) => {
    // position 0 is the out of bounds position
    if (position === 0) {
      size.value = withSpring(1.2);
      return;
    }
    // check if the grid location has a container item
    const map = isTop ? topContainers : bottomContainers;
    if (map.current.has(position)) {
      size.value = withSpring(0.7);
    } else size.value = withSpring(1.2);
  };

  return (
    <GestureHandlerRootView style={styles.scrollContainer}>
      <View style={styles.info}>
        <Text style={styles.infoTxt}>
          To swap equipment, drag-and-drop your equipment with a team member!
        </Text>
      </View>
      <Text style={styles.scrollText}>My Equipment</Text>
      <ScrollRow
        containerSquares={topContainers}
        listData={listOne}
        onLayout={onLayout}
        setItem={handleSetItem}
        setOffset={setTopOffset}
        onStart={handleStart}
        onMove={handleMove}
        onFinalize={handleFinalize}
        onReassign={handleReassign}
        onHover={handleHover}
      />
      <CurrMembersDropdown
        setUser={(user) => {
          bottomContainers.current.clear();
          handleSet(user);
        }}
        isCreate={false}
        resetValue={resetValue}
      />
      <ScrollRow
        containerSquares={bottomContainers}
        listData={listTwo}
        onLayout={onLayout}
        setItem={handleSetItem}
        setOffset={setBottomOffset}
        onStart={handleStart}
        onMove={handleMove}
        onFinalize={handleFinalize}
        onReassign={handleReassign}
        onHover={handleHover}
      />
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

// 4/5 is taken up by items, 8 equal spaces to share the remaining 1/5
const equipmentSpacing = Dimensions.get("window").width / 40;
const styles = StyleSheet.create({
  item: {
    marginHorizontal: equipmentSpacing,
  },
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
});
