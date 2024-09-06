import { View, Text, TextInput, Pressable } from "react-native";
import React, { useState } from "react";
import { resendSignUpCode, resetPassword } from "aws-amplify/auth";

import { loginCreateStyles } from "../styles/LoginCreate";
import { ResendCodeScreenProps } from "../types/ScreenTypes";
import { SafeAreaView } from "react-native-safe-area-context";
import { handleError } from "../helper/Utils";

export default function ResendCode({
  navigation,
  route,
}: ResendCodeScreenProps) {
  const [email, setEmail] = useState("");
  const { type } = route.params;

  const sendResetPassword = async () => {
    await resetPassword({ username: email });
    navigation.navigate("ResetPassword", { email: email });
  };

  const resendVerifyEmail = async () => {
    await resendSignUpCode({ username: email });
    navigation.navigate("VerifyEmail", { email: email });
  };

  const handleRequest = async () => {
    try {
      if (email === "") {
        throw new Error("Email is required");
      }
      if (type === "reset") await sendResetPassword();
      else await resendVerifyEmail();
    } catch (err) {
      handleError("handleRequest", err as Error, null);
    }
  };

  return (
    <SafeAreaView>
      <View style={loginCreateStyles.requestContainer}>
        {type === "reset" ? (
          <>
            <Text style={loginCreateStyles.title}>Reset Request</Text>
            <Text style={loginCreateStyles.subtitle}>
              Enter your email to receive a reset code
            </Text>
          </>
        ) : (
          <>
            <Text style={loginCreateStyles.title}>Resend Code</Text>
            <Text style={loginCreateStyles.subtitle}>
              Enter your email to receive a new code
            </Text>
          </>
        )}
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
