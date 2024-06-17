import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, Animated, StyleSheet, TouchableOpacity} from 'react-native';
import { Dimensions } from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';
import { useIsFocused } from '@react-navigation/native';
import { DataStore, Auth } from 'aws-amplify';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

// project imports
import { Equipment, OrgUserStorage, Organization, User, UserOrStorage } from '../../models';
import EquipmentItem from '../../components/EquipmentItem';
import { useLoad } from '../../components/LoadingContext';
import { useUser } from '../../components/UserContext';
import CurrMembersDropdown from '../../components/CurrMembersDropdown';
import DraggableEquipment from '../../components/DraggableEquipment';

const SwapEquipmentScreen = () => {
  const {setIsLoading} = useLoad();
  const isFocused = useIsFocused();
  const {user} = useUser();
  const [reset, setReset] = useState(false);

  let [listOne, setListOne] = useState([]);
  let [listTwo, setListTwo] = useState([]);

  useEffect(() => {
    subscribeToChanges();
  }, []);

  useEffect(() => {
    if(isFocused){
      setReset(!reset);
      getEquipment(user.attributes.sub);
      if(swapUser.current != null) getEquipment(swapUser.current.id);
    }
  }, [isFocused]);

  // we build an absolute overlay to mirror the movements
  // of dragging because we can't drag between scroll views
  const startPosition = useRef(null);
  const [draggingItem, setDraggingItem] = useState(null);
  const [draggingOffset, setDraggingOffset] = useState({ x: 0, y: 0 });
  const initialTouchPoint = useRef({ x: 0, y: 0 });
  const headerHeight = useHeaderHeight();
  let halfLine = useRef(0);
  let rowHeight = useRef(0);
  const [floatingPosition, setFloatingPosition] = useState({ top: 0, left: 0 });
  let scrollOffsetXTop = useRef(0);
  let scrollOffsetXBottom = useRef(0);
  let swapUser = useRef(null);
  
  // we need to know the size of our container
  const onLayout = (event) => {
    const {x, y, width, height} = event.nativeEvent.layout;
    halfLine.current = height + 120 + headerHeight;
    rowHeight.current = height;
  };

  // these account for the scroll view's offset
  const handleScrollTop = (event) => {
    scrollOffsetXTop.current = event.nativeEvent.contentOffset.x;
  };

  const handleScrollBottom = (event) => {
    scrollOffsetXBottom.current = event.nativeEvent.contentOffset.x;
  }

  // we need to know where the equipment we start dragging is located
  // and also calculate the offsets
  const handleStart = (item, gestureState, initialPosition) => {
    setDraggingItem(item);
    setDraggingOffset({ x: 0, y: 0 }); 
    const topOrBottom = gestureState.y0 > halfLine.current ? 2 : 1;
    startPosition.current = topOrBottom;
    let posy = (topOrBottom == 2) ? initialPosition.y + rowHeight.current + 160 : initialPosition.y + 120; // due to header offset
    let posx = (topOrBottom == 2) ? initialPosition.x - scrollOffsetXBottom.current : initialPosition.x - scrollOffsetXTop.current;
    posx += 20;   // due to margin offset
    setFloatingPosition({ top: posy, left: posx });
    initialTouchPoint.current = { x: gestureState.x0, y: gestureState.y0 };
  };

  // we need to know how much the equipment has been moved
  const handleMove = (gestureState) => {
    const dx = gestureState.moveX - initialTouchPoint.current.x;
    const dy = gestureState.moveY - initialTouchPoint.current.y;
    setDraggingOffset({ x: dx, y: dy });
  }

   // we need to know who we dropped the equipment to
   const handleDrop = async (item, dropPositionY) => {
    setDraggingItem(null);
    if (dropPositionY > halfLine.current) { 
      if(startPosition.current == 2) return;
      // drag from top to bottom
      console.log('user -> swap');
      if(swapUser.current == null){
        Alert.alert('Please select a user to swap equipment with!', [{text: 'OK'}]);
        return;
      }
      reassignEquipment(item, swapUser.current.id);
    } else {
      if(startPosition.current == 1) return; 
      // drag from bottom to top
      console.log('swap -> user')
      reassignEquipment(item, user.attributes.sub);
    }
  };

  // reassign the equipment
  async function reassignEquipment(item, assignedTo) {
    try {
      setIsLoading(true);
      const toCurrentUser = (user.attributes.sub == assignedTo) ? true : false;
      const key = user.attributes.sub + ' currOrg';
      const org = await AsyncStorage.getItem(key);
      const orgJSON = JSON.parse(org);
      let orgUserStorage;
      // current user
      if(toCurrentUser){
        orgUserStorage = await DataStore.query(OrgUserStorage, (c) => c.and(c => [
          c.organization.name.eq(orgJSON.name),
          c.user.userId.eq(user.attributes.sub),
        ]));
        orgUserStorage = orgUserStorage[0];
      }
      else {
        orgUserStorage = await DataStore.query(OrgUserStorage, assignedTo);
      }
      const equip = await DataStore.query(Equipment, item.id);
      if(orgUserStorage == null || orgUserStorage == [] || equip == null){
        console.log("orgUserStorage: ", orgUserStorage);
        console.log("equip: ", equip);
        throw new Error("User or Equipment not found!");
      }
      const newEquip = await DataStore.save(
        Equipment.copyOf(equip, updated => {
          updated.assignedTo = orgUserStorage;
          updated.lastUpdatedDate = new Date().toISOString();
        })
      );
      setIsLoading(false);
      Alert.alert("Equipment swapped!");
    }
    catch(e){
      console.log(e);
      setIsLoading(false);
      Alert.alert('Swap Error!', e.message, [{text: 'OK'}]);
    }
  }

  // if the scrollbar interferes with drag
  const handleTerminate = () => {
    setDraggingItem(null);
  }

  // get selected user equipment
  const handleSet = (inputUser) => {
    if(inputUser==null) return;
    swapUser.current = inputUser;
    getEquipment(swapUser.current.id);
  }

  async function subscribeToChanges() {
    DataStore.observeQuery(Equipment).subscribe(snapshot => {
        const { items, isSynced } = snapshot;
        console.log(`Swap Equipment item count: ${items.length}, isSynced: ${isSynced}`);
        getEquipment(user.attributes.sub);
        if(swapUser.current != null) getEquipment(swapUser.current.id)
    });
  }
    async function getEquipment(swapId) {
      try{
        const isCurrentUser = (user.attributes.sub == swapId) ? true : false;
        const key = user.attributes.sub + ' currOrg';
        const org = await AsyncStorage.getItem(key);
        const orgJSON = JSON.parse(org);
        // passed in orgUserStorage
        let orgUserStorage;
        if(isCurrentUser){
          orgUserStorage = await DataStore.query(OrgUserStorage, (c) => c.and(c => [
            c.organization.name.eq(orgJSON.name),
            c.user.userId.eq(user.attributes.sub),
            c.type.eq(UserOrStorage.USER)
          ]));
          orgUserStorage = orgUserStorage[0];
        }
        else{
          orgUserStorage = await DataStore.query(OrgUserStorage, swapId);
        }
        const equipment = await DataStore.query(Equipment, (c) => c.assignedTo.id.eq(orgUserStorage.id));
        const equipmentData = processEquipmentData(equipment);
        if(isCurrentUser) setListOne(equipmentData);
        else setListTwo(equipmentData);
      }
      catch(e){
        console.log(e);
        Alert.alert('Swap Get Error!', e.message, [{text: 'OK'}]);
      }
    }

    // get duplicates and merge their counts
    function processEquipmentData(equipment) {
    const equipmentMap = new Map();
    equipment.forEach((equip) => {
      if (equipmentMap.has(equip.name)) {
        const existingEquip = equipmentMap.get(equip.name);
        existingEquip.count += 1; // Increment the count
        existingEquip.data.push(equip.id); // Add the equipment to the data array
        equipmentMap.set(equip.name, existingEquip); // Update the Map
      } else {
        equipmentMap.set(equip.name, {
          id: equip.id, 
          label: equip.name,
          count: 1,
          data: [equip.id],
        });
      }
    });
  
    // Convert the Map back to an array
    const processedEquipmentData = Array.from(equipmentMap.values());
    return processedEquipmentData;
  }  

  return (
    <View style={styles.scrollContainer}>
      <View style={styles.info}>
        <Text style={styles.infoTxt}>To swap equipment, drag-and-drop your equipment with a team member!</Text>
      </View>
      <Text style={styles.scrollText}>My Equipment</Text>
      <ScrollView horizontal={true}
      onScroll={handleScrollTop}
      scrollEventThrottle={10}
      decelerationRate={'normal'}
      showsHorizontalScrollIndicator={false}>
        <View style={styles.scrollRow} onLayout={onLayout}>
          <View style={styles.scrollTop}>
            {listOne.map((item) => (
              <DraggableEquipment key={item.id} item={item} onDrop={handleDrop}
               onStart={handleStart} onMove={handleMove} onTerminate={handleTerminate} />
            ))}
          </View>
        </View>
      </ScrollView>
      <CurrMembersDropdown setUser={handleSet} isCreate={false}/>
      <ScrollView horizontal={true}
      onScroll={handleScrollBottom}
      scrollEventThrottle={10}
      showsHorizontalScrollIndicator={false}
      >
        <View style={styles.scrollRow}>
          <View style={styles.scrollBottom}>
            {listTwo.map((item) => (
              <DraggableEquipment key={item.id} item={item} onDrop={handleDrop}
              onStart={handleStart} onMove={handleMove} onTerminate={handleTerminate} />
            ))}
          </View>
        </View>
      </ScrollView>
      {draggingItem && (
        <Animated.View style={[styles.floatingItem, { transform: [{ translateX: draggingOffset.x }, { translateY: draggingOffset.y }] }, { top: floatingPosition.top, left: floatingPosition.left }]}>
          <EquipmentItem item={draggingItem} count={1} />
        </Animated.View>
      )}
      {(draggingItem != null && draggingItem.count > 1) ?
        <Animated.View style={[styles.floatingItem, { top: floatingPosition.top,
        left: floatingPosition.left }]}>
          <EquipmentItem item={draggingItem} count={draggingItem.count - 1}/>
      </Animated.View> : null}
    </View>
  );
};

export default SwapEquipmentScreen;

const styles = StyleSheet.create({
  scrollContainer: {
    height: '100%',
    flexDirection: 'column', 
    backgroundColor: 'white',
  },
  info: {
    height: 80,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoTxt: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  scrollRow: {
    flex: 1,
    flexDirection: 'column',
    marginHorizontal: 20,
    minWidth: Dimensions.get('window').width, 
    borderWidthTop: 1,
  },
  scrollText: {
    height: 40,
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 20,
    borderTopColor: 'grey',
    borderTopWidth: 0.5,
  },
  scrollTop: {
    flex: 1,
    flexDirection: 'row',
  },
  scrollBottom: {
    flex: 1,
    flexDirection: 'row',
  },
  floatingItem: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100, // Make sure the floating item is rendered above everything else
  },
  circle: {
    backgroundColor: 'white',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 5,
    bottom: 5,
    borderWidth: 1,
  },
  count: {
    fontSize: 10,
    fontWeight: 'bold',
  }
});