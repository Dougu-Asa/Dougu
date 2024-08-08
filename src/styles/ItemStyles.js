import { Dimensions, StyleSheet } from "react-native";

const width = Dimensions.get("window").width;
const itemWidth = width / 5;
const borderRadius = width / 14;

/*
  Used for EquipmentItem, ContainerItem, and MiniEquipmentItem styling
*/

export const itemStyles = StyleSheet.create({
  backDrop: {
    backgroundColor: "black",
    borderRadius: borderRadius,
  },
  circle: {
    backgroundColor: "white",
    width: 35,
    height: 35,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    borderWidth: 1,
    right: -7,
    top: itemWidth - 28,
  },
  container: {
    alignItems: "center",
    width: itemWidth,
  },
  containerItem: {
    width: itemWidth,
    height: itemWidth,
    borderRadius: borderRadius,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgb(222, 222, 222)",
  },
  count: {
    fontSize: 10,
    fontWeight: "bold",
  },
  equipment: {
    width: itemWidth,
    height: itemWidth,
    borderRadius: borderRadius,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgb(135, 206, 235)",
  },
  equipmentItemContainer: {
    width: "33.33%",
    alignItems: "center",
  },
  equipmentRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    flexBasis: "33.33%",
    alignItems: "center",
  },
  table: {
    width: "85%",
    height: "85%",
  },
  text: {
    fontSize: 12,
  },
  textContainer: {
    alignItems: "center",
    height: 40,
  },
});