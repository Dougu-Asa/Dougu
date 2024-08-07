import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import {
  ScrollView,
  GestureDetector,
  Gesture,
} from "react-native-gesture-handler";

import { useEquipment } from "../../helper/EquipmentContext";
import { chunkEquipment } from "../../helper/EquipmentUtils";
import EquipmentItem from "./EquipmentItem";
import { EquipmentObj } from "../../types/ModelTypes";

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
          <View style={styles.backDrop}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{containerItem?.label}</Text>
            </View>
            <View style={styles.itemContainer}>
              <ScrollView
                horizontal={true}
                pagingEnabled={true}
                onScroll={onScroll}
                scrollEventThrottle={16}
                showsHorizontalScrollIndicator={false}
              >
                <View style={{ display: "flex", flexDirection: "row" }}>
                  {equipmentChunks3.map((page, index) => (
                    <View key={index} style={styles.itemPage}>
                      {page.map((row, index) => (
                        <View key={`r${index}`} style={styles.equipmentRow}>
                          {row.map((equip) => (
                            <View
                              key={equip.id}
                              style={styles.equipmentItemContainer}
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
              <View style={styles.pagination}>
                {equipmentChunks3.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.paginationDot,
                      index === currentPage
                        ? styles.paginationDotActive
                        : styles.paginationDotInactive,
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

// use dimension calculations because equipmentItems require dimensions
const { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
  backDrop: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    alignItems: "center",
    flex: 1,
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  equipmentRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    width: "90%",
    marginLeft: "auto",
    marginRight: "auto",
    flexBasis: "33.33%",
    alignItems: "center",
  },
  equipmentItemContainer: {
    width: "33.33%",
    alignItems: "center",
  },
  itemContainer: {
    marginTop: "10%",
    justifyContent: "center",
    alignItems: "center",
    width: width * 0.85,
    height: height * 0.6,
    borderRadius: 20,
    backgroundColor: "rgb(240, 240, 240)",
  },
  itemPage: {
    display: "flex",
    flexDirection: "column",
    width: width * 0.85,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "black",
  },
  titleContainer: {
    alignItems: "center",
    minHeight: "10%",
    marginTop: "20%",
  },
  divider: {
    height: 1,
    width: "90%",
    backgroundColor: "black",
    marginVertical: 10,
  },
  pagination: {
    flexDirection: "row",
    height: 30,
    alignItems: "center",
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 2,
  },
  paginationDotInactive: {
    backgroundColor: "gray",
  },
  paginationDotActive: {
    backgroundColor: "black",
  },
});
