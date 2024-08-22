import { Pressable, View } from "react-native";
import IconMap from "../../helper/ImageMapping";
import { itemStyles } from "../../styles/ItemStyles";

export default function EquipmentDisplay({
  image,
  isMini,
}: {
  image: string;
  isMini: boolean;
}) {
  const sizeStyles = isMini ? itemStyles.sizeMini : itemStyles.size;

  return (
    <View style={itemStyles.backDrop}>
      <Pressable
        style={({ pressed }) => [
          {
            opacity: pressed ? 0.7 : 1,
          },
          itemStyles.equipment,
          sizeStyles,
        ]}
      >
        <IconMap icon={image} isMini={isMini} />
      </Pressable>
    </View>
  );
}
