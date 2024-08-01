import React, { useState, useRef, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, LayoutChangeEvent } from "react-native";
import { Dimensions, Alert } from "react-native";
import { DataStore } from "aws-amplify";
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
import { Equipment, OrgUserStorage } from "../../models";
import { useLoad } from "../../helper/LoadingContext";
import { useUser } from "../../helper/UserContext";
import CurrMembersDropdown from "../../components/CurrMembersDropdown";
import DraggableEquipment from "../../components/member/DraggableEquipment";
import { getEquipment } from "../../helper/DataStoreUtils";
import { handleError } from "../../helper/Utils";
import { EquipmentObj, Position, TopOrBottom } from "../../types/ModelTypes";
import EquipmentItem from "../../components/member/EquipmentItem";

/*
  Screen for swapping equipment between the current user and another user
*/
const SwapEquipmentScreen = () => {
  const { setIsLoading } = useLoad();
  const { user, orgUserStorage } = useUser();
  let swapUser = useRef<OrgUserStorage | null>(null);
  const [resetValue, setResetValue] = useState(false);
  let [listOne, setListOne] = useState<EquipmentObj[]>([]);
  let [listTwo, setListTwo] = useState<EquipmentObj[]>([]);

  // gets and sets the equipment for the current user and the swap user
  const setEquipment = useCallback(async () => {
    const equipmentOne = await getEquipment(orgUserStorage!);
    setListOne(equipmentOne ? equipmentOne : []);
    console.log("swapUser.current:", swapUser.current);
    if (swapUser.current != null) {
      const equipmentTwo = await getEquipment(swapUser.current);
      setListTwo(equipmentTwo ? equipmentTwo : []);
    } else {
      setListTwo([]);
    }
  }, [orgUserStorage]);

  // subscribe to changes in equipment
  useEffect(() => {
    const subscription = DataStore.observeQuery(Equipment).subscribe(() => {
      setEquipment();
    });

    // on unmount clear the subscription, and clear the swap user and dropdown
    return () => {
      subscription.unsubscribe();
      swapUser.current = null;
      setResetValue(true);
    };
  }, [user, orgUserStorage, setEquipment]);

  // reassign the equipment to the new OrgUserStorage by the id passed in
  async function reassignEquipment(item: EquipmentObj, assignedTo: string) {
    try {
      setIsLoading(true);
      const swapOrgUserStorage = await DataStore.query(
        OrgUserStorage,
        assignedTo,
      );
      const equip = await DataStore.query(Equipment, item.id);
      if (!swapOrgUserStorage)
        throw new Error("OrgUserStorage does not exist!");
      if (!equip) throw new Error("Equipment does not exist!");
      await DataStore.save(
        Equipment.copyOf(equip, (updated) => {
          updated.assignedTo = swapOrgUserStorage;
          updated.lastUpdatedDate = new Date().toISOString();
        }),
      );
      setIsLoading(false);
      Alert.alert("Swap Successful!");
    } catch (e) {
      handleError("Swap Equipment", e as Error, setIsLoading);
    }
  }

  // get selected user equipment
  const handleSet = (inputUser: OrgUserStorage | null) => {
    console.log("inputUser:", inputUser);
    console.log("swapUser.current:", swapUser.current);
    swapUser.current = inputUser;
    setResetValue(false);
    setEquipment();
  };

  /*
    this section focuses on handling draggin and dropping equipment
    as well as the overlay calculations
  */
  const topOrBottom = useRef<TopOrBottom | null>(null);
  const headerHeight = useHeaderHeight();
  let halfLine = useRef(0);
  // this is half the width of the equipment item (for centering)
  const halfEquipment = Dimensions.get("window").width / 10;
  // these are for handling dragging overlay animation
  const [draggingItem, setDraggingItem] = useState<EquipmentObj | null>(null);
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

  // we need to know where the equipment we start dragging is located
  // and also calculate the offsets of the dragging equipment
  const handleStart = (
    gestureState: GestureStateChangeEvent<LongPressGestureHandlerEventPayload>,
  ) => {
    "worklet";
    size.value = withSpring(1.2);
    topOrBottom.current =
      gestureState.absoluteY > halfLine.current ? "bottom" : "top";
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
    draggingOffset.value = {
      x: gestureState.changeX + draggingOffset.value.x,
      y: gestureState.changeY + draggingOffset.value.y,
    };
  };

  // handle swapping the equipment
  const handleFinalize = (
    gestureEvent: GestureStateChangeEvent<PanGestureHandlerEventPayload>,
  ) => {
    "worklet";
    size.value = withTiming(0, undefined, (isFinished) => {
      if (isFinished) {
        runOnJS(setDraggingItem)(null);
      }
    });
    const assignedTo =
      gestureEvent.absoluteY > halfLine.current ? "bottom" : "top";
    // check that we swap to a different userreturn;
    if (swapUser.current == null || assignedTo === topOrBottom.current) return;
    const swapId =
      assignedTo === "bottom" ? swapUser.current.id : orgUserStorage!.id;
    runOnJS(reassignEquipment)(draggingItem!, swapId);
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
        scrollEventThrottle={10}
        decelerationRate={"normal"}
        showsHorizontalScrollIndicator={false}
        ref={topScrollViewRef}
      >
        <View style={styles.scrollRow} onLayout={onLayout}>
          <View style={styles.scroll}>
            {listOne.map((item) => (
              <DraggableEquipment
                key={item.id}
                item={item}
                scrollViewRef={topScrollViewRef}
                setItem={setDraggingItem}
                onStart={handleStart}
                onMove={handleMove}
                onFinalize={handleFinalize}
              />
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
        scrollEventThrottle={10}
        showsHorizontalScrollIndicator={false}
        ref={bottomScrollViewRef}
      >
        <View style={styles.scrollRow}>
          <View style={styles.scroll}>
            {listTwo.map((item) => (
              <DraggableEquipment
                key={item.id}
                item={item}
                scrollViewRef={bottomScrollViewRef}
                setItem={setDraggingItem}
                onStart={handleStart}
                onMove={handleMove}
                onFinalize={handleFinalize}
              />
            ))}
          </View>
        </View>
      </ScrollView>
      <Animated.View style={[styles.floatingItem, movingStyles]}>
        <EquipmentItem item={draggingItem} count={1} />
      </Animated.View>
    </GestureHandlerRootView>
  );
};

export default SwapEquipmentScreen;

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
