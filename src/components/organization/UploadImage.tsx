import { useState } from "react";
import { Button, Image, View, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { getUrl, uploadData } from "aws-amplify/storage";
import { useUser } from "../../helper/context/UserContext";
import { useItemImage } from "../../helper/context/ItemImageContext";
/*
  ColorSelect allows the user to select a background color for
  equipment and containers. It is shown in the ItemImageScreen
  component.
*/
export default function UploadImage() {
  const [imageName, setImageName] = useState<string | null | undefined>(null);
  const { org } = useUser();
  const { iconUri, handleSet } = useItemImage();

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    console.log(result);

    if (!result.canceled) {
      handleSet(result.assets[0].uri);
      setImageName(result.assets[0].fileName);
    }
  };

  const uploadImage = async () => {
    if (typeof iconUri !== "object" || !("uri" in iconUri)) {
      console.log("Cannot fetch local image URI");
      return;
    }
    try {
      const imageUri = iconUri.uri;
      const image = await fetch(String(imageUri)).then((r) => r.blob());
      const result = await uploadData({
        path: `public/${org!.id}/equipment/${imageName}`,
        data: image,
      }).result;
      console.log("Succeeded: ", result);
    } catch (error) {
      console.log("Error : ", error);
    }
  };

  const imageKey = "486c84a4-0b8f-4a21-9d5b-758c20e8e86f.jpeg";
  const loadImage = async () => {
    try {
      const getUrlResult = await getUrl({
        path: `public/${org!.id}/equipment/${imageKey}`,
        options: {
          validateObjectExistence: true, // Check if object exists before creating a URL
        },
      });
      console.log("signed URL: ", getUrlResult.url);
      console.log("URL expires at: ", getUrlResult.expiresAt);
      handleSet(getUrlResult.url.toString());
    } catch (error) {
      console.log("Error : ", error);
    }
  };

  return (
    <View style={styles.pickerContainer}>
      {iconUri && <Image source={iconUri} style={styles.image} />}
      <Button title="Pick image" onPress={pickImage} />
      <Button title="Upload image" onPress={uploadImage} />
      <Button title="Load image" onPress={loadImage} />
    </View>
  );
}

const styles = StyleSheet.create({
  pickerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 200,
    height: 200,
  },
});
