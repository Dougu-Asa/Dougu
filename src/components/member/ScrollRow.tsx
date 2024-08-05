import React, { useEffect, useRef } from "react";
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
import { chunkEquipment } from "../../helper/DataStoreUtils";

/*
    ScrollRow is a component that allows the user to scroll through a row of
    equipment and containers.
*/
export default function ScrollRow({
  containerSquares,
  listData,
  onLayout,
  setOffset,
  scrollPage,
  determineScroll,
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
  setOffset: (offset: number) => void;
  scrollPage: number;
  determineScroll: (
    e: GestureUpdateEvent<
      PanGestureHandlerEventPayload & PanGestureChangeEventPayload
    >,
  ) => void;
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
  const windowWidth = Dimensions.get("window").width;
  const offsets = windowWidth / 4;
  const scrollViewRef = useRef<ScrollView>(null);
  const chunkedData = chunkEquipment(listData, 4);

  useEffect(() => {
    if (scrollPage < 0) return;
    if (scrollPage > chunkedData.length - 1) return;
    const scrollValue = scrollPage * windowWidth;
    scrollViewRef.current?.scrollTo({ x: scrollValue });
  }, [chunkedData.length, scrollPage, windowWidth]);

  const handleLayout = (
    layoutEvent: LayoutChangeEvent,
    item: ItemObj,
    index: number,
  ) => {
    if (item.type === "equipment") return;
    const { x } = layoutEvent.nativeEvent.layout;
    // calculate grid position for each item
    const containerPosition = Math.ceil(x / offsets) + index * 4;
    containerSquares.current.set(containerPosition, item);
  };

  return (
    <ScrollView
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      ref={scrollViewRef}
      snapToInterval={windowWidth}
      onScroll={(e) => setOffset(e.nativeEvent.contentOffset.x)}
      scrollEventThrottle={8}
      onLayout={onLayout}
      decelerationRate={"fast"}
    >
      {chunkedData.map((chunk, index) => (
        <View key={index} style={styles.scrollRow}>
          {chunk.map((item) => (
            <View
              key={item.id}
              style={styles.item}
              onLayout={(e) => handleLayout(e, item, index)}
            >
              {item.type === "equipment" ? (
                <DraggableEquipment
                  item={item as EquipmentObj}
                  scrollViewRef={scrollViewRef}
                  setItem={setItem}
                  determineScroll={determineScroll}
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
                  determineScroll={determineScroll}
                  onStart={onStart}
                  onMove={onMove}
                  onFinalize={onFinalize}
                  onReassign={onReassign}
                />
              )}
            </View>
          ))}
        </View>
      ))}
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
    flexDirection: "row",
    minWidth: Dimensions.get("window").width,
  },
});
