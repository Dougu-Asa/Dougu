import { Image, ImageSourcePropType, Pressable } from "react-native";
import { itemStyles } from "../../styles/ItemStyles";
import { Hex } from "../../types/ModelTypes";
import { iconMapping } from "../../helper/ImageMapping";
import { useEffect, useState } from "react";
import { getUrl } from "@aws-amplify/storage";
import { useUser } from "../../helper/context/UserContext";

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
  const [imageUri, setImageUri] = useState<ImageSourcePropType>(
    iconMapping["default"],
  );
  const { org } = useUser();

  // set the image uri
  useEffect(() => {
    const getImageUri = async () => {
      try {
        console.log("Getting image: ", image);
        const getUrlResult = await getUrl({
          path: `public/${org!.id}/equipment/${image}`,
          options: {
            validateObjectExistence: true, // Check if object exists before creating a URL
          },
        });
        setImageUri({ uri: getUrlResult.url.toString() });
      } catch (error) {
        console.log("Error getting image: ", error);
        setImageUri(iconMapping["default"]);
      }
    };

    if (image in iconMapping) {
      setImageUri(iconMapping[image]);
    } else {
      getImageUri();
    }
  }, [image, org]);

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
