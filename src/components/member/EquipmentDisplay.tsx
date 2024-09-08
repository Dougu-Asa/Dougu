import { Image, ImageSourcePropType, Pressable } from "react-native";
import { itemStyles } from "../../styles/ItemStyles";
import { Hex } from "../../types/ModelTypes";
import { iconMapping } from "../../helper/ImageMapping";

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
  const radius = isMini
    ? itemStyles.radiusBackgroundMini
    : itemStyles.radiusBackground;
  const imageUri: ImageSourcePropType =
    image in iconMapping ? iconMapping[image] : { uri: image };

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
