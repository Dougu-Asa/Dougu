import { Overlay, Button } from "@rneui/themed";
import { Dispatch, SetStateAction, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
import { updatePassword } from "aws-amplify/auth";

import { handleError } from "../../helper/Utils";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { loginCreateStyles } from "../../styles/LoginCreate";

export default function PasswordOverlay({
  visible,
  setVisible,
}: {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
}) {
  const [currPassword, setCurrPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrPassword, setShowCurrPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // update user profile attributes in Cognito
  const handleSet = async () => {
    try {
      // ensure new password and confirm password match
      if (newPassword !== confirmPassword) {
        Alert.alert("Passwords do not match", "Please try again");
        return;
      }
      // check password length
      // check password length
      if (newPassword.length < 8) {
        Alert.alert(
          "Form Error",
          "Password must be at least 8 characters long.",
        );
        return;
      }
      // set user password in cognito
      await updatePassword({ oldPassword: currPassword, newPassword });
      setCurrPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setVisible(false);
      Alert.alert("Password Updated", "Your password has been updated");
    } catch (e) {
      handleError("handleSet", e as Error, null);
    }
  };

  return (
    <Overlay
      isVisible={visible}
      fullScreen
      animationType="slide"
      overlayStyle={{ alignItems: "center" }}
    >
      <View style={styles.row}>
        <Button
          icon={{ name: "arrow-left", type: "font-awesome", color: "black" }}
          title="Profile"
          titleStyle={{ color: "black" }}
          type="clear"
          onPress={() => setVisible(false)}
          buttonStyle={{ alignSelf: "flex-start" }}
        />
      </View>
      <Text style={loginCreateStyles.header}>Change Password</Text>
      <View style={loginCreateStyles.passwordContainer}>
        <TextInput
          style={loginCreateStyles.pinput}
          onChangeText={setCurrPassword}
          secureTextEntry={!showCurrPassword}
          value={currPassword}
          placeholder="current password"
          keyboardType="default"
        />
        <MaterialCommunityIcons
          name={showCurrPassword ? "eye" : "eye-off"}
          size={28}
          color="#aaa"
          style={loginCreateStyles.icon}
          onPress={() => setShowCurrPassword(!showCurrPassword)}
        />
      </View>
      <View style={loginCreateStyles.passwordContainer}>
        <TextInput
          style={loginCreateStyles.pinput}
          onChangeText={setNewPassword}
          secureTextEntry={!showNewPassword}
          value={newPassword}
          placeholder="new password"
          keyboardType="default"
        />
        <MaterialCommunityIcons
          name={showNewPassword ? "eye" : "eye-off"}
          size={28}
          color="#aaa"
          style={loginCreateStyles.icon}
          onPress={() => setShowNewPassword(!showNewPassword)}
        />
      </View>
      <View style={loginCreateStyles.passwordContainer}>
        <TextInput
          style={loginCreateStyles.pinput}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirmPassword}
          value={confirmPassword}
          placeholder="confirm password"
          keyboardType="default"
        />
        <MaterialCommunityIcons
          name={showConfirmPassword ? "eye" : "eye-off"}
          size={28}
          color="#aaa"
          style={loginCreateStyles.icon}
          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
        />
      </View>
      <Button
        radius={"md"}
        type="solid"
        icon={{ name: "save", type: "font-awesome", color: "white" }}
        title="Save"
        buttonStyle={styles.button}
        containerStyle={{ width: "80%" }}
        onPress={handleSet}
      />
    </Overlay>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#333333",
    marginTop: "5%",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
});
