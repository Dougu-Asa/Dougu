import { Button, Overlay, Text } from "@rneui/themed";
import { Dispatch, SetStateAction, useState } from "react";
import { EditType } from "../../types/ModelTypes";
import { TextInput } from "react-native";

export default function EditAttributesOverlay({
  visible,
  setVisible,
  type,
}: {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  type: EditType | null;
}) {
  const [input, setInput] = useState("");

  return (
    <Overlay isVisible={visible} fullScreen>
      <Text>{type}</Text>
      <TextInput onChangeText={setInput} value={input} placeholder="input" />
      <Button onPress={() => setVisible(!visible)}>Close</Button>
    </Overlay>
  );
}
