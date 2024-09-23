import { ImageSourcePropType } from "react-native";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { getImageUri } from "../../helper/AWS";
import { useDisplaytyles } from "../../styles/Display";
import { useUser } from "../../helper/context/UserContext";
import { orgMapping } from "../../helper/ImageMapping";

/*
  ProfileDisplay displays the profile image of a user. It can either
  use a stored image uri or fetch the image from AWS S3.
*/
export default function OrgImageDisplay({
  imageSource,
}: {
  imageSource?: ImageSourcePropType | null;
}) {
  const displayStyles = useDisplaytyles();
  const { org } = useUser();
  const [orgSource, setOrgSource] = useState<ImageSourcePropType>(
    orgMapping["default"],
  );

  useEffect(() => {
    const checkCache = async () => {
      if (imageSource) {
        setOrgSource(imageSource);
        return;
      }
      const path = await Image.getCachePathAsync(org!.id);
      if (path) {
        setOrgSource({ uri: path });
      } else {
        const fetchPath = `public/${org!.id}/orgImage.jpeg`;
        const fetchImageUri = await getImageUri(fetchPath);
        if (fetchImageUri) setOrgSource({ uri: fetchImageUri });
      }
    };

    checkCache();
  }, [imageSource, org]);

  return (
    <Image
      source={
        typeof orgSource === "object" && "uri" in orgSource
          ? { uri: orgSource.uri, cacheKey: org!.id }
          : orgSource
      }
      style={displayStyles.image}
    />
  );
}
