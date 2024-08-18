import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { useEquipment } from "../../helper/context/EquipmentContext";
import { getCsvData } from "../../helper/EquipmentUtils";

export default function SheetScreen() {
  const { itemData } = useEquipment();
  const csvData = getCsvData(itemData);
  console.log(csvData);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sheet</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    height: "100%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
  },
});
