import {
  Image,
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  Text,
  Alert,
} from "react-native";
import React, { useState } from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Button } from "@rneui/themed";
import { DataStore } from "@aws-amplify/datastore";

import { useUser } from "../../helper/context/UserContext";
import { profileMapping } from "../../helper/ImageMapping";
import ProfileOverlay from "../../components/drawer/ProfileOverlay";
import NameOverlay from "../../components/drawer/NameOverlay";
import PasswordOverlay from "../../components/drawer/PasswordOverlay";
import EmailOverlay from "../../components/drawer/EmailOverlay";
import DeleteOverlay from "../../components/drawer/DeleteOverlay";
import { Organization } from "../../models";
import { ProfileScreenProps } from "../../types/ScreenTypes";

const profileSize = Dimensions.get("screen").width / 4;
const editSize = Dimensions.get("screen").width / 10;

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
  const { user } = useUser();
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
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.profile}
        onPress={() => setProfileVisible(true)}
      >
        <Image
          source={profileMapping[user!.profile || "default"]}
          style={styles.profileImage}
        />
        <View style={styles.editButton}>
          <MaterialCommunityIcons name="pencil" size={editSize / 1.8} />
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.row} onPress={() => setNameVisible(true)}>
        <Text style={styles.text}>Name</Text>
        <View style={styles.changeBtn}>
          <Text style={styles.text}>{user!.name}</Text>
          <MaterialCommunityIcons name="chevron-right" size={30} />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.row}
        onPress={() => setEmailVisible(true)}
      >
        <Text style={styles.text}>Email</Text>
        <View style={styles.changeBtn}>
          <Text style={styles.text}>{user!.email}</Text>
          <MaterialCommunityIcons name="chevron-right" size={30} />
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.row}
        onPress={() => setPasswordVisible(true)}
      >
        <Text style={styles.text}>Change Password</Text>
        <View style={styles.changeBtn}>
          <MaterialCommunityIcons name="chevron-right" size={30} />
        </View>
      </TouchableOpacity>
      <Button
        title="Delete Account"
        color={"#EEEEEE"}
        buttonStyle={styles.button}
        titleStyle={styles.buttonText}
        onPress={verifyDelete}
      />
      <ProfileOverlay
        visible={profileVisible}
        setVisible={setProfileVisible}
        profile={user!.profile}
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

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: "red",
  },
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
  },
  changeBtn: {
    flexDirection: "row",
    alignItems: "center",
  },
  editButton: {
    width: editSize,
    height: editSize,
    borderRadius: editSize / 2,
    backgroundColor: "#D3D3D3",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    right: -5,
    bottom: -5,
    borderColor: "white",
    borderWidth: 5,
  },
  text: {
    fontSize: 16,
  },
  profile: {
    width: profileSize,
    marginTop: "5%",
    marginBottom: "5%",
  },
  profileImage: {
    width: profileSize,
    height: profileSize,
    borderRadius: profileSize / 2,
  },
  row: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
  },
});
