import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import { useEquipment } from "../../helper/EquipmentContext";

/*
    This overlay is what is shown when the user taps
    on an equipment item. It displays the equipment item's 
    stats, counts, and grouped equipment items.
*/
export default function CustomContainerOverlay() {
  const { containerVisible, setContainerVisible, containerItem } =
    useEquipment();

  return (
    <View style={styles.screen}>
      {containerVisible && (
        <TouchableWithoutFeedback onPress={() => setContainerVisible(false)}>
          <View style={styles.backDrop}>
            <TouchableWithoutFeedback>
              <View style={styles.overlayContainer}>
                <View style={styles.titleContainer}>
                  <Text style={styles.title}>{containerItem?.label}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.itemContainer}>
                  <Text>Containers</Text>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      )}
    </View>
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
    width: "90%",
    flex: 1,
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
