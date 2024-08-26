const profilePath = "../assets/userprofiles/";
const equipmentPath = "../assets/equipment/";

const profileMapping: { [key: string]: any } = {
  default: require(`${profilePath}default.svg`),
  miku: require(`${profilePath}miku.jpg`),
};

const iconMapping: {
  [key: string]: any;
} = {
  default: require(`${equipmentPath}chu.png`),
  chu: require(`${equipmentPath}chu.png`),
  nanameStand: require(`${equipmentPath}nanameStand.png`),
  betaStand: require(`${equipmentPath}betaStand.png`),
};

export { iconMapping, profileMapping };
