import { StyleSheet, View, Dimensions } from "react-native";
import ColorPicker, {
  Panel1,
  Swatches,
  HueSlider,
  OpacitySlider,
  InputWidget,
} from "reanimated-color-picker";

import { Hex } from "../../types/ModelTypes";

export default function ColorSelect({
  color,
  setColor,
}: {
  color: Hex;
  setColor: React.Dispatch<React.SetStateAction<Hex>>;
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
    <View style={styles.pickerContainer}>
      <ColorPicker
        style={styles.picker}
        value={color}
        onComplete={onSelectColor}
      >
        <View style={styles.panelView}>
          <Panel1 style={styles.panel} />
          <HueSlider style={styles.slider} vertical />
          <OpacitySlider style={styles.slider} vertical />
        </View>
        <InputWidget inputTitleStyle={{ display: "none" }} formats={["HEX"]} />
        <Swatches colors={colorPalette} />
      </ColorPicker>
    </View>
  );
}

const borderRadius = Dimensions.get("window").width / 20;
const borderRadiusSmall = Dimensions.get("window").width / 40;
const styles = StyleSheet.create({
  panel: {
    borderRadius: borderRadius,
    flex: 10,
  },
  panelView: {
    display: "flex",
    flexDirection: "row",
    columnGap: 10,
  },
  picker: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    rowGap: 15,
  },
  pickerContainer: {
    margin: "5%",
  },
  slider: {
    borderRadius: borderRadiusSmall,
    flex: 1,
  },
});
