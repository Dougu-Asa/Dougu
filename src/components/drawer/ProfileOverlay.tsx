import React, { useState } from "react";
import { StyleSheet, Image, Dimensions, Pressable } from "react-native";
import { profileMapping } from "../../helper/ImageMapping";
import Animated, {
  FadeIn,
  FadeOut,
  ZoomIn,
  ZoomOut,
} from "react-native-reanimated";
import { containerOverlayStyles } from "../../styles/ContainerOverlay";
import IconMenu from "../IconMenu";

export default function ProfileOverlay({
  visible,
  setVisible,
  profile,
}: {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  profile: string;
}) {
  const [profileImage, setProfileImage] = useState<string>(profile);

  return (
    <>
      {visible && (
        <Pressable
          onPress={() => setVisible(false)}
          style={containerOverlayStyles.backDrop}
        >
          <Animated.View entering={FadeIn} exiting={FadeOut}>
            <Image
              source={profileMapping[profileImage]}
              style={styles.profileImage}
            />
          </Animated.View>
          <Animated.View
            style={[
              containerOverlayStyles.itemContainer,
              { backgroundColor: "#D3D3D3" },
            ]}
            entering={ZoomIn}
            exiting={ZoomOut}
          >
            <Pressable onPress={() => {}} style={styles.pressableContainer}>
              <IconMenu setIcon={setProfileImage} data={profileMapping} />
            </Pressable>
          </Animated.View>
        </Pressable>
      )}
    </>
  );
}

const profileSize = Dimensions.get("screen").width / 4;
const styles = StyleSheet.create({
  backDrop: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  overlay: {
    backgroundColor: "#D3D3D3",
    width: "85%",
    height: "55%",
    borderRadius: 20,
  },
  pressableContainer: {
    height: "100%",
    width: "100%",
  },
  profileImage: {
    width: profileSize,
    height: profileSize,
    borderRadius: profileSize / 2,
    marginTop: "5%",
  },
});
