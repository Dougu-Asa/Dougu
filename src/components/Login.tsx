import { View, TextInput, TouchableOpacity, Text } from "react-native";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { signIn, getCurrentUser, fetchUserAttributes } from "aws-amplify/auth";

// Project Files
import { useLoad } from "../helper/context/LoadingContext";
import { useUser } from "../helper/context/UserContext";
import { NavigationOnlyProps } from "../types/ScreenTypes";
import { handleError } from "../helper/Utils";
import { styles } from "../styles/LoginCreate";

/*
  A component that allows the user to login to the app 
  using their email and password. This is handled by 
  using Cognito from AWS Amplify
*/
export default function LoginScreen({ navigation }: NavigationOnlyProps) {
  const { setIsLoading } = useLoad();
  const { setUser } = useUser();

  const [username, onChangeUsername] = React.useState("");
  const [password, onChangePassword] = React.useState("");

  // Function to toggle the password visibility state
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSignIn = async ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => {
    try {
      setIsLoading(true);
      await signIn({username, password});
      const attributes = await fetchUserAttributes();
      if(!attributes.name || !attributes.email || !attributes.sub || !attributes.profile) throw new Error("Missing attributes");
      const user = {
        name: attributes.name,
        email: attributes.email,
        id: attributes.sub,
        profile: attributes.profile,
      }
      setUser(user);
      setIsLoading(false);
      onChangePassword("");
      onChangeUsername("");
      //navigation.navigate("SyncScreen", { syncType: "START" });
    } catch (error) {
      handleError("signIn", error as Error, setIsLoading);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Login</Text>
      <TextInput
        style={styles.input}
        onChangeText={onChangeUsername}
        value={username}
        placeholder="email"
        keyboardType="email-address"
        testID="emailInput"
      />
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.pinput}
          onChangeText={onChangePassword}
          secureTextEntry={!showPassword}
          value={password}
          placeholder="password"
          keyboardType="default"
          testID="passwordInput"
        />
        <MaterialCommunityIcons
          name={showPassword ? "eye" : "eye-off"}
          size={28}
          color="#aaa"
          style={styles.icon}
          onPress={toggleShowPassword}
        />
      </View>
      <Text
        style={styles.forgotPassword}
        onPress={() => {
          navigation.navigate("RequestReset");
        }}
      >
        Forgot Password?
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleSignIn({ username, password })}
        testID="signInButton"
      >
        <Text style={styles.btnText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}
