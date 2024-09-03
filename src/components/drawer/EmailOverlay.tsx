import { Overlay, Button } from "@rneui/themed";
import { Dispatch, SetStateAction, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

export default function EmailOverlay({
  visible,
  setVisible,
}: {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
}) {
  const [email, setEmail] = useState("");

  // update user profile attributes in Cognito
  const handleSet = async () => {
    console.log("EmailOverlay handleSet");
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
      <Text style={styles.header}>Change Email</Text>
      <TextInput
        onChangeText={setEmail}
        value={email}
        placeholder="new email"
        style={styles.email}
      />
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
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: "10%",
  },
  email: {
    width: "80%",
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginTop: "5%",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
});
