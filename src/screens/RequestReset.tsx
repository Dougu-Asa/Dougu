import { View, Text, TextInput, Pressable } from "react-native";
import React, { useState } from "react";
import { resetPassword } from "aws-amplify/auth";

import { loginCreateStyles } from "../styles/LoginCreate";
import { RequestResetScreenProps } from "../types/ScreenTypes";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RequestReset({ navigation }: RequestResetScreenProps) {
  const [email, setEmail] = useState("");

  const forgotPassword = async (username: string) => {
    try {
      const data = await resetPassword({ username });
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleRequest = async () => {
    await forgotPassword(email);
    navigation.navigate("ResetPassword", { email: email });
  };

  return (
    <SafeAreaView>
      <View style={loginCreateStyles.requestContainer}>
        <Text style={loginCreateStyles.title}>Reset Request</Text>
        <Text style={loginCreateStyles.subtitle}>
          Enter your email to receive a reset code
        </Text>
        <TextInput
          style={loginCreateStyles.input}
          onChangeText={setEmail}
          value={email}
          placeholder="email"
          keyboardType="email-address"
          testID="emailInput"
        />
        <Pressable style={loginCreateStyles.button} onPress={handleRequest}>
          <Text style={loginCreateStyles.btnText}>Send Email</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
