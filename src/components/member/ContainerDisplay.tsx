import { Pressable } from "react-native";
import { useResponsiveStyles } from "../../styles/ResponsiveStyles";
import { Hex } from "../../types/ModelTypes";

export default function ContainerDisplay({ color }: { color: Hex }) {
  const itemStyles = useResponsiveStyles();

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
