import { ScrollView } from "react-native-gesture-handler";
import {
  View,
  StyleSheet,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import React, { useEffect, useState } from "react";

import { ContainerObj, EquipmentObj, ItemObj } from "../../types/ModelTypes";
import { chunkEquipment } from "../../helper/EquipmentUtils";
import EquipmentItem from "./EquipmentItem";
import ContainerItem from "./ContainerItem";
import PaginationDots from "./PaginationDots";

/*
  Handles an individual user row of equipment in swapEquipment screen.
  It tracks current page and renders the equipment in a horizontal scroll view.
*/
export default function ScrollRow({
  listData,
  countData,
  setPage,
  nextPage,
}: {
  listData: ItemObj[];
  countData: number[];
  setPage: React.Dispatch<React.SetStateAction<number>>;
  nextPage: number;
}) {
  // data is displayed as pages of 4 items
  const chunkedData = chunkEquipment(listData, 4);
  const windowWidth = Dimensions.get("window").width;
  const [currPage, setCurrPage] = useState(0);
  const scrollViewRef = React.useRef<ScrollView>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const newPage = Math.round(event.nativeEvent.contentOffset.x / windowWidth);
    setPage(newPage);
    setCurrPage(newPage);
  };

  useEffect(() => {
    if (nextPage < 0) return;
    if (nextPage > chunkedData.length - 1) return;
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
                  {item.type === "equipment" ? (
                    <EquipmentItem
                      item={item as EquipmentObj}
                      count={countData[idx]}
                    />
                  ) : (
                    <ContainerItem
                      item={item as ContainerObj}
                      swapable={true}
                      count={countData[idx]}
                    />
                  )}
                </View>
              );
            })}
          </View>
        ))}
      </ScrollView>
      <PaginationDots length={chunkedData.length} currIdx={currPage} />
    </>
  );
}

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
