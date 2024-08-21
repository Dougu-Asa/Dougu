import { createElement } from "react";
import Entypo from "react-native-vector-icons/Entypo";
import { Dimensions } from "react-native";

const iconSize = Dimensions.get("window").width / 8;

const profileMapping: { [key: string]: any } = {
  default: require("../assets/userprofiles/default.svg"),
  miku: require("../assets/userprofiles/miku.jpg"),
};

const iconMapping: { [key: string]: () => JSX.Element } = {
  default: () =>
    createElement(Entypo, { name: "camera", size: iconSize, color: "white" }),
};

export default function IconMap({ icon }: { icon: string }) {
  if (icon in iconMapping) {
    return iconMapping[icon]();
  } else {
    return iconMapping["default"]();
  }
}

export { iconMapping, profileMapping };
