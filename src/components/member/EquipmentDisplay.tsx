import { Pressable } from "react-native";
import IconMap from "../../helper/ImageMapping";
import { itemStyles } from "../../styles/ItemStyles";

export default function EquipmentDisplay({ image }: { image: string }) {
  return (
    <Pressable
      style={({ pressed }) => [
        {
          opacity: pressed ? 0.7 : 1,
        },
        itemStyles.equipment,
      ]}
    >
      <IconMap icon={image} />
    </Pressable>
  );
}
