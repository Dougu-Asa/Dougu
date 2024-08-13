import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  LayoutChangeEvent,
} from "react-native";
import {
  GestureDetector,
  GestureHandlerRootView,
  Gesture,
  PanGestureHandlerEventPayload,
  GestureStateChangeEvent,
  GestureUpdateEvent,
  PanGestureChangeEventPayload,
} from "react-native-gesture-handler";
import Animated, { runOnJS, withSpring } from "react-native-reanimated";

import { useEquipment } from "../../helper/context/EquipmentContext";
import {
  ContainerObj,
  EquipmentObj,
  ItemObj,
  ListCounts,
} from "../../types/ModelTypes";
import { OrgUserStorage } from "../../models";
import EquipmentItem from "./EquipmentItem";
import ContainerItem from "./ContainerItem";
import CurrMembersDropdown from "../CurrMembersDropdown";
import ScrollRow from "./ScrollRow";
import SwapContainerOverlay from "./SwapContainerOverlay";
import { Divider } from "@rneui/base";
import useAnimateOverlay from "./useAnimateOverlay";
import useItemCounts from "./useItemCounts";
import useScroll from "./useScroll";
import {
  addEquipmentToContainer,
  reassignContainer,
  reassignEquipment,
  moveOutOfContainer,
} from "../../helper/SwapUtils";
import { useUser } from "../../helper/context/UserContext";
import useContainer from "./useContainer";

export default function SwapGestures({
  listOne,
  listTwo,
  handleSet,
  swapUser,
}: {
  listOne: ItemObj[];
  listTwo: ItemObj[];
  handleSet: (user: OrgUserStorage | null) => void;
  swapUser: React.MutableRefObject<OrgUserStorage | null>;
}) {
  // state
  const [draggingItem, setDraggingItem] = useState<ItemObj | null>(null);
  const startSide = useRef<"top" | "bottom" | "container" | null>(null);
  const startIdx = useRef<number | null>(null);
  const hoverContainer = useRef<ContainerObj | null>(null);
  const halfLine = useRef<number>(0);

  // hooks
  const { swapContainerVisible } = useEquipment();
  const { size, movingStyles, animateStart, animateMove, animateFinalize } =
    useAnimateOverlay({ setDraggingItem });
  const {
    listOneCounts,
    listTwoCounts,
    containerCounts,
    incrementCountAtIndex,
    decrementCountAtIndex,
  } = useItemCounts({
    listOne,
    listTwo,
  });
  const {
    topPage,
    setTopPage,
    nextTopPage,
    bottomPage,
    setBottomPage,
    nextBottomPage,
    scrollTimeout,
    handleScroll,
  } = useScroll();
  const { setContainerPage, containerSetItem, containerHover, overlayTimeout } =
    useContainer({
      decrementCountAtIndex,
      draggingItem,
      setDraggingItem,
      startIdx,
      startSide,
    });

  const handleLayout = (e: LayoutChangeEvent) => {
    const y = e.nativeEvent.layout.y;
    halfLine.current = y;
  };

  const windowWidth = Dimensions.get("window").width;
  const equipmentWidth = windowWidth / 5;
  const offset = windowWidth / 4;
  const topYRange = {
    start: 140,
    end: 140 + equipmentWidth,
  };
  const bottomYRange = {
    start: halfLine.current + 60,
    end: halfLine.current + 60 + equipmentWidth,
  };

  const handleSetItem = (
    gesture: GestureStateChangeEvent<PanGestureHandlerEventPayload>,
  ) => {
    const y = gesture.y;
    const isTop = y < halfLine.current;
    const yRange = isTop ? topYRange : bottomYRange;
    const horizontalOffset = isTop
      ? topPage * windowWidth
      : bottomPage * windowWidth;
    const list = isTop ? listOne : listTwo;
    startSide.current = isTop ? "top" : "bottom";
    const type = isTop ? "one" : "two";
    if (y < yRange.start || y > yRange.end) return;
    // check if the user is hovering over an item
    const idx = Math.floor((gesture.x + horizontalOffset) / offset);
    // ensure idx is within bounds
    if (idx < 0 || idx > list.length - 1) return;
    const item = list[idx];
    decrementCountAtIndex(idx, type);
    startIdx.current = idx;
    setDraggingItem(item);
  };

  let prevPosition = "";
  const containerTimeout = useRef<NodeJS.Timeout | null>(null);
  const clearTimeouts = () => {
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
      scrollTimeout.current = null;
    }
    if (containerTimeout.current) {
      clearTimeout(containerTimeout.current);
      containerTimeout.current = null;
    }
    if (overlayTimeout.current) {
      clearTimeout(overlayTimeout.current);
      overlayTimeout.current = null;
    }
  };

  //Determine if an equiment item is hovering over a container item
  //and change the size of the equipment item accordingl
  const handleHover = (
    gestureState: GestureUpdateEvent<
      PanGestureChangeEventPayload & PanGestureHandlerEventPayload
    >,
  ) => {
    if (!draggingItem) return;
    const isTop = gestureState.y < halfLine.current;
    const range = isTop ? topYRange : bottomYRange;
    const x = gestureState.x;
    // leftEdge, rightEdge, top-position
    if (x < 40) {
      handlePosition("left", isTop);
    } else if (x > windowWidth - 40) {
      handlePosition("right", isTop);
    } else if (gestureState.y < range.start || gestureState.y > range.end) {
      handlePosition("out", isTop);
    } else {
      const horizontalOffset = isTop
        ? topPage * windowWidth
        : bottomPage * windowWidth;
      const position = Math.floor((gestureState.x + horizontalOffset) / offset);
      handlePosition(`${isTop}-${position}`, isTop, position);
    }
  };

  // handles the case where the equipment item is hovering over a container item
  const handleContainer = (isTop: boolean, index: number) => {
    const list = isTop ? listOne : listTwo;
    const item = list[index];
    if (item && item.type === "container") {
      if (containerTimeout.current) {
        return;
      }
      containerTimeout.current = setTimeout(() => {
        size.value = withSpring(0.7);
        hoverContainer.current = item as ContainerObj;
        containerTimeout.current = null;
      }, 500);
    }
  };

  // depending on the position of the equipment item, call the appropriate function
  const handlePosition = (position: string, isTop: boolean, index?: number) => {
    if (position !== prevPosition) {
      clearTimeouts();
      hoverContainer.current = null;
      size.value = withSpring(1.2);
    } else if (position === "left" || position === "right") {
      // if the equipment item is hovering over a scroll area
      handleScroll(isTop, position);
    } else {
      if (draggingItem?.type === "container" || index == null) return;
      // if the equipment item is hovering over a container item
      handleContainer(isTop, index);
    }
    prevPosition = position;
  };

  const { orgUserStorage } = useUser();
  // decide where to reassign the equipment
  const handleReassign = async (
    gestureEvent: GestureStateChangeEvent<PanGestureHandlerEventPayload>,
  ) => {
    if (!draggingItem || startIdx.current == null) return;
    let countType: ListCounts;
    if (startSide.current === "top") {
      countType = "one";
    } else if (startSide.current === "bottom") {
      countType = "two";
    } else {
      countType = "container";
    }
    incrementCountAtIndex(startIdx.current, countType);
    if (swapContainerVisible) return;
    // equipment -> container
    if (draggingItem.type === "equipment" && hoverContainer.current) {
      console.log("reassigning equipment to container");
      addEquipmentToContainer(
        draggingItem as EquipmentObj,
        hoverContainer.current,
      );
      return;
    }
    if (!orgUserStorage || !swapUser.current) return;
    const assignTo =
      gestureEvent.y < halfLine.current ? orgUserStorage : swapUser.current;
    // dragging a container
    if (draggingItem.type === "container") {
      reassignContainer(draggingItem as ContainerObj, assignTo);
    } else {
      // dragging equipment
      // check if we are moving equipment out of a container
      if ((draggingItem as EquipmentObj).container != null) {
        moveOutOfContainer(draggingItem as EquipmentObj, assignTo);
      } else {
        reassignEquipment(draggingItem as EquipmentObj, assignTo);
      }
    }
  };

  const panPressGesture = Gesture.Pan()
    .maxPointers(1)
    .onStart((e) => {
      "worklet";
      animateStart(e);
      if (swapContainerVisible) runOnJS(containerSetItem)(e);
      else runOnJS(handleSetItem)(e);
    })
    .onChange((e) => {
      "worklet";
      animateMove(e);
      if (swapContainerVisible) runOnJS(containerHover)(e);
      else runOnJS(handleHover)(e);
    })
    .onFinalize((e) => {
      "worklet";
      animateFinalize();
      runOnJS(handleReassign)(e);
      runOnJS(clearTimeouts)();
    })
    .activateAfterLongPress(500);

  return (
    <GestureHandlerRootView>
      <GestureDetector gesture={panPressGesture}>
        <View style={styles.container}>
          <View style={styles.infoContainer}>
            <Text style={styles.infoTxt}>
              Swap equipment by holding then dragging your equipment to a
              member!
            </Text>
          </View>
          <View style={styles.halfContainer}>
            <Text style={styles.userText}>My Equipment</Text>
            <ScrollRow
              listData={listOne}
              isSwap={true}
              countData={listOneCounts}
              setPage={setTopPage}
              nextPage={nextTopPage}
            />
          </View>
          <Divider />
          <View style={styles.halfContainer} onLayout={handleLayout}>
            <View style={styles.spacer}>
              <CurrMembersDropdown setUser={handleSet} isCreate={false} />
            </View>
            <ScrollRow
              listData={listTwo}
              isSwap={true}
              countData={listTwoCounts}
              setPage={setBottomPage}
              nextPage={nextBottomPage}
            />
          </View>
          <SwapContainerOverlay
            setContainerPage={setContainerPage}
            containerCounts={containerCounts}
          />
        </View>
      </GestureDetector>
      <Animated.View style={[styles.floatingItem, movingStyles]}>
        {draggingItem?.type === "equipment" ? (
          <EquipmentItem item={draggingItem as EquipmentObj} count={1} />
        ) : (
          <ContainerItem item={draggingItem as ContainerObj} swapable={false} />
        )}
      </Animated.View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  floatingItem: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  halfContainer: {
    flex: 1,
  },
  infoContainer: {
    height: 80,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    borderBottomColor: "grey",
    borderBottomWidth: 0.5,
  },
  infoTxt: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 20,
  },
  spacer: {
    marginTop: 20,
  },
  userText: {
    height: 40,
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 20,
    marginTop: 20,
  },
});
