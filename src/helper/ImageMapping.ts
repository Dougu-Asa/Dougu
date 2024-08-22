import { createElement } from "react";
import Entypo from "react-native-vector-icons/Entypo";
import { Dimensions } from "react-native";

const iconSize = Dimensions.get("window").width / 8;

const profileMapping: { [key: string]: any } = {
  default: require("../assets/userprofiles/default.svg"),
  miku: require("../assets/userprofiles/miku.jpg"),
};

const iconMapping: { [key: string]: (size: number) => JSX.Element } = {
  default: (size) =>
    createElement(Entypo, { name: "camera", size: size, color: "white" }),
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
