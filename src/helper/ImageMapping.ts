import { Dimensions } from "react-native";
import Chu from "../assets/equipment/Chu";

const iconSize = Dimensions.get("window").width / 8;

const profileMapping: { [key: string]: any } = {
  default: require("../assets/userprofiles/default.svg"),
  miku: require("../assets/userprofiles/miku.jpg"),
};

const iconMapping: { [key: string]: (size: number) => JSX.Element } = {
  default: (size) => Chu({ width: size, height: size, fill: "#000000" }),
};

export default function IconMap({
  icon,
  isMini,
}: {
  icon: string;
  isMini: boolean;
}) {
  const size = isMini ? iconSize / 6 : iconSize;
  if (icon in iconMapping) {
    return iconMapping[icon](size);
  } else {
    return iconMapping["default"](size);
  }
}

export { iconMapping, profileMapping };
