import { Text, View, TextInput, TouchableOpacity } from "react-native";
import React from "react";
import { DataStore } from "@aws-amplify/datastore";
import AsyncStorage from "@react-native-async-storage/async-storage";

// project imports
import createJoinStyles from "../../styles/CreateJoinStyles";
import { useLoad } from "../../helper/LoadingContext";
import { Organization, OrgUserStorage, UserOrStorage } from "../../models";
import { useUser } from "../../helper/UserContext";
import { handleError } from "../../helper/Utils";
import { CreateOrgScreenProps } from "../../types/ScreenTypes";
import { createUserGroup, addUserToGroup } from "../../helper/AWS";

/*
  Screen for creating an organization, user enters the name of the org
  and a random access code is generated. The user that creates the org is
  automatically the manager of the org.
*/
function CreateOrgScreen({ navigation }: CreateOrgScreenProps) {
  const { setIsLoading } = useLoad();
  const [name, onChangeName] = React.useState("");
  const { user, setOrg } = useUser();
  const token = user!.signInUserSession.idToken.jwtToken;
  var randomstring = require("randomstring");

  // generate codes and check if they are unique. If not, generate another
  async function generateCode() {
    while (true) {
      const code = randomstring.generate({
        length: 7,
        capitalization: "uppercase",
      });
      // Check that access code and name are unique
      const orgs = await DataStore.query(Organization, (c) =>
        c.or((c) => [c.accessCode.eq(code), c.name.eq(name)]),
      );
      if (orgs == null || orgs.length === 0) {
        return code;
      }
    }
  }

  // create an org and orgUserStorage to add to the database
  async function createOrg(code: string): Promise<Organization> {
    // Add the org to the database
    const newOrg = await DataStore.save(
      new Organization({
        name: name,
        accessCode: code,
        manager: user!.attributes.sub,
        image: "default",
      }),
    );
    if (newOrg == null)
      throw new Error("Organization not created successfully.");
    // create a user group for the org
    await createUserGroup(token, name);
    return newOrg;
  }

  async function createOrgUserStorage(org: Organization) {
    // Add the OrgUserStorage to the DB
    const newOrgUserStorage = await DataStore.save(
      new OrgUserStorage({
        organization: org,
        type: UserOrStorage.USER,
        user: user!.attributes.sub,
        name: user!.attributes.name,
        image: "default",
        group: name,
      }),
    );
    if (newOrgUserStorage == null)
      throw new Error("OrgUserStorage not created successfully.");
    // add user to the user group
    await addUserToGroup(token, name, user!.attributes.sub);
  }

  // handle verification, creation, and navigation when creating a new Organization
  async function handleCreate() {
    try {
      setIsLoading(true);
      // Generate a random access code
      const code = await generateCode();
      // Create the org and orgUserStorage
      const newOrg = await createOrg(code);
      await createOrgUserStorage(newOrg);
      // use a key to keep track of currentOrg per user
      const key = user!.attributes.sub + " currOrg";
      await AsyncStorage.setItem(key, JSON.stringify(newOrg));
      setOrg(newOrg);
      onChangeName("");
      setIsLoading(false);
      navigation.navigate("SyncScreen", {
        syncType: "CREATE",
        accessCode: code,
      });
    } catch (error) {
      handleError("handleCreate", error as Error, setIsLoading);
    }
  }

  return (
    <View style={createJoinStyles.mainContainer}>
      <Text style={createJoinStyles.title}>Create Org</Text>
      <Text style={createJoinStyles.subtitle}>Create a name for your org</Text>
      <TextInput
        style={createJoinStyles.input}
        onChangeText={onChangeName}
        value={name}
        placeholder="Ex. Asayake Taiko"
        keyboardType="default"
      />
      <TouchableOpacity
        style={createJoinStyles.button}
        onPress={() => {
          handleCreate();
        }}
      >
        <Text style={createJoinStyles.btnText}>Create Org</Text>
      </TouchableOpacity>
    </View>
  );
}

export default CreateOrgScreen;
