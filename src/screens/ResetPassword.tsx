import React, { useState } from "react";
import { View, Text, TextInput, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../styles/LoginCreate";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Auth } from "aws-amplify";

import { ResetPasswordScreenProps } from "../types/ScreenTypes";
import { validateRequirements } from "../helper/CreateAccUtils";

export default function ResetPassword({
  route,
  navigation,
}: ResetPasswordScreenProps) {
  const { email } = route.params;
  const [code, setCode] = useState("");
  const [password, onChangePassword] = useState("");
  const [confirmPassword, onChangeConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const forgotPasswordSubmit = async (
    email: string,
    code: string,
    newPassword: string,
  ) => {
    try {
      const data = await Auth.forgotPasswordSubmit(email, code, newPassword);
      console.log(data);
      Alert.alert("Success", "Password has been reset");
    } catch (err) {
      Alert.alert("Error", (err as Error).message);
      console.log(err);
    }
  };

  const handleSubmit = async () => {
    const validation = await validateRequirements(
      "ValidUsername",
      email,
      password,
      confirmPassword,
    );
    if (!validation) {
      return;
    }
    await forgotPasswordSubmit(email, code, password);
    navigation.navigate("Home");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Change Password</Text>
      <Text style={styles.subtitle}>Enter Your Confirmation Code</Text>
      <TextInput
        style={styles.input}
        onChangeText={setCode}
        value={code}
        placeholder="code"
        keyboardType="numeric"
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
      <Pressable style={styles.button} onPress={handleSubmit}>
        <Text style={styles.btnText}>Reset Password</Text>
      </Pressable>
    </SafeAreaView>
  );
}
