import { Alert } from "react-native";

export const validateRequirements = async (
  username: string,
  email: string,
  password: string,
  confirmPassword: string,
) => {
  // check all fields are filled out
  if (
    username === "" ||
    password === "" ||
    email === "" ||
    confirmPassword === ""
  ) {
    Alert.alert("Form Error", "Please fill out all fields.", [{ text: "OK" }]);
    return false;
  }
  // check password length
  if (password.length < 8) {
    Alert.alert("Form Error", "Password must be at least 8 characters long.", [
      { text: "OK" },
    ]);
    return false;
  }
  // ensure password matches confirm password
  if (password !== confirmPassword) {
    Alert.alert("Form Error", "Passwords do not match.", [{ text: "OK" }]);
    return false;
  }
  return true;
};
