import React, { useEffect, useRef, useState } from "react";
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
  PanGesture,
  TapGesture,
} from "react-native-gesture-handler";
import { useHeaderHeight } from "@react-navigation/elements";

import { useEquipment } from "../../helper/context/EquipmentContext";
import { chunkEquipment } from "../../helper/EquipmentUtils";
import { EquipmentObj } from "../../types/ModelTypes";
import { containerOverlayStyles } from "../../styles/ContainerOverlay";
import EquipmentItem from "./EquipmentItem";
import PaginationDots from "./PaginationDots";

/*
    This overlay is what is shown when the user taps
    on an equipment item. It displays the equipment item's 
    stats, counts, and grouped equipment items.
*/
export default function SwapContainerOverlay() {
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
                              <EquipmentItem
                                item={equip as EquipmentObj}
                                count={(equip as EquipmentObj).count}
                              />
                            </View>
                          ))}
                        </View>
                      ))}
                    </View>
                  ))}
                </View>
              </ScrollView>
              <PaginationDots
                length={equipmentChunks3.length}
                currIdx={currentPage}
              />
            </View>
          </View>
        </GestureDetector>
      )}
    </>
  );
}
