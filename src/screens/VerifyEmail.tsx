import { View, Text, TextInput, Pressable } from "react-native";
import React, { useState } from "react";

import { loginCreateStyles } from "../styles/LoginCreate";
import { VerifyEmailScreenProps } from "../types/ScreenTypes";
import { SafeAreaView } from "react-native-safe-area-context";

export default function VerifyEmail({ navigation }: VerifyEmailScreenProps) {
  const [code, setCode] = useState("");

  return (
    <SafeAreaView>
      <View style={loginCreateStyles.requestContainer}>
        <Text style={loginCreateStyles.title}>Verify Email</Text>
        <Text style={loginCreateStyles.subtitle}>
          We just sent you an email with a code. Enter it here.
        </Text>
        <TextInput
          style={loginCreateStyles.input}
          onChangeText={setCode}
          value={code}
          placeholder="code"
          keyboardType="numeric"
        />
        <Pressable style={loginCreateStyles.button}>
          <Text style={loginCreateStyles.btnText}>Verify</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
