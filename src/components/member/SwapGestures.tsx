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
import { useHeaderHeight } from "@react-navigation/elements";
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
  const { setSwapContainerVisible } = useEquipment();
  const { orgUserStorage } = useUser();
  const { setIsLoading } = useLoad();
  const [listOneCounts, setListOneCounts] = useState<number[]>([]);
  const [listTwoCounts, setListTwoCounts] = useState<number[]>([]);

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
  const displacement = useHeaderHeight() + 80;
  const halfLine = useRef<number>(0);

  const handleLayout = (e: LayoutChangeEvent) => {
    const y = e.nativeEvent.layout.y;
    halfLine.current = y + displacement;
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
  const topYRange = {
    start: displacement + 40,
    end: displacement + 40 + equipmentWidth,
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
    const absoluteY = gesture.absoluteY;
    let yRange, horizontalOffset, list, setListCounts;
    if (absoluteY < halfLine.current) {
      yRange = topYRange;
      horizontalOffset = topPage * windowWidth;
      list = listOne;
      startSide.current = "top";
      setListCounts = setListOneCounts;
    } else {
      yRange = bottomYRange;
      horizontalOffset = bottomPage * windowWidth;
      list = listTwo;
      startSide.current = "bottom";
      setListCounts = setListTwoCounts;
    }
    if (absoluteY < yRange.start || absoluteY > yRange.end) return;
    // check if the user is hovering over an item
    const idx = Math.ceil((gesture.absoluteX + horizontalOffset) / offset);
    if (idx < 1 || idx > list.length) return;
    // ensure idx is within bounds
    const item = list[idx - 1];
    decrementCountAtIndex(idx - 1, setListCounts);
    startIdx.current = idx - 1;
    setDraggingItem(item);
  };

  const animateStart = (
    gesture: GestureStateChangeEvent<PanGestureHandlerEventPayload>,
  ) => {
    "worklet";
    size.value = withSpring(1.2);
    const halfEquipment = equipmentWidth / 2;
    draggingOffset.value = {
      x: gesture.absoluteX - halfEquipment,
      y: gesture.absoluteY - halfEquipment - displacement,
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

  type direction = "none" | "left" | "right";
  const prevScroll = useRef<direction>("none");
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
  const determineScrollPage = (
    gestureState: GestureUpdateEvent<
      PanGestureChangeEventPayload & PanGestureHandlerEventPayload
    >,
  ) => {
    let changePage, currPage;
    if (gestureState.absoluteY < halfLine.current) {
      changePage = setNextTopPage;
      currPage = topPage;
    } else {
      changePage = setNextBottomPage;
      currPage = bottomPage;
    }
    let currentScroll: direction = "none";
    if (gestureState.absoluteX < 40) {
      currentScroll = "left";
    } else if (gestureState.absoluteX > windowWidth - 40) {
      currentScroll = "right";
    }
    // if we switch scroll areas, clear the timeout and return
    if (currentScroll !== prevScroll.current) {
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
        scrollTimeout.current = null;
      }
      prevScroll.current = currentScroll;
      return;
    } else {
      // if we are in the same scroll area, start a timeout
      if (scrollTimeout.current) {
        return;
      }
      // make sure nextPage is correct before changing page
      scrollTimeout.current = setTimeout(() => {
        if (currentScroll === "left") {
          changePage(currPage - 1);
        } else if (currentScroll === "right") {
          changePage(currPage + 1);
        }
        scrollTimeout.current = null;
      }, 800);
    }
  };

  let prevPosition = "";
  const containerTimeout = useRef<NodeJS.Timeout | null>(null);
  //Determine if an equiment item is hovering over a container item
  //and change the size of the equipment item accordingl
  const handleHover = (
    gestureState: GestureUpdateEvent<
      PanGestureChangeEventPayload & PanGestureHandlerEventPayload
    >,
  ) => {
    if (draggingItem && draggingItem.type === "container") return;
    const top = gestureState.absoluteY < halfLine.current;
    let range = top ? topYRange : bottomYRange;
    let horizontalOffset = top
      ? topPage * windowWidth
      : bottomPage * windowWidth;
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
    changePosition(top, position);
    prevPosition = currPosition;
  };

  const changePosition = (isTop: boolean | null, position: number) => {
    containerItem.current = null;
    size.value = withSpring(1.2);
    // clear timeout
    if (containerTimeout.current) {
      clearTimeout(containerTimeout.current);
      containerTimeout.current = null;
    }
    // check if the grid location has a container item, set a timeout if there is
    const item = isTop ? listOne[position - 1] : listTwo[position - 1];
    console.log("item: ", item);
    if (item && item.type === "container") {
      containerTimeout.current = setTimeout(() => {
        size.value = withSpring(0.7);
        containerItem.current = item as ContainerObj;
        containerTimeout.current = null;
      }, 500);
    }
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
    const dropLocation =
      gestureEvent.absoluteY > halfLine.current ? "bottom" : "top";
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
    }
  };

  const clearTimeouts = () => {
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
      scrollTimeout.current = null;
    }
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
      runOnJS(determineScrollPage)(e);
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
  userText: {
    height: 40,
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 20,
  },
});
