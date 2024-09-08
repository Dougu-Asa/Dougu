import { Image, ImageSourcePropType, Pressable } from "react-native";
import { itemStyles } from "../../styles/ItemStyles";
import { Hex } from "../../types/ModelTypes";

export default function EquipmentDisplay({
  imageUri,
  color,
  isMini,
}: {
  imageUri: ImageSourcePropType;
  color: Hex;
  isMini: boolean;
}) {
  const sizeStyles = isMini ? itemStyles.sizeMini : itemStyles.size;
  const radius = isMini
    ? itemStyles.radiusBackgroundMini
    : itemStyles.radiusBackground;

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
      <Image source={imageUri} style={sizeStyles} resizeMode="cover" />
    </Pressable>
  );
}
