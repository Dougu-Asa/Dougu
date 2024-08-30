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
    "#f27474",
    "#ebc287",
    "#acde72",
    "#a4e3ff",
    "#99a3d7",
    "#c587d0",
    "#c3a07e",
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
            containerStyle={{ backgroundColor: "white" }}
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
