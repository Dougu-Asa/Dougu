import React, { useState, useRef } from 'react';
import { View, Text, PanResponder, Animated, StyleSheet } from 'react-native';
import { Dimensions } from 'react-native'

//const halfWindowsWidth = Dimensions.get('window').width / 2

const DraggableItem = ({ item, onDrop, onStart }) => {
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt, gestureState) => {
        onStart(item, gestureState.y0); // Pass the item and its start position
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (e, gesture) => {
        onDrop(item, gesture.moveY); // Pass the item and its drop position
        Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
      },
    })
  ).current;

  return (
    <Animated.View
      style={[pan.getLayout(), { padding: 10, backgroundColor: 'skyblue', margin: 5 }]}
      {...panResponder.panHandlers}
    >
      <Text>{item.label}</Text>
    </Animated.View>
  );
};

const ListContainer = ({ data, onDrop, onStart }) => {

  return (
    <View style={{ flex: 1, alignItems: 'center' , borderWidth: 1}}>
      {data.map((item) => (
        <DraggableItem key={item.id} item={item} onDrop={onDrop} onStart={onStart} />
      ))}
    </View>
  );
};

const SwapEquipmentScreen = () => {
    const [listOne, setListOne] = useState([
        { id: 'a1', label: 'a1' },
        { id: 'a2', label: 'a2' },
    ]);
    const [listTwo, setListTwo] = useState([
        { id: 'b1', label: 'b1' },
        { id: 'b2', label: 'b2' },
    ]);
    const startPosition = useRef(null);

    const handleDrop = (item, dropPositionY) => {
        console.log("Item: ", item, "Drop Position Y: ", dropPositionY, "Start: ", startPosition.current);
        if (dropPositionY > 300) { 
            if(startPosition.current == 2) return; // no change if move item into list it's current in
            setListOne((prevListOne) => prevListOne.filter((i) => i.id !== item.id));
            setListTwo((prevListTwo) => [...prevListTwo, item]);    
        } else {
            if(startPosition.current == 1) return; // no change if move item into list it's current in
            setListTwo((prevListTwo) => prevListTwo.filter((i) => i.id !== item.id));
            setListOne((prevListOne) => [...prevListOne, item]);
        }
        console.log("List One: ", listOne, "List Two: ", listTwo);
    };

    const handleStart = (item, startY) => {
        console.log("Item: ", item, "Start Y: ", startY);
        startPosition.current = startY > 300 ? 2 : 1;
        console.log("Start: ", startPosition.current);
    };

  return (
    <View style={{ flex: 1, flexDirection: 'col' }}>
        <ListContainer data={listOne} onDrop={handleDrop} onStart={handleStart} />
        <ListContainer data={listTwo} onDrop={handleDrop} onStart={handleStart} />
    </View>
  );
};

export default SwapEquipmentScreen;