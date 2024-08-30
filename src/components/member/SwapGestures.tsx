import React, { useRef } from "react";
import { View, Text, StyleSheet, LayoutChangeEvent } from "react-native";
import {
  GestureDetector,
  GestureHandlerRootView,
  Gesture,
  PanGestureHandlerEventPayload,
  GestureStateChangeEvent,
} from "react-native-gesture-handler";
import Animated, { runOnJS } from "react-native-reanimated";

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
  moveOutOfContainer,
  reassignContainer,
  reassignEquipment,
} from "../../helper/SwapUtils";
import { useUser } from "../../helper/context/UserContext";
import useSet from "./useSet";
import useHover from "./useHover";

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
  const halfLine = useRef<number>(0);
  const { orgUserStorage } = useUser();
  const { swapContainerVisible } = useEquipment();

  // hooks
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
    clearScroll,
    handleScroll,
  } = useScroll();
  const {
    draggingItem,
    setDraggingItem,
    startSide,
    startIdx,
    setContainerPage,
    containerSetItem,
    handleSetItem,
  } = useSet({
    halfLine,
    topPage,
    bottomPage,
    listOne,
    listTwo,
    decrementCountAtIndex,
  });
  const { size, movingStyles, animateStart, animateMove, animateFinalize } =
    useAnimateOverlay({ setDraggingItem });
  const { handleHover, clearTimeouts, containerHover, hoverContainer } =
    useHover({
      halfLine,
      draggingItem,
      topPage,
      bottomPage,
      size,
      listOne,
      listTwo,
      handleScroll,
      clearScroll,
    });

  const handleLayout = (e: LayoutChangeEvent) => {
    const y = e.nativeEvent.layout.y;
    halfLine.current = y;
  };

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
    if (!orgUserStorage) return;
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
      runOnJS(clearScroll)();
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
