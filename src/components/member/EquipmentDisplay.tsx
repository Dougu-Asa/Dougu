import { Image, ImageSourcePropType, Pressable } from "react-native";
import { itemStyles } from "../../styles/ItemStyles";
import { Hex } from "../../types/ModelTypes";
import { iconMapping } from "../../helper/ImageMapping";
import { useEffect, useState } from "react";
import { useUser } from "../../helper/context/UserContext";
import { getImageUri } from "../../helper/AWS";

export default function EquipmentDisplay({
  image,
  color,
  isMini,
  imageSource,
}: {
  image: string;
  color: Hex;
  isMini: boolean;
  imageSource: ImageSourcePropType | null;
}) {
  const sizeStyles = isMini ? itemStyles.sizeMini : itemStyles.size;
  const radius = isMini
    ? itemStyles.radiusBackgroundMini
    : itemStyles.radiusBackground;
  const [imageUri, setImageUri] = useState<ImageSourcePropType>(
    iconMapping["default"],
  );
  const { org } = useUser();

  // set the image uri
  useEffect(() => {
    if (imageSource) {
      setImageUri(imageSource);
    } else if (image in iconMapping) {
      setImageUri(iconMapping[image]);
    } else {
      const path = `public/${org!.id}/equipment/${image}`;
      const fetchImageUri = getImageUri(path, iconMapping);
      fetchImageUri.then((uri) => {
        setImageUri(uri);
      });
    }
  }, [image, imageSource, org]);

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
