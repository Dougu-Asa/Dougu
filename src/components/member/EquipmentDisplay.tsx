import { ImageSourcePropType, Pressable } from "react-native";
import { Image } from "expo-image";
import { itemStyles } from "../../styles/ItemStyles";
import { EquipmentObj, Hex } from "../../types/ModelTypes";
import { iconMapping } from "../../helper/ImageMapping";
import { useUser } from "../../helper/context/UserContext";
import { useEffect, useState } from "react";
import { getImageUri } from "../../helper/AWS";

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

  // set the image uri
  useEffect(() => {
    if (!item) return;
    const image = item.image;
    if (image in iconMapping) {
      setImageUri(iconMapping[image]);
    } else if (item.uri) {
      // if we previously fetched the uri, use that
      setImageUri(item.uri);
    } else {
      const path = `public/${org!.id}/equipment/${image}`;
      const fetchImageUri = getImageUri(path, iconMapping);
      fetchImageUri.then((uri) => {
        setImageUri(uri);
        item.uri = uri;
      });
    }
  }, [item, org]);

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
