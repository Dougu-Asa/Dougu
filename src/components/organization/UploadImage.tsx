import { useState } from "react";
import { Button, View, StyleSheet } from "react-native";
import {
  launchImageLibraryAsync,
  launchCameraAsync,
  MediaTypeOptions,
} from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
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
  const { image, setImage } = useItemImage();

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await launchImageLibraryAsync({
      mediaTypes: MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      // compress the image (for cost savings)
      const manipResult = await ImageManipulator.manipulateAsync(
        result.assets[0].uri,
        [{ resize: { width: 100 } }],
        { compress: 0.4, format: ImageManipulator.SaveFormat.PNG },
      );
      setImage(manipResult.uri);
      setImageName(result.assets[0].fileName);
    }
  };

  const takePhoto = async () => {
    let result = await launchCameraAsync({
      mediaTypes: MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.4,
    });

    console.log(result);
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setImageName(result.assets[0].fileName);
    }
  };

  const uploadImage = async () => {
    try {
      const imageUri = image;
      const imageData = await fetch(String(imageUri)).then((r) => r.blob());
      const result = await uploadData({
        path: `public/${org!.id}/equipment/${imageName}`,
        data: imageData,
      }).result;
      console.log("Succeeded: ", result);
    } catch (error) {
      console.log("Error : ", error);
    }
  };

  const imageKey = "c780d0eb-8a0b-42c0-8cce-93f990b4bebe.jpeg";
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
      setImage(getUrlResult.url.toString());
    } catch (error) {
      console.log("Error : ", error);
      setImage("bad");
    }
  };

  return (
    <View style={styles.pickerContainer}>
      <Button title="Pick image" onPress={pickImage} />
      <Button title="Take photo" onPress={takePhoto} />
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
