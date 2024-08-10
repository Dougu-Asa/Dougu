import React, { useEffect, useRef, useState } from "react";
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
import Animated, {
  runOnJS,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { useEquipment } from "../../helper/context/EquipmentContext";
import {
  ContainerObj,
  EquipmentObj,
  ItemObj,
  Position,
} from "../../types/ModelTypes";
import { OrgUserStorage } from "../../models";
import EquipmentItem from "./EquipmentItem";
import ContainerItem from "./ContainerItem";
import CurrMembersDropdown from "../CurrMembersDropdown";
import ScrollRow from "./ScrollRow";
import {
  addEquipmentToContainer,
  reassignContainer,
  reassignEquipment,
  moveOutOfContainer,
} from "../../helper/SwapUtils";
import { useUser } from "../../helper/context/UserContext";
import { useLoad } from "../../helper/context/LoadingContext";
import SwapContainerOverlay from "./SwapContainerOverlay";

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
  const {
    containerItem,
    setContainerItem,
    swapContainerVisible,
    setSwapContainerVisible,
  } = useEquipment();
  // counts -section: when an item is dragged, the count of that item is decremented
  // this keeps track for both lists and the container overlay
  const [listOneCounts, setListOneCounts] = useState<number[]>([]);
  const [listTwoCounts, setListTwoCounts] = useState<number[]>([]);
  const [containerCounts, setContainerCounts] = useState<number[]>([]);

  const decrementCountAtIndex = (
    index: number,
    setList: React.Dispatch<React.SetStateAction<number[]>>,
  ) => {
    setList((prevCounts) => {
      const newCounts = [...prevCounts];
      if (newCounts[index] > 0) {
        newCounts[index] -= 1;
      }
      return newCounts;
    });
  };

  const incrementCountAtIndex = (
    index: number,
    setList: React.Dispatch<React.SetStateAction<number[]>>,
  ) => {
    setList((prevCounts) => {
      const newCounts = [...prevCounts];
      newCounts[index] += 1;
      return newCounts;
    });
  };

  useEffect(() => {
    setListOneCounts(
      listOne.map((item) => {
        if (item.type === "equipment") {
          return (item as EquipmentObj).count;
        } else {
          return 1;
        }
      }),
    );
    setListTwoCounts(
      listTwo.map((item) => {
        if (item.type === "equipment") {
          return (item as EquipmentObj).count;
        } else {
          return 1;
        }
      }),
    );
  }, [listOne, listTwo]);

  useEffect(() => {
    if (containerItem) {
      setContainerCounts(
        containerItem.equipment.map((item) => (item as EquipmentObj).count),
      );
    }
  }, [containerItem]);

  // distance from the top of the screen to the top of the header
  const halfLine = useRef<number>(0);

  const handleLayout = (e: LayoutChangeEvent) => {
    const y = e.nativeEvent.layout.y;
    halfLine.current = y;
    console.log("halfLine: ", halfLine.current);
  };

  // scroll logic
  const [topPage, setTopPage] = useState(0);
  const [nextTopPage, setNextTopPage] = useState(0);
  const [bottomPage, setBottomPage] = useState(0);
  const [nextBottomPage, setNextBottomPage] = useState(0);

  // hovering logic
  const hoverContainer = useRef<ContainerObj | null>(null);
  const draggingOffset = useSharedValue<Position>({
    x: 0,
    y: 0,
  });
  const size = useSharedValue(1);
  const movingStyles = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: draggingOffset.value.x },
        { translateY: draggingOffset.value.y },
        { scale: size.value },
      ],
    };
  });

  const windowWidth = Dimensions.get("window").width;
  const equipmentWidth = windowWidth / 5;
  const offset = windowWidth / 4;
  const [draggingItem, setDraggingItem] = useState<ItemObj | null>(null);
  // 120 = 80 (infoContainer) + 40 (userText)
  const topYRange = {
    start: 120,
    end: 120 + equipmentWidth,
  };
  const bottomYRange = {
    start: halfLine.current + 40,
    end: halfLine.current + 40 + equipmentWidth,
  };
  const startSide = useRef<"top" | "bottom" | "container">("container");
  const startIdx = useRef<number | null>(null);

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
    const setListCounts = isTop ? setListOneCounts : setListTwoCounts;
    if (y < yRange.start || y > yRange.end) return;
    // check if the user is hovering over an item
    const idx = Math.floor((gesture.x + horizontalOffset) / offset);
    // ensure idx is within bounds
    if (idx < 0 || idx > list.length - 1) return;
    const item = list[idx];
    decrementCountAtIndex(idx, setListCounts);
    startIdx.current = idx;
    setDraggingItem(item);
  };

  const [containerPage, setContainerPage] = useState(0);
  const windowHeight = Dimensions.get("window").height;
  // setting an item while the container overlay is visible
  const containerYRange = {
    start: 0.2 * windowHeight,
    end: 0.7 * windowHeight + 30,
  };
  const containerXRange = {
    start: 0.075 * windowWidth,
    end: 0.925 * windowWidth,
  };
  const containerSetItem = (
    gesture: GestureStateChangeEvent<PanGestureHandlerEventPayload>,
  ) => {
    if (!containerItem) return;
    const x = gesture.x;
    const y = gesture.y;
    // ensure the user is within the container overlay
    if (x < containerXRange.start || x > containerXRange.end) return;
    if (y < containerYRange.start || y > containerYRange.end) return;
    const row = Math.floor((y - containerYRange.start) / (0.18 * windowHeight));
    const col = Math.floor(
      (x - containerXRange.start) / ((windowWidth * 0.85) / 3),
    );
    const idx = containerPage * 9 + row * 3 + col;
    if (idx < 0 || idx > containerItem.equipment.length - 1) return;
    const item = containerItem.equipment[idx];
    decrementCountAtIndex(idx, setContainerCounts);
    startIdx.current = idx;
    startSide.current = "container";
    setDraggingItem(item);
  };

  // we need to know where to start the dragging animation
  const animateStart = (
    gesture: GestureStateChangeEvent<PanGestureHandlerEventPayload>,
  ) => {
    "worklet";
    size.value = withSpring(1.2);
    const halfEquipment = equipmentWidth / 2;
    draggingOffset.value = {
      x: gesture.x - halfEquipment,
      y: gesture.y - halfEquipment,
    };
  };

  // we need to know how much the equipment has been moved
  const animateMove = (
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

  let prevPosition = "";
  const containerTimeout = useRef<NodeJS.Timeout | null>(null);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
  const overlayTimeout = useRef<NodeJS.Timeout | null>(null);
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

  // when dragging an equipment while the container overlay is visible
  const containerHover = (
    gestureState: GestureUpdateEvent<
      PanGestureChangeEventPayload & PanGestureHandlerEventPayload
    >,
  ) => {
    if (!draggingItem) return;
    const x = gestureState.x;
    const y = gestureState.y;
    if (
      x < containerXRange.start ||
      x > containerXRange.end ||
      y < containerYRange.start ||
      y > containerYRange.end
    ) {
      if (overlayTimeout.current) {
        return;
      } else {
        overlayTimeout.current = setTimeout(() => {
          setSwapContainerVisible(false);
          setContainerItem(null);
          overlayTimeout.current = null;
        }, 500);
      }
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

  // determine if the equipment item is hovering over a scroll area
  // and change the page accordingly
  const handleScroll = (isTop: boolean, position: string) => {
    const changePage = isTop ? setNextTopPage : setNextBottomPage;
    const currPage = isTop ? topPage : bottomPage;
    if (scrollTimeout.current) {
      return;
    }
    // make sure nextPage is correct before changing page
    scrollTimeout.current = setTimeout(() => {
      if (position === "left") {
        changePage(currPage - 1);
      } else if (position === "right") {
        changePage(currPage + 1);
      }
      scrollTimeout.current = null;
    }, 800);
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

  // handle finalizing the drag and drop animation
  const animateFinalize = () => {
    "worklet";
    size.value = withTiming(0, undefined, (isFinished) => {
      if (isFinished) {
        runOnJS(setDraggingItem)(null);
      }
    });
  };

  const { orgUserStorage } = useUser();
  const { setIsLoading } = useLoad();
  // decide where to reassign the equipment
  const handleReassign = async (
    gestureEvent: GestureStateChangeEvent<PanGestureHandlerEventPayload>,
  ) => {
    if (!draggingItem || startIdx.current == null) return;
    let setListCounts: React.Dispatch<React.SetStateAction<number[]>>;
    if (startSide.current === "top") {
      setListCounts = setListOneCounts;
    } else if (startSide.current === "bottom") {
      setListCounts = setListTwoCounts;
    } else {
      setListCounts = setContainerCounts;
    }
    incrementCountAtIndex(startIdx.current, setListCounts);
    // equipment -> container
    if (draggingItem.type === "equipment" && hoverContainer.current) {
      console.log("reassigning equipment to container");
      addEquipmentToContainer(
        draggingItem as EquipmentObj,
        hoverContainer.current,
        setIsLoading,
      );
      return;
    }
    if (!orgUserStorage || !swapUser.current) return;
    const assignTo =
      gestureEvent.y < halfLine.current ? orgUserStorage : swapUser.current;
    // dragging a container
    if (draggingItem.type === "container") {
      reassignContainer(draggingItem as ContainerObj, assignTo, setIsLoading);
    } else {
      // dragging equipment
      // check if we are moving equipment out of a container
      if ((draggingItem as EquipmentObj).container != null) {
        moveOutOfContainer(
          draggingItem as EquipmentObj,
          assignTo,
          setIsLoading,
        );
      } else {
        reassignEquipment(draggingItem as EquipmentObj, assignTo, setIsLoading);
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
              countData={listOneCounts}
              setPage={setTopPage}
              nextPage={nextTopPage}
            />
          </View>
          <View style={styles.halfContainer} onLayout={handleLayout}>
            <CurrMembersDropdown setUser={handleSet} isCreate={false} />
            <ScrollRow
              listData={listTwo}
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
  userText: {
    height: 40,
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 20,
  },
});
