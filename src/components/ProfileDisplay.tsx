import { ImageSourcePropType } from "react-native";
import { Image } from "expo-image";
import { profileMapping } from "../helper/ImageMapping";
import { useEffect, useState } from "react";
import { getImageUri } from "../helper/AWS";
import { useUser } from "../helper/context/UserContext";

/*
  ProfileDisplay displays the profile image of a user. It can either
  use a stored image uri or fetch the image from AWS S3.
*/
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
  const { user } = useUser();

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
        if (userId === user!.id) {
          user!.profileUri = uri;
        }
      });
    }
  }, [profileKey, profileSource, user, userId]);

  return (
    <Image
      source={imageUri}
      style={{ width: size, height: size, borderRadius: size / 2 }}
    />
  );
}
