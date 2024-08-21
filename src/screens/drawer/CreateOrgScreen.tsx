import { Text, View, TextInput, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import { DataStore } from "@aws-amplify/datastore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import { fetchAuthSession } from "aws-amplify/auth";

// project imports
import { createJoinStyles } from "../../styles/CreateJoinStyles";
import { useLoad } from "../../helper/context/LoadingContext";
import { Organization, OrgUserStorage, UserOrStorage } from "../../models";
import { useUser } from "../../helper/context/UserContext";
import { handleError } from "../../helper/Utils";
import { CreateOrgScreenProps } from "../../types/ScreenTypes";
import { createUserGroup, addUserToGroup } from "../../helper/AWS";
import { validateRequirements } from "../../helper/drawer/CreateOrgUtils";

/*
  Screen for creating an organization, user enters the name of the org
  and a random access code is generated. The user that creates the org is
  automatically the manager of the org.
*/
export default function CreateOrgScreen({ navigation }: CreateOrgScreenProps) {
  const { setIsLoading } = useLoad();
  const [name, onChangeName] = React.useState("");
  const { user } = useUser();
  var randomstring = require("randomstring");
  const [hasConnection, setHasConnection] = React.useState(false);

  // ensure network connection since api calls are made
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setHasConnection(state.isConnected!);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // generate codes and check if they are unique. If not, generate another
  const generateCode = async () => {
    while (true) {
      const code = randomstring.generate({
        length: 7,
        capitalization: "uppercase",
      });
      // Check that access code is unique
      const orgs = await DataStore.query(Organization, (c) =>
        c.accessCode.eq(code),
      );
      if (orgs == null || orgs.length === 0) {
        return code;
      } else {
        console.log("Code already exists, generating another...");
      }
    }
  };

  // create an org and orgUserStorage to add to the database
  const createOrg = async (
    token: string,
    code: string,
  ): Promise<Organization> => {
    // Add the org to the database
    const newOrg = await DataStore.save(
      new Organization({
        name: name,
        accessCode: code,
        manager: user!.id,
        image: "default",
      }),
    );
    if (newOrg == null)
      throw new Error("Organization not created successfully.");
    // create a user group for the org
    await createUserGroup(token, name);
    return newOrg;
  };

  const createOrgUserStorage = async (
    token: string,
    org: Organization,
  ): Promise<boolean> => {
    // Add the OrgUserStorage to the DB
    const newOrgUserStorage = await DataStore.save(
      new OrgUserStorage({
        organization: org,
        type: UserOrStorage.USER,
        user: user!.id,
        name: user!.name,
        group: name,
      }),
    );
    if (newOrgUserStorage == null)
      throw new Error("OrgUserStorage not created successfully.");
    // add user to the user group
    return await addUserToGroup(token, name, user!.id);
  };

  // handle verification, creation, and navigation when creating a new Organization
  const handleCreate = async () => {
    try {
      setIsLoading(true);
      // Generate a random access code
      const code = await generateCode();
      const validated = await validateRequirements(name, user!);
      if (!validated) {
        setIsLoading(false);
        return;
      }
      // Get the user token for authorization to api calls
      const token = (await fetchAuthSession()).tokens?.idToken?.toString();
      if (token == null) throw new Error("Token not found");
      // Create the org and orgUserStorage
      const newOrg = await createOrg(token, code);
      const success = await createOrgUserStorage(token, newOrg);
      if (!success) {
        throw new Error("User not added to group successfully");
      }
      // use a key to keep track of currentOrg per user
      const key = user!.id + " currOrg";
      await AsyncStorage.setItem(key, JSON.stringify(newOrg));
      onChangeName("");
      setIsLoading(false);
      navigation.navigate("SyncScreen", {
        syncType: "CREATE",
        accessCode: code,
        newOrg: newOrg,
      });
    } catch (error) {
      handleError("handleCreate", error as Error, setIsLoading);
    }
  };

  return (
    <View style={createJoinStyles.mainContainer}>
      {hasConnection ? (
        <View style={createJoinStyles.container}>
          <Text style={createJoinStyles.title}>Create Org</Text>
          <Text style={createJoinStyles.subtitle}>
            Create a name for your org.
          </Text>
          <Text style={createJoinStyles.subtitle}>
            Rule: 1-40 alphanumeric characters with no whitespaces (_ and - are
            allowed).
          </Text>
          <TextInput
            style={createJoinStyles.input}
            onChangeText={onChangeName}
            value={name}
            placeholder="Ex. Great_Org"
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
      ) : (
        <>
          <Text style={createJoinStyles.title}>No Connection</Text>
          <Text style={createJoinStyles.subtitle}>
            A connection is needed to Create an Org! Please check your internet
            connection and try again
          </Text>
        </>
      )}
    </View>
  );
}
