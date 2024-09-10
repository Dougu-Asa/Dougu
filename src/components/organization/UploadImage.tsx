import { Button, View, StyleSheet } from "react-native";
import {
  launchImageLibraryAsync,
  launchCameraAsync,
  MediaTypeOptions,
} from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { useItemImage } from "../../helper/context/ItemImageContext";
/*
  ColorSelect allows the user to select a background color for
  equipment and containers. It is shown in the ItemImageScreen
  component.
*/
export default function UploadImage() {
  const { setImageSource, setImageKey } = useItemImage();

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await launchImageLibraryAsync({
      mediaTypes: MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      if (!result.assets[0].fileName) return;
      // compress the image (for cost savings)
      const manipResult = await ImageManipulator.manipulateAsync(
        result.assets[0].uri,
        [{ resize: { width: 100 } }],
        { compress: 0.4, format: ImageManipulator.SaveFormat.PNG },
      );
      setImageSource({ uri: manipResult.uri });
      setImageKey(result.assets[0].fileName);
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
      if (!result.assets[0].fileName) return;
      setImageSource({ uri: result.assets[0].uri });
      setImageKey(result.assets[0].fileName);
    }
  };

  return (
    <View style={styles.pickerContainer}>
      <Button title="Pick image" onPress={pickImage} />
      <Button title="Take photo" onPress={takePhoto} />
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
