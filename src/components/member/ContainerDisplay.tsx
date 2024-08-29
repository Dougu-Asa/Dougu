import { Pressable } from "react-native";
import { itemStyles } from "../../styles/ItemStyles";
import { Hex } from "../../types/ModelTypes";

export default function ContainerDisplay({ color }: { color: Hex }) {
  return (
    <Pressable
      style={({ pressed }) => [
        {
          opacity: pressed ? 0.7 : 1,
          backgroundColor: color,
        },
        itemStyles.containerItem,
      ]}
    ></Pressable>
  );
}
