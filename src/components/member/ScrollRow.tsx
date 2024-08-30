import {
  View,
  StyleSheet,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  FlatList,
} from "react-native";
import React, { useEffect, useRef } from "react";

import { ItemObj } from "../../types/ModelTypes";
import { chunkArray } from "../../helper/EquipmentUtils";
import Item from "./Item";

/*
  Handles an individual user row of equipment, tracking page and displaying.
  In swapEquipment, it also allows for scrolling to a specific page.
*/
export default function ScrollRow({
  listData,
  isSwap,
  countData,
  setPage,
  nextPage,
}: {
  listData: ItemObj[];
  isSwap: boolean;
  countData?: number[];
  setPage?: React.Dispatch<React.SetStateAction<number>>;
  nextPage?: number;
}) {
  // data is displayed as pages of 4 items
  const chunkedData = chunkArray(listData, 4);
  const windowWidth = Dimensions.get("window").width;
  const flatListRef = useRef<FlatList<ItemObj[]> | null>(null);

  // keep track of the current page
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const newPage = Math.round(event.nativeEvent.contentOffset.x / windowWidth);
    if (setPage) setPage(newPage);
  };

  // scroll to a page if a dragging item hovers over an edge
  useEffect(() => {
    if (nextPage == null) return;
    if (nextPage < 0 || nextPage > chunkedData.length - 1) return;
    const scrollValue = nextPage * windowWidth;
    flatListRef.current?.scrollToOffset({ offset: scrollValue });
  }, [chunkedData.length, flatListRef, nextPage, windowWidth]);

  let itemIdx = 0;
  return (
    <FlatList
      horizontal={true}
      pagingEnabled={true}
      showsHorizontalScrollIndicator={false}
      data={chunkedData}
      renderItem={({ item }) => (
        <View style={styles.scrollRow}>
          {item.map((equip) => {
            const idx = itemIdx++;
            return (
              <View key={equip.id} style={styles.item}>
                <Item
                  data={equip}
                  countData={countData ? countData[idx] : undefined}
                  swapable={isSwap}
                />
              </View>
            );
          })}
        </View>
      )}
      keyExtractor={(item, index) => index.toString()}
      onScroll={handleScroll}
      scrollEventThrottle={8}
      ref={flatListRef}
    />
  );
}

const equipmentSpacing = Dimensions.get("window").width / 25;
const styles = StyleSheet.create({
  item: {
    marginLeft: equipmentSpacing,
  },
  scrollRow: {
    flex: 1,
    flexDirection: "row",
    minWidth: Dimensions.get("window").width,
  },
});
