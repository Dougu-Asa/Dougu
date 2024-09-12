import { Image, ImageSourcePropType, Pressable } from "react-native";
import { itemStyles } from "../../styles/ItemStyles";
import { Hex } from "../../types/ModelTypes";

/* Basically equipment display but to display creating items,
  which requires directly displaying the image instead of fetching it */
export default function ItemImageDisplay({
  imageSource,
  color,
}: {
  imageSource: ImageSourcePropType;
  color: Hex;
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        {
          opacity: pressed ? 0.7 : 1,
          backgroundColor: color,
        },
        itemStyles.equipment,
        itemStyles.size,
        itemStyles.radiusBackground,
      ]}
    >
      <Image source={imageSource} style={itemStyles.size} resizeMode="cover" />
    </Pressable>
  );
}
