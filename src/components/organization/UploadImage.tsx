import { View, StyleSheet, Alert, Text } from "react-native";
import {
  launchImageLibraryAsync,
  launchCameraAsync,
  MediaTypeOptions,
  requestCameraPermissionsAsync,
  ImagePickerAsset,
} from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { useItemImage } from "../../helper/context/ItemImageContext";
import { Button } from "@rneui/themed";

/*
  ColorSelect allows the user to select a background color for
  equipment and containers. It is shown in the ItemImageScreen
  component.
*/
export default function UploadImage() {
  const { setImageSource, setImageKey } = useItemImage();

  // set the image source and key after compressing the image
  const setImage = async (asset: ImagePickerAsset) => {
    if (!asset.fileName) return;
    // compress the image (for cost savings)
    const manipResult = await ImageManipulator.manipulateAsync(
      asset.uri,
      [{ resize: { width: 100 } }],
      { compress: 0.4, format: ImageManipulator.SaveFormat.PNG },
    );
    setImageSource({ uri: manipResult.uri });
    setImageKey(asset.fileName);
  };

  // pick an image from the gallery
  const pickImage = async () => {
    let result = await launchImageLibraryAsync({
      mediaTypes: MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  // take a photo with the camera
  const takePhoto = async () => {
    const permissions = await requestCameraPermissionsAsync();
    if (!permissions.granted) {
      Alert.alert(
        "Camera permissions are required to take a photo.",
        "Please enable camera permissions in your settings.",
      );
      return;
    }
    let result = await launchCameraAsync({
      mediaTypes: MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.4,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Upload Image</Text>
      <Text style={styles.text}>
        Upload an image for your equipment icon. Uploaded images will appear as
        default images when there is no internet.
      </Text>
      <Button
        title="Select from gallery"
        titleStyle={{ fontWeight: "500" }}
        radius={"md"}
        size="lg"
        buttonStyle={styles.button}
        containerStyle={styles.buttonContainer}
        onPress={pickImage}
      />
      <Button
        title="Take Photo"
        titleStyle={{ fontWeight: "500" }}
        radius={"md"}
        size="lg"
        buttonStyle={styles.button}
        containerStyle={styles.buttonContainer}
        onPress={takePhoto}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#791111",
  },
  buttonContainer: {
    width: "80%",
    margin: 10,
  },
  container: {
    flex: 1,
    alignItems: "center",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: "10%",
  },
  text: {
    textAlign: "center",
    marginBottom: 20,
    width: "80%",
  },
});
