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
} from "react-native-gesture-handler";
import Animated, {
  ZoomIn,
  ZoomOut,
  FadeIn,
  FadeOut,
} from "react-native-reanimated";

import { useEquipment } from "../../helper/context/EquipmentContext";
import { chunkEquipment } from "../../helper/EquipmentUtils";
import { EquipmentObj } from "../../types/ModelTypes";
import { containerOverlayStyles } from "../../styles/ContainerOverlay";
import EquipmentItem from "./EquipmentItem";
import PaginationDots from "./PaginationDots";

/*
    This overlay is what is shown when the user taps
    on a Container item. This is a special overlay used only
    in swapEquipment screen to pass props from screen to overlay
*/
export default function SwapContainerOverlay({
  setContainerPage,
  containerCounts,
}: {
  setContainerPage: React.Dispatch<React.SetStateAction<number>>;
  containerCounts: number[];
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
  // for the pagination dots
  const [currentPage, setCurrentPage] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const { width } = Dimensions.get("window");

  const tapGesture = Gesture.Tap()
    .onEnd(() => {
      setSwapContainerVisible(false);
      setContainerItem(null);
    })
    .runOnJS(true);

  // keep track of the current page
  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const pageIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentPage(pageIndex);
    setContainerPage(pageIndex);
  };

  let itemIdx = 0;
  return (
    <>
      {swapContainerVisible && (
        <GestureDetector gesture={tapGesture}>
          <Animated.View
            style={containerOverlayStyles.backDrop}
            entering={FadeIn}
            exiting={FadeOut}
          >
            <View style={containerOverlayStyles.titleContainer}>
              <Text style={containerOverlayStyles.title}>
                {containerItem?.label}
              </Text>
            </View>
            <Animated.View
              style={containerOverlayStyles.itemContainer}
              entering={ZoomIn}
              exiting={ZoomOut}
            >
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
                          {row.map((equip) => {
                            const idx = itemIdx++;
                            return (
                              <View
                                key={equip.id}
                                style={
                                  containerOverlayStyles.equipmentItemContainer
                                }
                              >
                                <EquipmentItem
                                  item={equip as EquipmentObj}
                                  count={containerCounts[idx]}
                                />
                              </View>
                            );
                          })}
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
            </Animated.View>
          </Animated.View>
        </GestureDetector>
      )}
    </>
  );
}
