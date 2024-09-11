import { Image, ImageSourcePropType } from "react-native";
import { profileMapping } from "../helper/ImageMapping";
import { useEffect, useState } from "react";
import { getImageUri } from "../helper/AWS";

export default function ProfileDisplay({
  profileKey,
  profileSource,
  size,
  userId,
}: {
  profileKey: string;
  profileSource: ImageSourcePropType | null;
  size: number;
  userId: string | null | undefined;
}) {
  const [imageUri, setImageUri] = useState<ImageSourcePropType>(
    profileMapping["default"],
  );
  useEffect(() => {
    if (profileSource) {
      setImageUri(profileSource);
    } else if (profileKey in profileMapping) {
      setImageUri(profileMapping[profileKey]);
    } else {
      const path = `public/profiles/${userId}/profile.jpeg`;
      const fetchImageUri = getImageUri(path, profileMapping);
      fetchImageUri.then((uri) => {
        setImageUri(uri);
      });
    }
  }, [profileKey, profileSource, userId]);

  return (
    <Image
      source={imageUri}
      style={{ width: size, height: size, borderRadius: size / 2 }}
    />
  );
}
