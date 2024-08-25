import { Dimensions } from "react-native";
import Chu from "../assets/equipment/Chu";
import { Hex } from "../types/ModelTypes";

const iconSize = Dimensions.get("window").width / 5;

const profileMapping: { [key: string]: any } = {
  default: require("../assets/userprofiles/default.svg"),
  miku: require("../assets/userprofiles/miku.jpg"),
};

const iconMapping: {
  [key: string]: (size: number, fillColor: Hex) => JSX.Element;
} = {
  default: (size, fillColor) =>
    Chu({ width: size, height: size, fill: fillColor }),
};

export default function IconMap({
  icon,
  isMini,
  fillColor,
}: {
  icon: string;
  isMini: boolean;
  fillColor: Hex;
}) {
  const size = isMini ? iconSize / 6 : iconSize;
  if (icon in iconMapping) {
    return iconMapping[icon](size, fillColor);
  } else {
    return iconMapping["default"](size, fillColor);
  }
}

export { iconMapping, profileMapping };
