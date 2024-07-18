import { MaterialIndicator } from "react-native-indicators";
import React from "react";
import { View, StyleSheet } from "react-native";

export default function Indicator() {
  return (
    <View style={styles.container}>
      <MaterialIndicator color="#791111" size={150} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: 100,
  },
});
