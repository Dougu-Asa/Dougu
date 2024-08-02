import React from "react";
import { Overlay } from "@rneui/themed";
import { Text, StyleSheet, View } from "react-native";

import { useEquipment } from "../../helper/EquipmentContext";
import { Button } from "@rneui/base";
import { ScrollView } from "react-native-gesture-handler";

/*
    This overlay is what is shown when the user taps
    on an equipment item. It displays the equipment item's 
    stats, counts, and grouped equipment items.
*/
const EquipmentOverlay = () => {
  const { visible, setVisible, equipmentItem } = useEquipment();

  return (
    <Overlay isVisible={visible} fullScreen={true}>
      <Text style={styles.title}>{equipmentItem?.label}</Text>
      <ScrollView style={styles.scrollContainer}>
        {equipmentItem &&
          equipmentItem.data.map((item, index) => (
            <View key={index}>
              <Text>{item}</Text>
              <Text>{equipmentItem.detailData[index]}</Text>
            </View>
          ))}
      </ScrollView>
      <Button onPress={() => setVisible(false)}>Close</Button>
    </Overlay>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 9,
  },
  overlayStyles: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  title: {
    marginVertical: 20,
    textAlign: "center",
    fontSize: 28,
    fontWeight: "bold",
    flexShrink: 1,
    flex: 2,
  },
});

export default EquipmentOverlay;
