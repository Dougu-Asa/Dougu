import React from "react";
import { Overlay, Divider } from "@rneui/themed";
import { StyleSheet, Text, View } from "react-native";

import { useEquipment } from "../../helper/EquipmentContext";

/*
    This overlay is what is shown when the user taps
    on an equipment item. It displays the equipment item's 
    stats, counts, and grouped equipment items.
*/
export default function ContainerOverlay() {
  const { containerVisible, setContainerVisible, containerItem } =
    useEquipment();

  return (
    <Overlay
      isVisible={containerVisible}
      onBackdropPress={() => {
        setContainerVisible(false);
      }}
      backdropStyle={styles.backDrop}
      overlayStyle={styles.overlayContainer}
    >
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{containerItem?.label}</Text>
      </View>
      <Divider />
      <View style={styles.itemContainer}>
        <Text>Containers</Text>
      </View>
    </Overlay>
  );
}

const styles = StyleSheet.create({
  backDrop: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  itemContainer: {
    flex: 9,
    justifyContent: "center",
    alignItems: "center",
  },
  overlayContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "85%",
    height: "60%",
    borderRadius: 20,
    display: "flex",
    flexDirection: "column",
    backgroundColor: "white",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
  },
  titleContainer: {
    alignItems: "center",
    borderBottomColor: "black",
    borderBottomWidth: 1,
    width: "90%",
    flex: 1,
  },
});
