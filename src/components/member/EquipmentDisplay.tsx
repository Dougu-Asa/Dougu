import { Pressable, View } from "react-native";
import IconMap from "../../helper/ImageMapping";
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

  return (
    <View>
      <Pressable
        style={({ pressed }) => [
          {
            opacity: pressed ? 0.7 : 1,
          },
          itemStyles.equipment,
          sizeStyles,
        ]}
      >
        <IconMap icon={image} isMini={isMini} fillColor={color} />
      </Pressable>
    </View>
  );
}
