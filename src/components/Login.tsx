import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
} from "react-native";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Auth } from "aws-amplify";

// Project Files
import { useLoad } from "../helper/LoadingContext";
import { useUser } from "../helper/UserContext";
import { NavigationOnlyProps } from "../types/ScreenTypes";
import { handleError } from "../helper/Error";

/*
  A component that allows the user to login to the app 
  using their email and password. This is handled by 
  using Cognito from AWS Amplify
*/
function LoginScreen({ navigation }: NavigationOnlyProps) {
  const { setIsLoading } = useLoad();
  const { setUser } = useUser();

  const [username, onChangeUsername] = React.useState("");
  const [password, onChangePassword] = React.useState("");

  // Function to toggle the password visibility state
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  async function signIn({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) {
    try {
      setIsLoading(true);
      await Auth.signIn(username, password);
      const user = await Auth.currentAuthenticatedUser();
      setUser(user);
      setIsLoading(false);
      onChangePassword("");
      onChangeUsername("");
      navigation.navigate("DrawerNav", { screen: "MyOrgs" });
    } catch (error) {
      handleError("signIn", error as Error, setIsLoading);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Login</Text>
      <TextInput
        style={styles.input}
        onChangeText={onChangeUsername}
        value={username}
        placeholder="email"
        keyboardType="email-address"
      />
      <View style={styles.password}>
        <TextInput
          style={styles.pinput}
          onChangeText={onChangePassword}
          secureTextEntry={!showPassword}
          value={password}
          placeholder="password"
          keyboardType="default"
        />
        <MaterialCommunityIcons
          name={showPassword ? "eye-off" : "eye"}
          size={24}
          color="#aaa"
          onPress={toggleShowPassword}
        />
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => signIn({ username, password })}
      >
        <Text style={styles.btnText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    width: "100%",
  },
  input: {
    height: 60,
    margin: "5%",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    width: "80%",
  },
  pinput: {
    height: 50,
    margin: "5%",
    padding: 10,
    width: "75%",
  },
  password: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 10,
    width: "80%",
    height: 60,
  },
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
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: "8%",
  },
});

export default LoginScreen;
