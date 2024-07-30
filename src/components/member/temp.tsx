// on first touch, determine whether or not to start the pan responder
onStartShouldSetPanResponder: () => {
    console.log("start!");
    return false;
  },
  onPanResponderGrant: (e, gestureState) => {
    console.log("grant!");
    onStart(itemRef.current, gestureState, position.current);
    console.log("gestureState: ", gestureState);
    setTimeout(() => {
      isDragging.current = true;
    }, 1500);
  },
  // called when the pan responder is moving
  onPanResponderMove: (event, gestureState) => {
    //console.log("isDragging: ", isDragging.current);
    //if (!isDragging.current) return;
    //console.log("moving!");
    onMove(gestureState); // Pass the gesture state
    Animated.event([null, { dx: pan.x, dy: pan.y }], {
      useNativeDriver: false,
    })(event, gestureState);
  },
  // called when the pan responder is released
  onPanResponderRelease: (e, gesture) => {
    console.log("release!");
    onDrop(itemRef.current, gesture.moveY); // Pass the item and its drop position
    Animated.spring(pan, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false,
    }).start();
    isDragging.current = false;
  },
  // called when the pan responder is terminated
  onPanResponderTerminate: () => {
    console.log("terminate!");
    onTerminate();
    Animated.spring(pan, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false,
    }).start();
    isDragging.current = false;
  },