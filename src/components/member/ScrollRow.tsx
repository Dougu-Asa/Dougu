import React, { useRef } from "react";
import { View, Dimensions, StyleSheet, LayoutChangeEvent } from "react-native";
import {
  ScrollView,
  GestureStateChangeEvent,
  LongPressGestureHandlerEventPayload,
  GestureUpdateEvent,
  PanGestureHandlerEventPayload,
  PanGestureChangeEventPayload,
} from "react-native-gesture-handler";
import { EquipmentObj, ContainerObj, ItemObj } from "../../types/ModelTypes";

import DraggableEquipment from "./DraggableEquipment";
import DraggableContainer from "./DraggableContainer";

/*
    ScrollRow is a component that allows the user to scroll through a row of
    equipment and containers.
*/
export default function ScrollRow({
  containerSquares,
  listData,
  onLayout,
  setOffset,
  setItem,
  onStart,
  onMove,
  onFinalize,
  onReassign,
  onHover,
}: {
  containerSquares: React.MutableRefObject<Map<number, ItemObj>>;
  listData: ItemObj[];
  onLayout: (e: LayoutChangeEvent) => void;
  setOffset: React.Dispatch<React.SetStateAction<number>>;
  setItem: (
    item: ItemObj,
    gestureState: GestureStateChangeEvent<LongPressGestureHandlerEventPayload>,
  ) => void;
  onStart: (
    e: GestureStateChangeEvent<LongPressGestureHandlerEventPayload>,
  ) => void;
  onMove: (
    e: GestureUpdateEvent<
      PanGestureHandlerEventPayload & PanGestureChangeEventPayload
    >,
  ) => void;
  onFinalize: () => void;
  onReassign: (
    e: GestureStateChangeEvent<PanGestureHandlerEventPayload>,
  ) => void;
  onHover: (
    e: GestureUpdateEvent<
      PanGestureHandlerEventPayload & PanGestureChangeEventPayload
    >,
  ) => void;
}) {
  const scrollViewRef = useRef<ScrollView>(null);
  const offsets = Dimensions.get("window").width / 4;

  const handleLayout = (layoutEvent: LayoutChangeEvent, item: ItemObj) => {
    if (item.type === "equipment") return;
    const { x } = layoutEvent.nativeEvent.layout;
    // calculate grid position for each item
    const containerPosition = Math.ceil(x / offsets);
    containerSquares.current.set(containerPosition, item);
    console.log(containerSquares.current);
  };

  return (
    <ScrollView
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      ref={scrollViewRef}
      snapToInterval={offsets}
      onScroll={(e) => setOffset(e.nativeEvent.contentOffset.x)}
      scrollEventThrottle={8}
    >
      <View style={styles.scrollRow} onLayout={onLayout}>
        <View style={styles.scroll}>
          {listData.map((item) => (
            <View
              key={item.id}
              style={styles.item}
              onLayout={(e) => handleLayout(e, item)}
            >
              {item.type === "equipment" ? (
                <DraggableEquipment
                  item={item as EquipmentObj}
                  scrollViewRef={scrollViewRef}
                  setItem={setItem}
                  onStart={onStart}
                  onMove={onMove}
                  onFinalize={onFinalize}
                  onReassign={onReassign}
                  onHover={onHover}
                />
              ) : (
                <DraggableContainer
                  item={item as ContainerObj}
                  scrollViewRef={scrollViewRef}
                  setItem={setItem}
                  onStart={onStart}
                  onMove={onMove}
                  onFinalize={onFinalize}
                  onReassign={onReassign}
                  onHover={onHover}
                />
              )}
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

// 4/5 is taken up by items, 8 equal spaces to share the remaining 1/5
const equipmentSpacing = Dimensions.get("window").width / 40;
const styles = StyleSheet.create({
  item: {
    marginHorizontal: equipmentSpacing,
  },
  scrollRow: {
    flex: 1,
    flexDirection: "column",
    minWidth: Dimensions.get("window").width,
  },
  scroll: {
    flex: 1,
    flexDirection: "row",
  },
});
