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
  TopOrBottom,
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
  const { orgUserStorage } = useUser();
  const { setIsLoading } = useLoad();
  const [listOneCounts, setListOneCounts] = useState<number[]>([]);
  const [listTwoCounts, setListTwoCounts] = useState<number[]>([]);
  const { setContainerItem, setSwapContainerVisible } = useEquipment();

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
    console.log("running effect");
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
  const containerItem = useRef<ContainerObj | null>(null);
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
  const startSide = useRef<TopOrBottom | null>(null);
  const startIdx = useRef<number | null>(null);
  const offset = windowWidth / 4;

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
    console.log("gestureState: ", gestureState);
    draggingOffset.value = {
      x: gestureState.changeX + draggingOffset.value.x,
      y: gestureState.changeY + draggingOffset.value.y,
    };
  };

  let prevPosition = "";
  const containerTimeout = useRef<NodeJS.Timeout | null>(null);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  const clearTimeouts = () => {
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
      scrollTimeout.current = null;
    }
    if (containerTimeout.current) {
      clearTimeout(containerTimeout.current);
      containerTimeout.current = null;
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

  const handleContainer = (isTop: boolean, index: number) => {
    const list = isTop ? listOne : listTwo;
    const item = list[index];
    if (item && item.type === "container") {
      if (containerTimeout.current) {
        return;
      }
      containerTimeout.current = setTimeout(() => {
        size.value = withSpring(0.7);
        containerItem.current = item as ContainerObj;
        containerTimeout.current = null;
      }, 500);
    }
  };

  const handlePosition = (position: string, isTop: boolean, index?: number) => {
    if (position !== prevPosition) {
      clearTimeouts();
      containerItem.current = null;
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

  // decide where to reassign the equipment (this runs on the JS thread)
  const handleReassign = async (
    gestureEvent: GestureStateChangeEvent<PanGestureHandlerEventPayload>,
  ) => {
    if (draggingItem == null) return;
    const setListCounts =
      startSide.current === "top" ? setListOneCounts : setListTwoCounts;
    incrementCountAtIndex(startIdx.current as number, setListCounts);
    /*const dropLocation =
      gestureEvent.y > halfLine.current ? "bottom" : "top";
    // equipment -> container
    if (draggingItem.type === "equipment" && containerItem.current) {
      console.log("reassigning equipment to container");
      addEquipmentToContainer(
        draggingItem.id,
        containerItem.current.id,
        setIsLoading,
      );
    }
    if (dropLocation === startSide.current || !swapUser.current) return;
    // now swappping equipment between users
    const assignTo =
      dropLocation === "top" ? orgUserStorage! : swapUser.current;
    if (draggingItem.type === "container") {
      reassignContainer(
        draggingItem as ContainerObj,
        assignTo.id,
        setIsLoading,
      );
    } else {
      reassignEquipment(draggingItem.id, assignTo.id, setIsLoading);
    } */
  };

  const panPressGesture = Gesture.Pan()
    .onStart((e) => {
      "worklet";
      runOnJS(handleSetItem)(e);
      animateStart(e);
    })
    .onChange((e) => {
      "worklet";
      animateMove(e);
      runOnJS(handleHover)(e);
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
              To swap equipment, drag-and-drop your equipment with a team
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
          <SwapContainerOverlay />
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
  },
  userText: {
    height: 40,
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 20,
  },
});
