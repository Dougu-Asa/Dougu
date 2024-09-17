import { StyleSheet, Dimensions } from "react-native";

const width = Dimensions.get("window").width;
const profileSize = width / 4;
export const editIconSize = width / 18;

export const displayStyles = StyleSheet.create({
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 20,
  },
  profile: {
    width: profileSize,
    height: profileSize,
    borderRadius: profileSize / 2,
  },
  profileMini: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
  },
});
