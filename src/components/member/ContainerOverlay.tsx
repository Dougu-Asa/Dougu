import React from "react";
import { Overlay } from "@rneui/themed";
import { StyleSheet, Text } from "react-native";

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
      backdropStyle={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
      overlayStyle={styles.overlayContainer}
    >
      <Text>Containers</Text>
    </Overlay>
  );
}

const styles = StyleSheet.create({
  overlayContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "85%",
    height: "55%",
    borderRadius: 20,
    marginTop: "40%",
  },
});
