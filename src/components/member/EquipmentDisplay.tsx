import { Image, Pressable } from "react-native";
import { iconMapping } from "../../helper/ImageMapping";
import { itemStyles } from "../../styles/ItemStyles";
import { Hex } from "../../types/ModelTypes";

export default function EquipmentDisplay({
  image,
  color,
  isMini,
}: {
  image: string;
  color: Hex;
  isMini: boolean;
}) {
  const sizeStyles = isMini ? itemStyles.sizeMini : itemStyles.size;
  const radius = isMini ? null : itemStyles.radiusBackground;

  return (
    <Pressable
      style={({ pressed }) => [
        {
          opacity: pressed ? 0.7 : 1,
          backgroundColor: color,
        },
        itemStyles.equipment,
        sizeStyles,
        radius,
      ]}
    >
      <Image
        source={iconMapping[image || "default"]}
        style={sizeStyles}
        resizeMode="cover"
      />
    </Pressable>
  );
}
