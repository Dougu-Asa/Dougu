import { View, TouchableOpacity, Text, Alert, Dimensions } from "react-native";
import React, { useState } from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Button } from "@rneui/themed";
import { DataStore } from "@aws-amplify/datastore";

import { useUser } from "../../helper/context/UserContext";
import ProfileOverlay from "../../components/drawer/ProfileOverlay";
import NameOverlay from "../../components/drawer/NameOverlay";
import PasswordOverlay from "../../components/drawer/PasswordOverlay";
import EmailOverlay from "../../components/drawer/EmailOverlay";
import DeleteOverlay from "../../components/drawer/DeleteOverlay";
import { Organization } from "../../models";
import { ProfileScreenProps } from "../../types/ScreenTypes";
import ProfileDisplay from "../../components/ProfileDisplay";
import { profileStyles } from "../../styles/ProfileStyles";

/*
  Displays user information and provides access for
  fields to be edited. User attributes are profile image,
  name, email, and password
*/
export default function ProfileScreen({
  navigation,
}: {
  navigation: ProfileScreenProps;
}) {
  const editIconSize = Dimensions.get("screen").width / 18;
  const { user } = useUser();
  const [profileKey, setProfileKey] = useState(user!.profile);
  const [profileVisible, setProfileVisible] = useState(false);
  const [nameVisible, setNameVisible] = useState(false);
  const [emailVisible, setEmailVisible] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);

  // organization managers must transfer ownership before deleting account
  const verifyDelete = async () => {
    const orgs = await DataStore.query(Organization, (o) =>
      o.manager.eq(user!.id),
    );
    if (orgs.length > 0) {
      Alert.alert(
        "Cannot Delete Account",
        "You are the manager of an organization, please transfer ownership before deleting your account",
      );
    } else {
      setDeleteVisible(true);
    }
  };

  return (
    <View style={profileStyles.container}>
      <TouchableOpacity
        style={profileStyles.profile}
        onPress={() => setProfileVisible(true)}
      >
        <ProfileDisplay
          userId={user!.id}
          profileKey={profileKey}
          size={100}
          profileSource={null}
        />
        <View style={profileStyles.editButton}>
          <MaterialCommunityIcons name="pencil" size={editIconSize} />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={profileStyles.row}
        onPress={() => setNameVisible(true)}
      >
        <Text style={profileStyles.text}>Name</Text>
        <View style={profileStyles.changeBtn}>
          <Text style={profileStyles.text}>{user!.name}</Text>
          <MaterialCommunityIcons name="chevron-right" size={30} />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={profileStyles.row}
        onPress={() => setEmailVisible(true)}
      >
        <Text style={profileStyles.text}>Email</Text>
        <View style={profileStyles.changeBtn}>
          <Text style={profileStyles.text}>{user!.email}</Text>
          <MaterialCommunityIcons name="chevron-right" size={30} />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={profileStyles.row}
        onPress={() => setPasswordVisible(true)}
      >
        <Text style={profileStyles.text}>Change Password</Text>
        <View style={profileStyles.changeBtn}>
          <MaterialCommunityIcons name="chevron-right" size={30} />
        </View>
      </TouchableOpacity>
      <Button
        title="Delete Account"
        color={"#EEEEEE"}
        buttonStyle={profileStyles.button}
        titleStyle={profileStyles.buttonText}
        onPress={verifyDelete}
      />
      <ProfileOverlay
        visible={profileVisible}
        setVisible={setProfileVisible}
        profileKey={profileKey}
        setProfileKey={setProfileKey}
      />
      <NameOverlay visible={nameVisible} setVisible={setNameVisible} />
      <PasswordOverlay
        visible={passwordVisible}
        setVisible={setPasswordVisible}
      />
      <EmailOverlay visible={emailVisible} setVisible={setEmailVisible} />
      <DeleteOverlay
        visible={deleteVisible}
        setVisible={setDeleteVisible}
        navigation={navigation}
      />
    </View>
  );
}
