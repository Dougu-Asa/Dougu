import { StyleSheet, Dimensions } from "react-native";

const createJoinStyles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    width: "100%",
  },
  container: {
    top: "20%",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "normal",
    textAlign: "center",
    width: "80%",
  },
  input: {
    height: 50,
    margin: 15,
    marginTop: 30,
    borderWidth: 1,
    padding: 10,
    width: "80%",
  },
  button: {
    height: 50,
    margin: 15,
    backgroundColor: "#333333",
    width: Dimensions.get("window").width * 0.8, //basically vw: 80
  },
  btnText: {
    textAlign: "center",
    color: "#fff",
    padding: 10,
  },
  accessCode: {
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default createJoinStyles;
