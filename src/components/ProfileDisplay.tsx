import { Image, ImageSourcePropType } from "react-native";
import { profileMapping } from "../helper/ImageMapping";
import { useEffect, useState } from "react";
import { getProfileUri } from "../helper/AWS";
import { useUser } from "../helper/context/UserContext";

export default function ProfileDisplay({
  userId,
  profileKey,
  profileSource,
  size,
}: {
  userId: string;
  profileKey: string;
  profileSource: ImageSourcePropType | null;
  size: number;
}) {
  const { user } = useUser();
  const [imageUri, setImageUri] = useState<ImageSourcePropType>(
    profileMapping["default"],
  );

  useEffect(() => {
    if (profileSource) {
      setImageUri(profileSource);
      return;
    }
    const fetchImageUri = getProfileUri(profileKey, profileMapping);
    fetchImageUri.then((uri) => {
      setImageUri(uri);
    });
  }, [profileKey, profileSource, user]);

  return (
    <Image
      source={imageUri}
      style={{ width: size, height: size, borderRadius: size / 2 }}
    />
  );
}
