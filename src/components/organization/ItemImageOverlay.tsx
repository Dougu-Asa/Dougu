import React from "react";
import { Text, StyleSheet, Button } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

/*
    This overlay is what is shown when the user taps
    on an equipment item. It displays the equipment item's 
    stats, counts, and grouped equipment items.
*/
export default function ItemImageOverlay({
  visible,
  setVisible,
}: {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <>
      {visible && (
        <Animated.View
          style={styles.overlayStyles}
          entering={FadeIn}
          exiting={FadeOut}
        >
          <Text>HI</Text>
          <Button onPress={() => setVisible(false)} title="close" />
        </Animated.View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  highlighted: {
    borderWidth: 3,
    borderColor: "black",
  },
  infoContainer: {
    height: 80,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    borderBottomColor: "grey",
    borderBottomWidth: 0.5,
  },
  infoTxt: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 20,
  },
  overlayStyles: {
    backgroundColor: "white",
    flex: 1,
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  title: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 28,
    fontWeight: "bold",
  },
});
