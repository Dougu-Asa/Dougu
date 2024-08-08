import { ScrollView } from "react-native-gesture-handler";
import {
  View,
  StyleSheet,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import React, { useState } from "react";

import { ContainerObj, EquipmentObj, ItemObj } from "../../types/ModelTypes";
import { chunkEquipment } from "../../helper/EquipmentUtils";
import EquipmentItem from "./EquipmentItem";
import ContainerItem from "./ContainerItem";
import PaginationDots from "./PaginationDots";

export default function ScrollRow({
  listData,
  setPage,
}: {
  listData: ItemObj[];
  setPage: React.Dispatch<React.SetStateAction<number>>;
}) {
  const chunkedData = chunkEquipment(listData, 4);
  const windowWidth = Dimensions.get("window").width;
  const [currPage, setCurrPage] = useState(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const newPage = Math.round(event.nativeEvent.contentOffset.x / windowWidth);
    setPage(newPage);
    setCurrPage(newPage);
  };

  return (
    <>
      <ScrollView
        horizontal={true}
        pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={8}
      >
        {chunkedData.map((chunk, rowIdx) => (
          <View key={rowIdx} style={styles.scrollRow}>
            {chunk.map((item, itemIdx) => (
              <View key={item.id} style={styles.item}>
                {item.type === "equipment" ? (
                  <EquipmentItem
                    item={item as EquipmentObj}
                    count={(item as EquipmentObj).count}
                  />
                ) : (
                  <ContainerItem item={item as ContainerObj} swapable={true} />
                )}
              </View>
            ))}
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
