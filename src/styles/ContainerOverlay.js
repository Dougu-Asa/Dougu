import { StyleSheet, Dimensions } from "react-native";

// use dimension calculations because equipmentItems require dimensions
const { width, height } = Dimensions.get("window");

export const containerOverlayStyles = StyleSheet.create({
  backDrop: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    alignItems: "center",
    flex: 1,
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  equipmentRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    width: "90%",
    marginLeft: "auto",
    marginRight: "auto",
    flexBasis: "33.33%",
    alignItems: "center",
  },
  equipmentItemContainer: {
    width: "33.33%",
    alignItems: "center",
  },
  itemContainer: {
    marginTop: height * 0.04,
    justifyContent: "center",
    alignItems: "center",
    width: width * 0.85,
    height: height * 0.6,
    borderRadius: 20,
    backgroundColor: "rgb(240, 240, 240)",
  },
  itemPage: {
    display: "flex",
    flexDirection: "column",
    width: width * 0.85,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "black",
  },
  titleContainer: {
    alignItems: "center",
    height: height * 0.08,
    marginTop: height * 0.08,
  },
  divider: {
    height: 1,
    width: "90%",
    backgroundColor: "black",
    marginVertical: 10,
  },
  pagination: {
    flexDirection: "row",
    height: 30,
    alignItems: "center",
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 2,
  },
  paginationDotInactive: {
    backgroundColor: "gray",
  },
  paginationDotActive: {
    backgroundColor: "black",
  },
  pagesContainer: {
    display: "flex",
    flexDirection: "row",
  },
});
