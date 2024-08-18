import { ScrollView } from "react-native-gesture-handler";
import {
  View,
  StyleSheet,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import React, { useEffect } from "react";

import { ItemObj } from "../../types/ModelTypes";
import { chunkEquipment } from "../../helper/EquipmentUtils";
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
  const chunkedData = chunkEquipment(listData, 4);
  const windowWidth = Dimensions.get("window").width;
  const scrollViewRef = React.useRef<ScrollView>(null);

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
    scrollViewRef.current?.scrollTo({ x: scrollValue });
  }, [chunkedData.length, nextPage, windowWidth]);

  let itemIdx = 0;
  return (
    <>
      <ScrollView
        horizontal={true}
        pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={8}
        ref={scrollViewRef}
      >
        {chunkedData.map((chunk, rowIdx) => (
          <View key={rowIdx} style={styles.scrollRow}>
            {chunk.map((item) => {
              const idx = itemIdx++;
              return (
                <View key={item.id} style={styles.item}>
                  <Item
                    data={item}
                    countData={countData ? countData[idx] : undefined}
                    swapable={isSwap}
                  />
                </View>
              );
            })}
          </View>
        ))}
      </ScrollView>
    </>
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
