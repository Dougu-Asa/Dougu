import React, { useState } from "react";
import {
  StyleSheet,
  Dimensions,
  Pressable,
  ImageSourcePropType,
} from "react-native";
import { profileMapping } from "../../helper/ImageMapping";
import Animated, {
  FadeIn,
  FadeOut,
  ZoomIn,
  ZoomOut,
} from "react-native-reanimated";

import { containerOverlayStyles } from "../../styles/ContainerOverlay";
import IconMenu from "../IconMenu";
import { useLoad } from "../../helper/context/LoadingContext";
import { handleError } from "../../helper/Utils";
import { useUser } from "../../helper/context/UserContext";
import {
  modifyUserAttribute,
  editOrgUserStorages,
  updateUserContext,
} from "../../helper/drawer/ModifyProfileUtils";
import { Tab } from "@rneui/themed";
import UploadImage from "../organization/UploadImage";
import ProfileDisplay from "../ProfileDisplay";
import { uploadProfile } from "../../helper/AWS";

/* 
    Dispay a profile menu for choosing a user's profile image
    when tapping on the profile in the profileScreen
*/
export default function ProfileOverlay({
  visible,
  setVisible,
  profileKey,
  setProfileKey,
}: {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  profileKey: string;
  setProfileKey: React.Dispatch<React.SetStateAction<string>>;
}) {
  const { setIsLoading } = useLoad();
  const { user, setUser } = useUser();
  const [selected, setSelected] = useState(0);
  const [profileSource, setProfileSource] =
    useState<ImageSourcePropType | null>(null);
  const profileSize = Dimensions.get("screen").width / 4;

  // update user profile attributes in Cognito
  const handleSet = async (profileData: string) => {
    setProfileSource(null);
    setProfileKey(profileData);
  };

  const handleClose = async () => {
    await updateProfile();
    setVisible(false);
    setSelected(0);
  };

  const updateProfile = async () => {
    try {
      // don't update if the profile is the same
      if (user?.profile === profileKey) {
        return;
      }
      setIsLoading(true);
      // if we are using profilesource, we need to upload it to S3
      if (profileSource) {
        await uploadProfile(profileSource, profileKey);
      }
      updateUserContext(user!, setUser, "profile", profileKey);
      modifyUserAttribute("profile", profileKey);
      // update OrgUserStorages to match user profile
      await editOrgUserStorages(user!.id, "profile", profileKey);
      setIsLoading(false);
    } catch (e) {
      handleError("updateProfile", e as Error, setIsLoading);
    }
  };

  return (
    <>
      {visible && (
        <Pressable
          onPress={handleClose}
          style={containerOverlayStyles.backDrop}
        >
          <Animated.View
            entering={FadeIn}
            exiting={FadeOut}
            style={styles.profile}
          >
            <ProfileDisplay
              userId={user!.id}
              profileKey={profileKey}
              size={profileSize}
              profileSource={profileSource}
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
              <Tab
                value={selected}
                onChange={setSelected}
                iconPosition="left"
                indicatorStyle={[{ backgroundColor: "black", width: "50%" }]}
                titleStyle={{ color: "black" }}
                containerStyle={{
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                }}
              >
                <Tab.Item
                  icon={{ name: "camera", type: "ionicon", color: "black" }}
                ></Tab.Item>
                <Tab.Item
                  icon={{ name: "file", type: "font-awesome", color: "black" }}
                ></Tab.Item>
              </Tab>
              {selected === 0 ? (
                <IconMenu data={profileMapping} handleSet={handleSet} />
              ) : (
                <UploadImage
                  setImageSource={setProfileSource}
                  setImageKey={setProfileKey}
                />
              )}
            </Pressable>
          </Animated.View>
        </Pressable>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  backDrop: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  button: {
    backgroundColor: "#791111",
  },
  buttonContainer: {
    width: "80%",
    margin: 10,
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
  profile: {
    marginTop: "5%",
  },
});
