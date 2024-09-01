import { View, TextInput, Text } from "react-native";
import { TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { signUp, signIn } from "aws-amplify/auth";

// Project Files
import { useLoad } from "../helper/context/LoadingContext";
import { useUser } from "../helper/context/UserContext";
import { handleError } from "../helper/Utils";
import { NavigationOnlyProps } from "../types/ScreenTypes";
import { validateRequirements } from "../helper/CreateAccUtils";
import { styles } from "../styles/LoginCreate";
import { profileMapping } from "../helper/ImageMapping";
import { setUserContext } from "../helper/Utils";

/*
  A component that allows the user to create an account
  using their email and password. This is handled by
  using Cognito from AWS Amplify. Users are also uploaded
  to the database using Amplify Datastore.
*/
export default function CreateAccScreen({ navigation }: NavigationOnlyProps) {
  const { setIsLoading } = useLoad();
  const { setUser } = useUser();

  // for the form
  const [email, onChangeEmail] = React.useState("");
  const [first, onChangeFirst] = React.useState("");
  const [last, onChangeLast] = React.useState("");
  const [username, onChangeUsername] = React.useState("");
  const [password, onChangePassword] = React.useState("");
  const [confirmPassword, onChangeConfirmPassword] = React.useState("");

  // Function to toggle the password visibility state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // username = first + ' ' + last
  useEffect(() => {
    onChangeUsername(first + " " + last);
  }, [first, last]);

  const handleSignUp = async ({
    username,
    password,
    email,
  }: {
    username: string;
    password: string;
    email: string;
  }) => {
    try {
      setIsLoading(true);
      const validation = await validateRequirements(
        username,
        email,
        password,
        confirmPassword,
      );
      if (!validation) {
        setIsLoading(false);
        return;
      }
      // get a random profile key to set as user profile
      var keys = Object.keys(profileMapping);
      const userProfile = keys[(keys.length * Math.random()) << 0];
      await signUp({
        username: email, // email is the username
        password: password,
        options: {
          userAttributes: {
            name: username,
            profile: userProfile,
          },
        },
      });
      await signIn({ username: email, password: password });
      await setUserContext(setUser);
      onChangeEmail("");
      onChangeFirst("");
      onChangeLast("");
      onChangePassword("");
      onChangeConfirmPassword("");
      onChangeUsername("");
      setIsLoading(false);
      navigation.navigate("SyncScreen", { syncType: "START" });
    } catch (error) {
      handleError("handleSignUp", error as Error, setIsLoading);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create Account</Text>
      <View style={styles.nameContainer}>
        <TextInput
          style={styles.name}
          onChangeText={onChangeFirst}
          value={first}
          placeholder="first"
          keyboardType="default"
        />
        <TextInput
          style={styles.name}
          onChangeText={onChangeLast}
          value={last}
          placeholder="last"
          keyboardType="default"
        />
      </View>
      <TextInput
        style={styles.input}
        onChangeText={onChangeEmail}
        value={email}
        placeholder="email"
        keyboardType="email-address"
      />
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.pinput}
          onChangeText={onChangePassword}
          secureTextEntry={!showPassword}
          value={password}
          placeholder="password"
          keyboardType="default"
        />
        <MaterialCommunityIcons
          name={showPassword ? "eye" : "eye-off"}
          size={28}
          color="#aaa"
          style={styles.icon}
          onPress={() => setShowPassword(!showPassword)}
        />
      </View>
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.pinput}
          onChangeText={onChangeConfirmPassword}
          secureTextEntry={!showConfirmPassword}
          value={confirmPassword}
          placeholder="confirm password"
          keyboardType="default"
        />
        <MaterialCommunityIcons
          name={showConfirmPassword ? "eye" : "eye-off"}
          size={28}
          color="#aaa"
          style={styles.icon}
          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
        />
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleSignUp({ username, email, password })}
      >
        <Text style={styles.btnText}>Create</Text>
      </TouchableOpacity>
    </View>
  );
}
