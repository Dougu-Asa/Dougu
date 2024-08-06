import React from "react";
import { View, Text, StyleSheet, Pressable, Dimensions } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { useEquipment } from "../../helper/EquipmentContext";
import { chunkEquipment } from "../../helper/EquipmentUtils";
import EquipmentItem from "./EquipmentItem";

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

  const closeContainer = () => {
    setContainerVisible(false);
    setContainerItem(null);
  };

  const equipmentChunks = chunkEquipment(containerItem?.equipment ?? [], 9);

  return (
    <>
      {containerVisible && (
        <Pressable style={styles.screen} onPress={closeContainer}>
          <View style={styles.backDrop}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{containerItem?.label}</Text>
            </View>
            <Pressable style={styles.itemContainer}>
              <ScrollView
                contentContainerStyle={styles.scrollContainer}
                horizontal={true}
              >
                {containerItem?.equipment.map((item, index) => (
                  <EquipmentItem key={index} item={item} count={item.count} />
                ))}
              </ScrollView>
            </Pressable>
          </View>
        </Pressable>
      )}
    </>
  );
}

// use dimension calculations because equipmentItems require dimensions
const { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
  backDrop: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    alignItems: "center",
    flex: 1,
  },
  scrollContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    minWidth: "100%",
  },
  itemContainer: {
    marginTop: "10%",
    justifyContent: "center",
    alignItems: "center",
    width: width * 0.85,
    height: height * 0.5,
    borderRadius: 20,
    display: "flex",
    flexDirection: "column",
    backgroundColor: "rgb(240, 240, 240)",
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
  screen: {
    flex: 1,
    position: "absolute",
    width: "100%",
    height: "100%",
  },
});
