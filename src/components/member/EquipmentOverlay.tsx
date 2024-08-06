import React from "react";
import { Overlay, Card, Button } from "@rneui/themed";
import { Text, StyleSheet, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient"; // Import the LinearGradient component

import { useEquipment } from "../../helper/EquipmentContext";
import { ScrollView } from "react-native-gesture-handler";

/*
    This overlay is what is shown when the user taps
    on an equipment item. It displays the equipment item's 
    stats, counts, and grouped equipment items.
*/
export default function EquipmentOverlay() {
  const { visible, setVisible, equipmentItem, modifyEquipmentItem } =
    useEquipment();

  return (
    <Overlay isVisible={visible} fullScreen={true}>
      <Text style={styles.title}>{equipmentItem?.label}</Text>
      <ScrollView>
        {equipmentItem &&
          equipmentItem.data.map((itemId, index) => (
            <Pressable
              key={index}
              onPress={() => {
                modifyEquipmentItem(equipmentItem, itemId);
              }}
            >
              <Card
                containerStyle={
                  equipmentItem.id === itemId && styles.highlighted
                }
              >
                <Card.Title>{itemId}</Card.Title>
                <Card.Divider />
                <Text>{equipmentItem.detailData[index]}</Text>
              </Card>
            </Pressable>
          ))}
        <Text>{JSON.stringify(equipmentItem, null, 2)}</Text>
      </ScrollView>
      <Button
        ViewComponent={LinearGradient}
        linearGradientProps={{
          colors: ["#FF9800", "#F44336"],
          start: { x: 0, y: 0.5 },
          end: { x: 1, y: 0.5 },
        }}
        onPress={() => setVisible(false)}
      >
        Close
      </Button>
    </Overlay>
  );
}

const styles = StyleSheet.create({
  highlighted: {
    borderWidth: 3,
    borderColor: "black",
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
  },
});
