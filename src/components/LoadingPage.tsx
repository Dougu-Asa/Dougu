import React from "react";
import { View, Image, StyleSheet } from "react-native";

function LoadingPage() {
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/asayake_taiko.png")}
        style={styles.circleImage}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eceff1",
    alignItems: "center",
    width: "100%",
    justifyContent: "center",
  },
  circleImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginTop: 20,
  },
});

export default LoadingPage;
