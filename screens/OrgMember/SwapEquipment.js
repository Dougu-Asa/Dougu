import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, Animated, StyleSheet, TouchableOpacity} from 'react-native';
import { Dimensions } from 'react-native';
import DraggableEquipment from '../../components/DraggableEquipment';
import { useHeaderHeight } from '@react-navigation/elements';
import CurrMembersDropdown from '../../components/CurrMembersDropdown';
import { useIsFocused } from '@react-navigation/native';
import { DataStore, Auth } from 'aws-amplify';
import { Equipment, OrgUserStorage } from '../../src/models';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SwapEquipmentScreen = () => {
  let [listOne, setListOne] = useState([]);
  let [listTwo, setListTwo] = useState([]);

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
    //halfLine.current = height / 2 + headerHeight + 40;
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
    console.log('droppedItem: ', item);
    setDraggingItem(null);
    if(swapUser.current == null) return;
    if (dropPositionY > halfLine.current) { 
      if(startPosition.current == 2) return;
      // drag from top to bottom
      // user -> swap
      console.log('user -> swap')
      reassignEquipment(item, swapUser.current.userId);
    } else {
      if(startPosition.current == 1) return; 
      // drag from bottom to top
      // swap -> user
      console.log('swap -> user')
      const user = await Auth.currentAuthenticatedUser();
      reassignEquipment(item, user.attributes.sub);
    }
  };

  // reassign the equipment
  async function reassignEquipment(item, assignedTo) {
    const user = await Auth.currentAuthenticatedUser();
    const key = user.attributes.sub + ' currOrg';
    const org = await AsyncStorage.getItem(key);
    const orgJSON = JSON.parse(org);
    const orgUserStorage = await DataStore.query(OrgUserStorage, (c) => c.and(c => [
      c.organization.name.eq(orgJSON.name),
      c.user.userId.eq(assignedTo)
    ]));
    console.log('orgUserStorage: ', orgUserStorage);
    const equip = await DataStore.query(Equipment, item.id);
    console.log(equip);
    /*const newEquip = await DataStore.save(
      Equipment.copyOf(equip, updated => {
        updated.assignedTo = { user: { userId: assignedTo } };
        updated.lastUpdatedDate = new Date().toISOString();
      })
    ); */
    //console.log('newEquipment: ', newEquip);
  }

  // if the scrollbar interferes with drag
  const handleTerminate = () => {
    setDraggingItem(null);
  }

  // get selected user equipment
  const handleSet = (user) => {
    swapUser.current = user;
    subscribeToChanges(false, user.userId);
  }

  // get myUser equipment
  const isFocused = useIsFocused();
  useEffect(() => {
    if(isFocused){
      subscribeToChanges(true, '');
      if(swapUser.current != null) subscribeToChanges(false, swapUser.current.userId)
    }
  }, [isFocused]);
  async function subscribeToChanges(isCurrentUser, swapId) {
    DataStore.observeQuery(Equipment).subscribe(snapshot => {
        const { items, isSynced } = snapshot;
        console.log(`[Snapshot] item count: ${items.length}, isSynced: ${isSynced}`);
        getEquipment(isCurrentUser, swapId);
    });
  }
    async function getEquipment(isCurrentUser, swapId) {
      const user = await Auth.currentAuthenticatedUser();
      const key = user.attributes.sub + ' currOrg';
      const org = await AsyncStorage.getItem(key);
      if(org == null){
          return;
      };
      const userId = isCurrentUser ? user.attributes.sub : swapId;
      const orgJSON = JSON.parse(org);
      const equipment = await DataStore.query(Equipment, (c) => c.and(c => [
          c.organization.id.eq(orgJSON.id),
          c.assignedTo.user.userId.eq(userId),
      ]));
      const equipmentData = processEquipmentData(equipment);
      if(isCurrentUser) setListOne(equipmentData);
      else setListTwo(equipmentData);
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
      <CurrMembersDropdown setUser={handleSet} isCreate={false} />
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
          <Text>{draggingItem.label}</Text>
          <View style={styles.circle}>
            <Text style={styles.count}>1</Text>
          </View>
        </Animated.View>
      )}
      {(draggingItem != null && draggingItem.count > 1) ?
        <Animated.View style={[styles.floatingItem, { top: floatingPosition.top,
        left: floatingPosition.left }]}>
        <Text>{draggingItem.label}</Text>
        <View style={styles.circle}>
          <Text style={styles.count}>{draggingItem.count - 1}</Text>
        </View>
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
    width: 140,
    height: 140,
    borderRadius: 70,
    
    backgroundColor: 'skyblue',
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