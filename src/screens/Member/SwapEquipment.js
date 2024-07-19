import React, { useState, useRef, useEffect, useCallback } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { Dimensions, Alert } from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import { DataStore } from "aws-amplify";
import AsyncStorage from "@react-native-async-storage/async-storage";

// project imports
import { Equipment, OrgUserStorage } from "../../models";
import { useLoad } from "../../helper/LoadingContext";
import { useUser } from "../../helper/UserContext";
import CurrMembersDropdown from "../../components/CurrMembersDropdown";
import DraggableEquipment from "../../components/member/DraggableEquipment";
import { getEquipment } from "../../helper/DataStoreUtils";
import DraggingOverlay from "../../components/member/DraggingOverlay";

const SwapEquipmentScreen = () => {
  const { setIsLoading } = useLoad();
  const { user, orgUserStorage } = useUser();
  let swapUser = useRef(null);
  const [resetValue, setResetValue] = useState(false);

  let [listOne, setListOne] = useState([]);
  let [listTwo, setListTwo] = useState([]);

  // subscribe to changes in equipment
  useEffect(() => {
    const subscription = DataStore.observeQuery(Equipment).subscribe(
      (snapshot) => {
        const { items, isSynced } = snapshot;
        console.log(
          `Swap Equipment item count: ${items.length}, isSynced: ${isSynced}`,
        );
        setEquipment();
      },
    );

    // on unmount clear the subscription, and clear the swap user and dropdown
    return () => {
      subscription.unsubscribe();
      swapUser.current = null;
      setResetValue(true);
    };
  }, [user, orgUserStorage, setEquipment]);

  // gets and sets the equipment for the current user and the swap user
  const setEquipment = useCallback(async () => {
    const equipmentOne = await getEquipment(orgUserStorage.id);
    setListOne(equipmentOne);
    if (swapUser.current != null) {
      const equipmentTwo = await getEquipment(swapUser.current.id);
      setListTwo(equipmentTwo);
    } else {
      setListTwo([]);
    }
  }, [orgUserStorage]);

  const overlayRef = useRef();
  // we build an absolute overlay to mirror the movements
  // of dragging because we can't drag between scroll views
  const startPosition = useRef(null);
  const initialTouchPoint = useRef({ x: 0, y: 0 });
  const headerHeight = useHeaderHeight();
  let halfLine = useRef(0);
  let rowHeight = useRef(0);
  let scrollOffsetXTop = useRef(0);
  let scrollOffsetXBottom = useRef(0);

  // we need to know the size of our container
  const onLayout = (event) => {
    const { height } = event.nativeEvent.layout;
    halfLine.current = height + 120 + headerHeight;
    rowHeight.current = height;
  };

  // these account for the scroll view's offset
  const handleScrollTop = (event) => {
    scrollOffsetXTop.current = event.nativeEvent.contentOffset.x;
  };

  const handleScrollBottom = (event) => {
    scrollOffsetXBottom.current = event.nativeEvent.contentOffset.x;
  };

  // we need to know where the equipment we start dragging is located
  // and also calculate the offsets
  const handleStart = (item, gestureState, initialPosition) => {
    overlayRef.current.setDraggingItem(item);
    overlayRef.current.setDraggingOffset({ x: 0, y: 0 });
    const topOrBottom = gestureState.y0 > halfLine.current ? 2 : 1;
    startPosition.current = topOrBottom;
    let posy =
      topOrBottom == 2
        ? initialPosition.y + rowHeight.current + 160
        : initialPosition.y + 120; // due to header offset
    let posx =
      topOrBottom == 2
        ? initialPosition.x - scrollOffsetXBottom.current
        : initialPosition.x - scrollOffsetXTop.current;
    posx += 20; // due to margin offset
    overlayRef.current.setFloatingPosition({ top: posy, left: posx });
    initialTouchPoint.current = { x: gestureState.x0, y: gestureState.y0 };
  };

  // we need to know how much the equipment has been moved
  const handleMove = (gestureState) => {
    const dx = gestureState.moveX - initialTouchPoint.current.x;
    const dy = gestureState.moveY - initialTouchPoint.current.y;
    overlayRef.current.setDraggingOffset({ x: dx, y: dy });
  };

  // we need to know who we dropped the equipment to
  const handleDrop = async (item, dropPositionY) => {
    overlayRef.current.setDraggingItem(null);
    if (dropPositionY > halfLine.current) {
      if (startPosition.current == 2) return;
      // drag from top to bottom
      console.log("user -> swap");
      if (swapUser.current == null) {
        Alert.alert("Please select a user to swap equipment with!", [
          { text: "OK" },
        ]);
        return;
      }
      reassignEquipment(item, swapUser.current.id);
    } else {
      if (startPosition.current == 1) return;
      // drag from bottom to top
      console.log("swap -> user");
      reassignEquipment(item, user.attributes.sub);
    }
  };

  // reassign the equipment
  async function reassignEquipment(item, assignedTo) {
    try {
      setIsLoading(true);
      const toCurrentUser = user.attributes.sub == assignedTo ? true : false;
      const key = user.attributes.sub + " currOrg";
      const org = await AsyncStorage.getItem(key);
      const orgJSON = JSON.parse(org);
      let orgUserStorage;
      // current user
      if (toCurrentUser) {
        orgUserStorage = await DataStore.query(OrgUserStorage, (c) =>
          c.and((c) => [
            c.organization.name.eq(orgJSON.name),
            c.user.userId.eq(user.attributes.sub),
          ]),
        );
        orgUserStorage = orgUserStorage[0];
      } else {
        orgUserStorage = await DataStore.query(OrgUserStorage, assignedTo);
      }
      const equip = await DataStore.query(Equipment, item.id);
      if (orgUserStorage == null || orgUserStorage == [] || equip == null) {
        console.log("orgUserStorage: ", orgUserStorage);
        console.log("equip: ", equip);
        throw new Error("User or Equipment not found!");
      }
      const newEquip = await DataStore.save(
        Equipment.copyOf(equip, (updated) => {
          updated.assignedTo = orgUserStorage;
          updated.lastUpdatedDate = new Date().toISOString();
        }),
      );
      setIsLoading(false);
      Alert.alert("Equipment swapped!");
    } catch (e) {
      console.log(e);
      setIsLoading(false);
      Alert.alert("Swap Error!", e.message, [{ text: "OK" }]);
    }
  }

  // if the scrollbar interferes with drag
  const handleTerminate = () => {
    overlayRef.current.setDraggingItem(null);
  };

  // get selected user equipment
  const handleSet = (inputUser) => {
    swapUser.current = inputUser;
    setResetValue(false);
    setEquipment();
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
          <View style={styles.scrollTop}>
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
          <View style={styles.scrollBottom}>
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
    borderWidthTop: 1,
  },
  scrollText: {
    height: 40,
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 20,
    borderTopColor: "grey",
    borderTopWidth: 0.5,
  },
  scrollTop: {
    flex: 1,
    flexDirection: "row",
  },
  scrollBottom: {
    flex: 1,
    flexDirection: "row",
  },
});
