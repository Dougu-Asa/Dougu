import React from "react";
import { StyleSheet, Button, View, Text } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import EquipmentDisplay from "../member/EquipmentDisplay";
import ContainerDisplay from "../member/ContainerDisplay";
import ColorPicker, {
  Panel1,
  Swatches,
  Preview,
  HueSlider,
} from "reanimated-color-picker";
import { Hex } from "../../types/ModelTypes";

/*
    This overlay is what is shown when the user taps
    on an equipment item. It displays the equipment item's 
    stats, counts, and grouped equipment items.
*/
export default function ItemImageOverlay({
  visible,
  setVisible,
  index,
  color,
  setColor,
  icon,
  setIcon,
}: {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  index: number;
  color: Hex;
  setColor: React.Dispatch<React.SetStateAction<Hex>>;
  icon: string;
  setIcon: React.Dispatch<React.SetStateAction<string>>;
}) {
  const onSelectColor = ({ hex }: { hex: string }) => {
    setColor(hex as Hex);
  };
  const colorPalette = [
    "#f44336",
    "#ff9800",
    "#8bc34a",
    "#03a9f4",
    "#3f51b5",
    "#9c27b0",
  ];

  return (
    <>
      {visible && (
        <Animated.View
          style={styles.overlayStyles}
          entering={FadeIn}
          exiting={FadeOut}
        >
          <View style={styles.topRow}>
            {index === 0 ? (
              <EquipmentDisplay
                image={"default"}
                isMini={false}
                color={color}
              />
            ) : (
              <ContainerDisplay />
            )}
          </View>
          <Text style={styles.panelText}>Background Color</Text>
          <View style={styles.mainContainer}>
            <ColorPicker
              style={styles.pickerContainer}
              value={color}
              onComplete={onSelectColor}
            >
              <View style={styles.panelContainer}>
                <View style={styles.panel}>
                  <Panel1 />
                  <Preview hideInitialColor={true} />
                </View>
                <HueSlider vertical />
              </View>
              <Swatches colors={colorPalette} />
            </ColorPicker>
          </View>
          <Button onPress={() => setVisible(false)} title="close" />
        </Animated.View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    width: "85%",
    height: "50%",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    backgroundColor: "#f5f5f5",
  },
  overlayStyles: {
    backgroundColor: "white",
    flex: 1,
    position: "absolute",
    width: "100%",
    height: "100%",
    alignItems: "center",
  },
  panel: {
    width: "85%",
  },
  panelContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  panelText: {
    fontSize: 14,
  },
  pickerContainer: {
    marginTop: 10,
    width: "80%",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 30,
  },
});
