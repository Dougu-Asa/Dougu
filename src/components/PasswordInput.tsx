import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { loginCreateStyles } from "../styles/LoginCreate";
import { useState } from "react";
import { View, TextInput } from "react-native";

export default function PasswordInput({
  password,
  setPassword,
  placeHolder,
  ...props
}: {
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  placeHolder: string;
  [key: string]: any;
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={loginCreateStyles.passwordContainer}>
      <TextInput
        style={loginCreateStyles.pinput}
        onChangeText={setPassword}
        secureTextEntry={!showPassword}
        value={password}
        placeholder={placeHolder}
        keyboardType="default"
        {...props}
      />
      <MaterialCommunityIcons
        name={showPassword ? "eye" : "eye-off"}
        size={28}
        color="#aaa"
        style={loginCreateStyles.icon}
        onPress={() => setShowPassword(!showPassword)}
      />
    </View>
  );
}
