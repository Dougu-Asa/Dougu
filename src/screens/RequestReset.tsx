import { View, Text, TextInput, Pressable } from "react-native";
import React, { useState } from "react";
import { Auth } from "aws-amplify";

import { styles } from "../styles/LoginCreate";
import { RequestResetScreenProps } from "../types/ScreenTypes";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RequestReset({ navigation }: RequestResetScreenProps) {
  const [email, setEmail] = useState("");

  const forgotPassword = async (username: string) => {
    try {
      const data = await Auth.forgotPassword(username);
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
      <View style={styles.requestContainer}>
        <Text style={styles.title}>Reset Request</Text>
        <Text style={styles.subtitle}>
          Enter your email to receive a reset code
        </Text>
        <TextInput
          style={styles.input}
          onChangeText={setEmail}
          value={email}
          placeholder="email"
          keyboardType="email-address"
          testID="emailInput"
        />
        <Pressable style={styles.button} onPress={handleRequest}>
          <Text style={styles.btnText}>Send Email</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
