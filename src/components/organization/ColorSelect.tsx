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
    "#000000",
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
        boundedThumb
      >
        <View style={styles.panelView}>
          <Panel1 style={styles.panel} />
          <HueSlider style={styles.slider} vertical />
          <OpacitySlider style={styles.slider} vertical />
        </View>
        <View style={styles.widgetView}>
          <InputWidget
            inputTitleStyle={{ display: "none" }}
            formats={["HEX"]}
          />
          <Swatches colors={colorPalette} />
        </View>
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
    height: "100%",
  },
  panelView: {
    display: "flex",
    flexDirection: "row",
    columnGap: 15,
    flexShrink: 4,
    flexBasis: "60%",
  },
  picker: {
    width: "90%",
    height: "90%",
    rowGap: 15,
    margin: "auto",
  },
  pickerContainer: {
    flex: 1,
  },
  slider: {
    borderRadius: borderRadiusSmall,
    flex: 1,
    height: "100%",
  },
  widgetView: {
    rowGap: 15,
    flexBasis: "40%",
    flexGrow: 6,
  },
});
