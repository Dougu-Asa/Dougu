import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, Animated, StyleSheet} from 'react-native';
import { Dimensions } from 'react-native';
import DraggableEquipment from '../../components/DraggableEquipment';
import { useHeaderHeight } from '@react-navigation/elements';

const SwapEquipmentScreen = () => {
  const [listOne, setListOne] = useState([
      { id: 'a1', label: 'a1' },
      { id: 'a2', label: 'a2' },
      { id: 'a3', label: 'a3' },
  ]);
  const [listTwo, setListTwo] = useState([
      { id: 'b1', label: 'b1' },
      { id: 'b2', label: 'b2' },
      { id: 'b3', label: 'b3' },
  ]);

  // we build an absolute overlay to mirror the movements
  // of dragging because we can't drag between scroll views
  const startPosition = useRef(null);
  const [draggingItem, setDraggingItem] = useState(null);
  const [draggingOffset, setDraggingOffset] = useState({ x: 0, y: 0 });
  const initialTouchPoint = useRef({ x: 0, y: 0 });
  const headerHeight = useHeaderHeight();
  let halfLine = useRef(0);
  let fullHeight = useRef(0);
  const [floatingPosition, setFloatingPosition] = useState({ top: 0, left: 0 });
  let scrollOffsetXTop = useRef(0);
  let scrollOffsetXBottom = useRef(0);
  
  // we need to know the size of our container
  const onLayout = (event) => {
    const {x, y, width, height} = event.nativeEvent.layout;
    fullHeight.current = height;
    halfLine.current = (height / 2) + headerHeight;
  };

  // we need to know who we dropped the equipment to
  const handleDrop = (item, dropPositionY) => {
    setDraggingItem(null);
    if (dropPositionY > halfLine.current) { 
      if(startPosition.current == 2) return; // no change if move item into list it's current in
      setListOne((prevListOne) => prevListOne.filter((i) => i.id !== item.id));
      setListTwo((prevListTwo) => [...prevListTwo, item]);    
    } else {
      if(startPosition.current == 1) return; // no change if move item into list it's current in
      setListTwo((prevListTwo) => prevListTwo.filter((i) => i.id !== item.id));
      setListOne((prevListOne) => [...prevListOne, item]);
    }
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
    let posy = (topOrBottom == 2) ? initialPosition.y + (fullHeight.current / 2) + 40 : initialPosition.y + 40;
    let posx = (topOrBottom == 2) ? initialPosition.x - scrollOffsetXBottom.current : initialPosition.x - scrollOffsetXTop.current;
    setFloatingPosition({ top: posy, left: posx });
    initialTouchPoint.current = { x: gestureState.x0, y: gestureState.y0 };
  };

  // we need to know how much the equipment has been moved
  const handleMove = (gestureState) => {
    const dx = gestureState.moveX - initialTouchPoint.current.x;
    const dy = gestureState.moveY - initialTouchPoint.current.y;
    setDraggingOffset({ x: dx, y: dy });
  }

  return (
    <View style={styles.scrollContainer} onLayout={onLayout}>
      <ScrollView horizontal={true}
      onScroll={handleScrollTop}
      scrollEventThrottle={10}
      scrollEnabled={!draggingItem}
      decelerationRate={'normal'}>
        <View style={styles.scrollRow}>
          <Text style={styles.scrollText}>My Equipment</Text>
          <View style={styles.scrollTop}>
            {listOne.map((item) => (
              <DraggableEquipment key={item.id} item={item} onDrop={handleDrop} onStart={handleStart} onMove={handleMove} />
            ))}
          </View>
        </View>
      </ScrollView>
      <ScrollView horizontal={true}
      onScroll={handleScrollBottom}
      scrollEventThrottle={10}
      scrollEnabled={!draggingItem}>
        <View style={styles.scrollRow}>
          <Text style={styles.scrollText}>Other Name</Text>
          <View style={styles.scrollBottom}>
            {listTwo.map((item) => (
              <DraggableEquipment key={item.id} item={item} onDrop={handleDrop} onStart={handleStart} onMove={handleMove} />
            ))}
          </View>
        </View>
      </ScrollView>
      {draggingItem && (
        <Animated.View style={[styles.floatingItem, { transform: [{ translateX: draggingOffset.x }, { translateY: draggingOffset.y }] }, { top: floatingPosition.top, left: floatingPosition.left }]}>
          <Text>{draggingItem.label}</Text>
        </Animated.View>
      )}
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
  scrollRow: {
    flex: 1,
    flexDirection: 'column',
    minWidth: Dimensions.get('window').width, 
    height: Dimensions.get('window').height / 2,
    borderTopColor: 'grey',
    borderTopWidth: 0.5,
  },
  scrollText: {
    height: 40,
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 20,
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
    padding: 20,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100, // Make sure the floating item is rendered above everything else
  },
});