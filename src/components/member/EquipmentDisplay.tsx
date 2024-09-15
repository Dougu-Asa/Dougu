import { ImageSourcePropType, Pressable } from "react-native";
import { Image } from "expo-image";
import { itemStyles } from "../../styles/ItemStyles";
import { EquipmentObj, Hex } from "../../types/ModelTypes";
import { iconMapping } from "../../helper/ImageMapping";
import { useUser } from "../../helper/context/UserContext";
import { useEffect, useState } from "react";
import { getImageUri } from "../../helper/AWS";
import { useImage } from "../../helper/context/ImageContext";

/*
  EquipmentDisplay displays the image of an equipment object. It can either
  use a stored image uri or fetch the image from AWS S3.
*/
export default function EquipmentDisplay({
  item,
  color,
  isMini,
  imageSource,
}: {
  item: EquipmentObj | null;
  color: Hex;
  isMini: boolean;
  imageSource?: ImageSourcePropType | null;
}) {
  const sizeStyles = isMini ? itemStyles.sizeMini : itemStyles.size;
  const radius = isMini
    ? itemStyles.radiusBackgroundMini
    : itemStyles.radiusBackground;

  const [imageUri, setImageUri] = useState<ImageSourcePropType>(
    iconMapping["default"],
  );
  const { org } = useUser();
  const { imageMap } = useImage();

  // set the image uri
  useEffect(() => {
    if (!item) return;
    const image = item.image;
    if (image in iconMapping) {
      setImageUri(iconMapping[image]);
    } else if (imageMap.has(image)) {
      setImageUri(imageMap.get(image)!);
    } else {
      const path = `public/${org!.id}/equipment/${image}`;
      const fetchImageUri = getImageUri(path, iconMapping);
      fetchImageUri.then((uri) => {
        setImageUri(uri);
        imageMap.set(image, uri);
      });
    }
  }, [imageMap, item, org]);

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
        style={sizeStyles}
        source={imageSource ? imageSource : imageUri}
        contentFit="cover"
        placeholder={iconMapping["default"]}
      />
    </Pressable>
  );
}
