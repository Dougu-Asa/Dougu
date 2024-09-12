import { ImageSourcePropType, StyleSheet, View } from "react-native";
import { OrgImageScreenProps } from "../../types/ScreenTypes";
import { useState } from "react";
import { Image } from "expo-image";
import UploadImage from "../../components/organization/UploadImage";
import { Button } from "@rneui/themed";

export default function OrgImageScreen({ route }: OrgImageScreenProps) {
  const { key } = route.params;
  const [imageKey, setImageKey] = useState<string>(key);
  const [imageSource, setImageSource] = useState<ImageSourcePropType | null>(
    require("../../assets/asayake.png"),
  );

  const handleUpload = () => {
    // upload the image to AWS S3
  };

  return (
    <View style={styles.container}>
      <Image source={imageSource} style={styles.image} />
      <View style={styles.uploadContainer}>
        <UploadImage
          setImageSource={setImageSource}
          setImageKey={setImageKey}
        />
      </View>
      <Button
        buttonStyle={styles.button}
        containerStyle={styles.buttonContainer}
        icon={{ name: "upload", type: "antdesign", color: "white" }}
        onPress={handleUpload}
        title="Upload"
        titleStyle={{ fontWeight: "500" }}
        radius={"md"}
        size="lg"
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
  },
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 20,
  },
  uploadContainer: {
    width: "90%",
    minHeight: "50%",
    borderRadius: 20,
  },
});
