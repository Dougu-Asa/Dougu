import { Image, Pressable, View } from "react-native";
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
  const iconSize = isMini ? itemStyles.iconMini : itemStyles.icon;

  return (
    <View>
      <Pressable
        style={({ pressed }) => [
          {
            opacity: pressed ? 0.7 : 1,
            backgroundColor: color,
          },
          itemStyles.equipment,
          sizeStyles,
        ]}
      >
        <Image
          source={iconMapping[image || "default"]}
          style={iconSize}
          resizeMode="contain"
        />
      </Pressable>
    </View>
  );
}
