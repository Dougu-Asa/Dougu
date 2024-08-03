import { StyleSheet } from "react-native";

/*
  styles for Login, CreateAcc, RequestPasswordReset, and ResetPassword
*/
export const styles = StyleSheet.create({
  button: {
    height: 50,
    margin: 15,
    backgroundColor: "#333333",
    width: "80%",
    borderRadius: 10,
  },
  btnText: {
    textAlign: "center",
    color: "#fff",
    padding: 10,
  },
  container: {
    alignItems: "center",
  },
  forgotPassword: {
    color: "blue",
    marginTop: 10,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: "10%",
  },
  icon: {
    padding: 5,
    width: "18%",
  },
  input: {
    height: 50,
    marginTop: "5%",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    width: "80%",
  },
  name: {
    width: "40%",
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "80%",
    marginTop: "5%",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 10,
    width: "80%",
    height: 50,
    marginTop: "5%",
  },
  pinput: {
    height: 50,
    margin: "5%",
    padding: 10,
    width: "75%",
  },
  requestContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginTop: "15%",
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "normal",
    textAlign: "center",
    width: "80%",
    marginTop: "2%",
  },
  title: {
    marginTop: "10%",
    fontSize: 32,
    fontWeight: "bold",
    color: "#791111",
  },
});
