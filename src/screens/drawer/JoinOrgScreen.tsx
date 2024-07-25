import { StatusBar } from "expo-status-bar";
import { Text, View, TextInput } from "react-native";
import React from "react";
import { DataStore } from "@aws-amplify/datastore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TouchableOpacity } from "react-native-gesture-handler";

// project imports
import createJoinStyles from "../../styles/CreateJoinStyles";
import { useLoad } from "../../helper/LoadingContext";
import {
  OrgUserStorage,
  Organization,
  User,
  UserOrStorage,
} from "../../models";
import { useUser } from "../../helper/UserContext";
import { handleError } from "../../helper/Utils";
import { JoinOrgScreenProps } from "../../types/ScreenTypes";

/*
  Screen for joining an organization, user enters the access code to join
*/
function JoinOrgScreen({ navigation }: JoinOrgScreenProps) {
  const { setIsLoading } = useLoad();
  const [code, onChangeCode] = React.useState("");
  const { user, setOrg } = useUser();

  // ensure the code given is valid and the user is not already part of the org
  async function checkCode() {
    const org = await DataStore.query(Organization, (c) =>
      c.accessCode.eq(code.toUpperCase()),
    );
    if (org.length === 0) {
      throw new Error("Organization does not exist!");
    } else if (org.length !== 1) {
      throw new Error("Wrong Number of Organizations Found!");
    }
    // if the user is already part of that org, throw an error
    const exist = await DataStore.query(OrgUserStorage, (c) =>
      c.and((c) => [
        c.organizationUserOrStoragesId.eq(org[0].id),
        c.userOrganizationsUserId.eq(user!.attributes.sub),
      ]),
    );
    if (exist.length > 0) {
      throw new Error("User is already part of this organization!");
    }
    return org[0];
  }

  // create an orgUserStorage object for the user and the org
  async function createOrgUserStorage(org: Organization) {
    const DBuser = await DataStore.query(User, user!.attributes.sub);
    if (DBuser == null) throw new Error("User does not exist!");
    await DataStore.save(
      new OrgUserStorage({
        organization: org,
        type: UserOrStorage.USER,
        user: DBuser,
        name: DBuser.name,
        image: "default",
      }),
    );
  }

  async function handleJoin() {
    try {
      // Query for the org with the access code
      setIsLoading(true);
      const org = await checkCode();
      // Create an OrgUserStorage object for the user
      await createOrgUserStorage(org);
      // update context and async storage
      const key = user!.attributes.sub + " currOrg";
      await AsyncStorage.setItem(key, JSON.stringify(org));
      setOrg(org);
      setIsLoading(false);
      onChangeCode("");
      navigation.navigate("MemberTabs", { screen: "Equipment" });
    } catch (error) {
      handleError("joinOrg", error as Error, setIsLoading);
    }
  }

  return (
    <View style={createJoinStyles.mainContainer}>
      <Text style={createJoinStyles.title}>Join Org</Text>
      <Text style={createJoinStyles.subtitle}>
        Enter the access code provided by the organization manager
      </Text>
      <TextInput
        style={createJoinStyles.input}
        onChangeText={onChangeCode}
        value={code}
        placeholder="Ex. ABC1234"
        keyboardType="default"
      />
      <TouchableOpacity
        style={createJoinStyles.button}
        onPress={() => {
          handleJoin();
        }}
      >
        <Text style={createJoinStyles.btnText}>Join My Org</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
}

export default JoinOrgScreen;
