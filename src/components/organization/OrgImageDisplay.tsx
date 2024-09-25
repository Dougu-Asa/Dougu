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
  const orgId = org!.id;
  const imageKey = org!.image;

  useEffect(() => {
    const checkCache = async () => {
      const path = await Image.getCachePathAsync(imageKey);
      if (path) {
        setOrgSource({ uri: path });
      } else {
        const fetchPath = `public/${orgId}/${imageKey}`;
        const fetchImageUri = await getImageUri(fetchPath);
        if (fetchImageUri) setOrgSource({ uri: fetchImageUri });
        else setOrgSource(orgMapping["default"]);
      }
    };

    if (imageSource) {
      setOrgSource(imageSource);
    } else {
      checkCache();
    }
  }, [imageKey, imageSource, org, orgId]);

  return (
    <Image
      source={
        typeof orgSource === "object" && "uri" in orgSource
          ? { uri: orgSource.uri, cacheKey: org!.image }
          : orgSource
      }
      style={displayStyles.image}
    />
  );
}