import { Pressable } from "react-native";
import { itemStyles } from "../../styles/ItemStyles";

export default function ContainerDisplay() {
  return (
    <Pressable
      style={({ pressed }) => [
        {
          opacity: pressed ? 0.7 : 1,
        },
        itemStyles.containerItem,
      ]}
    ></Pressable>
  );
}
