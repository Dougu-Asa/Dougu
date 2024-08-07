import { Text, View, TextInput } from "react-native";
import React, { useEffect } from "react";
import { DataStore } from "@aws-amplify/datastore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TouchableOpacity } from "react-native-gesture-handler";
import NetInfo from "@react-native-community/netinfo";

// project imports
import { createJoinStyles } from "../../styles/CreateJoinStyles";
import { useLoad } from "../../helper/LoadingContext";
import { OrgUserStorage, Organization, UserOrStorage } from "../../models";
import { useUser } from "../../helper/UserContext";
import { handleError } from "../../helper/Utils";
import { JoinOrgScreenProps } from "../../types/ScreenTypes";
import { addUserToGroup } from "../../helper/AWS";
/*
  Screen for joining an organization, user enters the access code to join
*/
export default function JoinOrgScreen({ navigation }: JoinOrgScreenProps) {
  const { setIsLoading } = useLoad();
  const [code, onChangeCode] = React.useState("");
  const { user } = useUser();
  const token = user!.signInUserSession.idToken.jwtToken;
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

  // ensure the code given is valid and the user is not already part of the org
  const checkCode = async () => {
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
        c.user.eq(user!.attributes.sub),
      ]),
    );
    if (exist.length > 0) {
      throw new Error("User is already part of this organization!");
    }
    return org[0];
  };

  // if a user is part of more than 5 orgs, datastore begins to error
  const validate = async () => {
    const userOrgs = await DataStore.query(OrgUserStorage, (c) =>
      c.user.eq(user!.attributes.sub),
    );
    if (userOrgs.length >= 5) {
      throw new Error("User cannot be part of more than 5 organizations!");
    }
  };

  // create an orgUserStorage object for the user and the org
  const createOrgUserStorage = async (org: Organization) => {
    await DataStore.save(
      new OrgUserStorage({
        organization: org,
        type: UserOrStorage.USER,
        name: user!.attributes.name,
        image: "default",
        group: org.name,
        user: user!.attributes.sub,
      }),
    );
    // add the user to the user group
    await addUserToGroup(token, org.name, user!.attributes.sub);
  };

  const handleJoin = async () => {
    try {
      // Query for the org with the access code
      setIsLoading(true);
      const org = await checkCode();
      await validate();
      // Create an OrgUserStorage object for the user
      await createOrgUserStorage(org);
      // update context and async storage
      const key = user!.attributes.sub + " currOrg";
      await AsyncStorage.setItem(key, JSON.stringify(org));
      setIsLoading(false);
      onChangeCode("");
      navigation.navigate("SyncScreen", { syncType: "JOIN", newOrg: org });
    } catch (error) {
      handleError("joinOrg", error as Error, setIsLoading);
    }
  };

  return (
    <View style={createJoinStyles.mainContainer}>
      {hasConnection ? (
        <View style={createJoinStyles.container}>
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
            onPress={handleJoin}
          >
            <Text style={createJoinStyles.btnText}>Join My Org</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <Text style={createJoinStyles.title}>No Connection</Text>
          <Text style={createJoinStyles.subtitle}>
            A connection is needed to join an Org! Please check your internet
            connection and try again
          </Text>
        </>
      )}
    </View>
  );
}