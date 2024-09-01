import { ImageSourcePropType } from "react-native";

const profilePath = "../assets/userprofiles/";

const profileMapping: { [key: string]: ImageSourcePropType } = {
  default: require(`${profilePath}default.png`),
  miku: require(`${profilePath}miku.jpg`),
  zote: require(`${profilePath}zote.png`),
  kai: require(`${profilePath}kai.png`),
  redTaiko: require(`${profilePath}redTaiko.jpg`),
  blueTaiko: require(`${profilePath}blueTaiko.png`),
};

const drumsPath = "../assets/equipment/taiko/drums/";
const drums: { [key: string]: ImageSourcePropType } = {
  chu: require(`${drumsPath}chu.png`),
  shime: require(`${drumsPath}shime.png`),
  okedo: require(`${drumsPath}okedo.png`),
  ohira: require(`${drumsPath}ohira.png`),
  odaiko: require(`${drumsPath}odaiko.png`),
  tire: require(`${drumsPath}tire.png`),
};

const standsPath = "../assets/equipment/taiko/stands/";
const stands: { [key: string]: ImageSourcePropType } = {
  nanameStand: require(`${standsPath}nanameStand.png`),
  betaStand: require(`${standsPath}betaStand.png`),
  shimeStand: require(`${standsPath}shimeStand.png`),
  hachijoStand: require(`${standsPath}hachijoStand.png`),
  okedoStand: require(`${standsPath}okedoStand.png`),
  odaikoStand: require(`${standsPath}odaikoStand.png`),
  yataiStand: require(`${standsPath}yataiStand.png`),
  chair: require(`${standsPath}chair.png`),
};

const clothingPath = "../assets/equipment/taiko/clothing/";
const clothing: { [key: string]: ImageSourcePropType } = {
  happi: require(`${clothingPath}happi.png`),
  haori: require(`${clothingPath}haori.png`),
  hakama: require(`${clothingPath}hakama.png`),
  hachimakiBlack: require(`${clothingPath}hachimakiBlack.png`),
  hachimakiWhite: require(`${clothingPath}hachimakiWhite.png`),
};

const otherPath = "../assets/equipment/taiko/other/";
const other: { [key: string]: ImageSourcePropType } = {
  mallet: require(`${otherPath}mallet.png`),
  chappa: require(`${otherPath}chappa.png`),
  clave: require(`${otherPath}clave.png`),
  kane: require(`${otherPath}kane.png`),
  bachi: require(`${otherPath}bachi.png`),
  batBachi: require(`${otherPath}batBachi.png`),
};

const taiko: { [key: string]: ImageSourcePropType } = {
  ...drums,
  ...stands,
  ...clothing,
  ...other,
};

const equipmentPath = "../assets/equipment/";
const iconMapping: { [key: string]: ImageSourcePropType } = {
  ...taiko,
  default: require(`${equipmentPath}default.png`),
};

export { iconMapping, profileMapping, taiko };
