import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  PanResponderGestureState,
  LayoutChangeEvent,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { Dimensions, Alert } from "react-native";
import { DataStore } from "aws-amplify";
import { useHeaderHeight } from "@react-navigation/elements";

// project imports
import { Equipment, OrgUserStorage } from "../../models";
import { useLoad } from "../../helper/LoadingContext";
import { useUser } from "../../helper/UserContext";
import CurrMembersDropdown from "../../components/CurrMembersDropdown";
import DraggableEquipment from "../../components/member/DraggableEquipment";
import { getEquipment } from "../../helper/DataStoreUtils";
import DraggingOverlay from "../../components/member/DraggingOverlay";
import { handleError } from "../../helper/Error";
import {
  EquipmentObj,
  DraggingOverlayHandle,
  Position,
  TopOrBottom,
} from "../../types/ModelTypes";

/*
  Screen for swapping equipment between the current user and another user
*/
const SwapEquipmentScreen = () => {
  const { setIsLoading } = useLoad();
  const { user, orgUserStorage } = useUser();
  let swapUser = useRef<OrgUserStorage | null>(null);
  const [resetValue, setResetValue] = useState(false);
  const overlayRef = useRef<DraggingOverlayHandle>(null);
  let [listOne, setListOne] = useState<EquipmentObj[]>([]);
  let [listTwo, setListTwo] = useState<EquipmentObj[]>([]);

  // gets and sets the equipment for the current user and the swap user
  const setEquipment = useCallback(async () => {
    const equipmentOne = await getEquipment(orgUserStorage!.id);
    setListOne(equipmentOne ? equipmentOne : []);
    if (swapUser.current != null) {
      const equipmentTwo = await getEquipment(swapUser.current.id);
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
    swapUser.current = inputUser;
    setResetValue(false);
    setEquipment();
  };

  /*
    this section focuses on handling draggin and dropping equipment
    as well as the overlay calculations
  */
  const startPosition = useRef<TopOrBottom | null>(null);
  const initialTouchPoint = useRef({ x: 0, y: 0 });
  const headerHeight = useHeaderHeight();
  let halfLine = useRef(0);
  let rowHeight = useRef(0);
  let scrollOffsetXTop = useRef(0);
  let scrollOffsetXBottom = useRef(0);

  // we need to know the size of our container
  const onLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    halfLine.current = height + 120 + headerHeight;
    rowHeight.current = height;
  };

  // these account for the scroll view's horizontal offset
  const handleScrollTop = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollOffsetXTop.current = event.nativeEvent.contentOffset.x;
  };

  const handleScrollBottom = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    scrollOffsetXBottom.current = event.nativeEvent.contentOffset.x;
  };

  // we need to know where the equipment we start dragging is located
  // and also calculate the offsets of the dragging equipment
  const handleStart = (
    item: EquipmentObj,
    gestureState: PanResponderGestureState,
    initialPosition: Position | null,
  ) => {
    overlayRef.current!.setDraggingItem(item);
    overlayRef.current!.setDraggingOffset({ dx: 0, dy: 0 });
    const topOrBottom = gestureState.y0 > halfLine.current ? "bottom" : "top";
    startPosition.current = topOrBottom;
    const infoAndHeader = 120; // 80 for info, 40 for header
    let posy =
      topOrBottom === "top"
        ? initialPosition!.y + infoAndHeader // due to header offset
        : initialPosition!.y + rowHeight.current + infoAndHeader + 40; // 40 for dropdown
    let posx =
      topOrBottom === "top"
        ? initialPosition!.x - scrollOffsetXTop.current
        : initialPosition!.x - scrollOffsetXBottom.current;
    posx += 20; // due to margin offset
    overlayRef.current!.setStartPosition({ top: posy, left: posx });
    initialTouchPoint.current = { x: gestureState.x0, y: gestureState.y0 };
  };

  // we need to know how much the equipment has been moved
  const handleMove = (gestureState: PanResponderGestureState) => {
    const dx = gestureState.moveX - initialTouchPoint.current.x;
    const dy = gestureState.moveY - initialTouchPoint.current.y;
    overlayRef.current!.setDraggingOffset({ dx: dx, dy: dy });
  };

  // we need to know who we dropped the equipment to
  const handleDrop = async (item: EquipmentObj, dropPositionY: number) => {
    overlayRef.current!.setDraggingItem(null);
    const assignedTo = dropPositionY > halfLine.current ? "bottom" : "top";
    if (swapUser.current == null) return;
    // if the equipment is dropped in the same position
    if (assignedTo === startPosition.current) return;
    const swapId =
      assignedTo === "bottom" ? swapUser.current.id : orgUserStorage!.id;
    reassignEquipment(item, swapId);
  };

  // if the scrollbar interferes with drag
  const handleTerminate = () => {
    overlayRef.current!.setDraggingItem(null);
  };

  return (
    <View style={styles.scrollContainer}>
      <View style={styles.info}>
        <Text style={styles.infoTxt}>
          To swap equipment, drag-and-drop your equipment with a team member!
        </Text>
      </View>
      <Text style={styles.scrollText}>My Equipment</Text>
      <ScrollView
        horizontal={true}
        onScroll={handleScrollTop}
        scrollEventThrottle={10}
        decelerationRate={"normal"}
        showsHorizontalScrollIndicator={false}
      >
        <View style={styles.scrollRow} onLayout={onLayout}>
          <View style={styles.scroll}>
            {listOne.map((item) => (
              <DraggableEquipment
                key={item.id}
                item={item}
                onDrop={handleDrop}
                onStart={handleStart}
                onMove={handleMove}
                onTerminate={handleTerminate}
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
        onScroll={handleScrollBottom}
        scrollEventThrottle={10}
        showsHorizontalScrollIndicator={false}
      >
        <View style={styles.scrollRow}>
          <View style={styles.scroll}>
            {listTwo.map((item) => (
              <DraggableEquipment
                key={item.id}
                item={item}
                onDrop={handleDrop}
                onStart={handleStart}
                onMove={handleMove}
                onTerminate={handleTerminate}
              />
            ))}
          </View>
        </View>
      </ScrollView>
      <DraggingOverlay ref={overlayRef} />
    </View>
  );
};

export default SwapEquipmentScreen;

const styles = StyleSheet.create({
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
