import { ImageSourcePropType } from "react-native";

const profilePath = "../assets/userprofiles/";

const profileMapping: { [key: string]: ImageSourcePropType } = {
  miku: require(`${profilePath}miku.png`),
  zote: require(`${profilePath}zote.png`),
  jiji: require(`${profilePath}jiji.png`),
  sadaharu: require(`${profilePath}sadaharu.png`),
  pikachu: require(`${profilePath}pikachu.png`),
  kai: require(`${profilePath}kai.png`),
  saitama: require(`${profilePath}saitama.png`),
  redTaiko: require(`${profilePath}redTaiko.png`),
  blueTaiko: require(`${profilePath}blueTaiko.png`),
  default: require(`${profilePath}default.png`),
};

const taikoPath = "../assets/equipment/taiko/";
const drums: { [key: string]: ImageSourcePropType } = {
  chu: require(`${taikoPath}chu.png`),
  shime: require(`${taikoPath}shime.png`),
  okedo: require(`${taikoPath}okedo.png`),
  ohira: require(`${taikoPath}ohira.png`),
  odaiko: require(`${taikoPath}odaiko.png`),
  tire: require(`${taikoPath}tire.png`),
};

const stands: { [key: string]: ImageSourcePropType } = {
  nanameStand: require(`${taikoPath}nanameStand.png`),
  betaStand: require(`${taikoPath}betaStand.png`),
  shimeStand: require(`${taikoPath}shimeStand.png`),
  hachijoStand: require(`${taikoPath}hachijoStand.png`),
  okedoStand: require(`${taikoPath}okedoStand.png`),
  odaikoStand: require(`${taikoPath}odaikoStand.png`),
  yataiStand: require(`${taikoPath}yataiStand.png`),
  chair: require(`${taikoPath}chair.png`),
};

const clothing: { [key: string]: ImageSourcePropType } = {
  happi: require(`${taikoPath}happi.png`),
  haori: require(`${taikoPath}haori.png`),
  hakama: require(`${taikoPath}hakama.png`),
  hachimakiBlack: require(`${taikoPath}hachimakiBlack.png`),
  hachimakiWhite: require(`${taikoPath}hachimakiWhite.png`),
};

const other: { [key: string]: ImageSourcePropType } = {
  mallet: require(`${taikoPath}mallet.png`),
  chappa: require(`${taikoPath}chappa.png`),
  clave: require(`${taikoPath}clave.png`),
  kane: require(`${taikoPath}kane.png`),
  bachi: require(`${taikoPath}bachi.png`),
  batBachi: require(`${taikoPath}batBachi.png`),
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
