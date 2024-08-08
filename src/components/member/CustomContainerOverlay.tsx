import React, { useState } from "react";
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

import { useEquipment } from "../../helper/context/EquipmentContext";
import { chunkEquipment } from "../../helper/EquipmentUtils";
import EquipmentItem from "./EquipmentItem";
import { EquipmentObj } from "../../types/ModelTypes";
import { containerOverlayStyles } from "../../styles/ContainerOverlay";
import PaginationDots from "./PaginationDots";

/*
    This overlay is what is shown when the user taps
    on an equipment item. It displays the equipment item's 
    stats, counts, and grouped equipment items.
*/
export default function CustomContainerOverlay() {
  const {
    containerVisible,
    setContainerVisible,
    containerItem,
    setContainerItem,
  } = useEquipment();

  // equipment is displayed in a 3x3 grid format
  const equipmentChunks = chunkEquipment(containerItem?.equipment ?? [], 9);
  const equipmentChunks3 = equipmentChunks.map((group) =>
    chunkEquipment(group, 3),
  );
  // for the pageination dots
  const [currentPage, setCurrentPage] = useState(0);

  const tapGesture = Gesture.Tap()
    .onEnd(() => {
      setContainerVisible(false);
      setContainerItem(null);
    })
    .runOnJS(true);

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const pageIndex = Math.round(
      event.nativeEvent.contentOffset.x / Dimensions.get("window").width,
    );
    setCurrentPage(pageIndex);
  };

  return (
    <>
      {containerVisible && (
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
              >
                <View style={{ display: "flex", flexDirection: "row" }}>
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
