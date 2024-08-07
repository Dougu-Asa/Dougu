import React, { useRef, useState } from "react";
import {
  View,
  Text,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import {
  ScrollView,
  GestureDetector,
  Gesture,
  GestureStateChangeEvent,
  LongPressGestureHandlerEventPayload,
  GestureUpdateEvent,
  PanGestureHandlerEventPayload,
  PanGestureChangeEventPayload,
} from "react-native-gesture-handler";
import { useHeaderHeight } from "@react-navigation/elements";

import { useEquipment } from "../../helper/context/EquipmentContext";
import { chunkEquipment } from "../../helper/EquipmentUtils";
import DraggableEquipment from "./DraggableEquipment";
import { EquipmentObj, ItemObj } from "../../types/ModelTypes";
import { containerOverlayStyles } from "../../styles/ContainerOverlay";

/*
    This overlay is what is shown when the user taps
    on an equipment item. It displays the equipment item's 
    stats, counts, and grouped equipment items.
*/
export default function SwapContainerOverlay({
  setItem,
  determineScroll,
  onStart,
  onMove,
  onFinalize,
  onReassign,
  onHover,
}: {
  setItem: (
    item: ItemObj,
    gestureState: GestureStateChangeEvent<LongPressGestureHandlerEventPayload>,
  ) => void;
  determineScroll: (
    e: GestureUpdateEvent<
      PanGestureHandlerEventPayload & PanGestureChangeEventPayload
    >,
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
  const {
    containerItem,
    setContainerItem,
    swapContainerVisible,
    setSwapContainerVisible,
  } = useEquipment();
  // equipment is displayed in a 3x3 grid format
  const equipmentChunks = chunkEquipment(containerItem?.equipment ?? [], 9);
  const equipmentChunks3 = equipmentChunks.map((group) =>
    chunkEquipment(group, 3),
  );
  // for the pageination dots
  const [currentPage, setCurrentPage] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const headerHeight = useHeaderHeight();
  const { width, height } = Dimensions.get("window");
  const xRange = {
    min: 0.075 * width,
    max: 0.925 * width,
  };
  const yRange = {
    min: 0.2 * height,
    max: 0.8 * height,
  };

  const tapGesture = Gesture.Tap()
    .onEnd(() => {
      setSwapContainerVisible(false);
      setContainerItem(null);
    })
    .runOnJS(true);

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const pageIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentPage(pageIndex);
  };

  const handleReassign = (
    e: GestureStateChangeEvent<PanGestureHandlerEventPayload>,
  ) => {
    return;
  };

  const handleHover = (
    e: GestureUpdateEvent<
      PanGestureHandlerEventPayload & PanGestureChangeEventPayload
    >,
  ) => {
    // item page is 0.6 device height, and 0.2 down from header
    // it is also 0.85 device width and centered
    // if the gesture is outside of the item page, close the overlay
    const y = e.absoluteY - headerHeight;
    if (
      y < yRange.min ||
      y > yRange.max ||
      e.absoluteX < xRange.min ||
      e.absoluteX > xRange.max
    ) {
      setSwapContainerVisible(false);
      setContainerItem(null);
    }
    return;
  };

  return (
    <>
      {swapContainerVisible && (
        <GestureDetector gesture={tapGesture}>
          <View style={containerOverlayStyles.backDrop}>
            <View style={containerOverlayStyles.titleContainer}>
              <Text style={containerOverlayStyles.title}>
                {containerItem?.label}
              </Text>
            </View>
            <View style={containerOverlayStyles.itemContainer}>
              <ScrollView
                horizontal={true}
                pagingEnabled={true}
                onScroll={onScroll}
                scrollEventThrottle={16}
                showsHorizontalScrollIndicator={false}
                ref={scrollViewRef}
              >
                <View style={containerOverlayStyles.pagesContainer}>
                  {equipmentChunks3.map((page, index) => (
                    <View key={index} style={containerOverlayStyles.itemPage}>
                      {page.map((row, index) => (
                        <View
                          key={`r${index}`}
                          style={containerOverlayStyles.equipmentRow}
                        >
                          {row.map((equip) => (
                            <View
                              key={equip.id}
                              style={
                                containerOverlayStyles.equipmentItemContainer
                              }
                            >
                              <DraggableEquipment
                                item={equip as EquipmentObj}
                                scrollViewRef={scrollViewRef}
                                setItem={setItem}
                                determineScroll={determineScroll}
                                onStart={onStart}
                                onMove={onMove}
                                onFinalize={onFinalize}
                                onReassign={handleReassign}
                                onHover={handleHover}
                              />
                            </View>
                          ))}
                        </View>
                      ))}
                    </View>
                  ))}
                </View>
              </ScrollView>
              <View style={containerOverlayStyles.pagination}>
                {equipmentChunks3.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      containerOverlayStyles.paginationDot,
                      index === currentPage
                        ? containerOverlayStyles.paginationDotActive
                        : containerOverlayStyles.paginationDotInactive,
                    ]}
                  />
                ))}
              </View>
            </View>
          </View>
        </GestureDetector>
      )}
    </>
  );
}
