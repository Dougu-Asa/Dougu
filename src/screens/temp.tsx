import { DataStore } from "aws-amplify";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useLoad } from "../helper/LoadingContext";
import LoadingPage from "../components/LoadingPage";
import { Button } from "@rneui/base";
import {
  Organization,
  OrgUserStorage,
  Equipment,
  Container,
  UserOrStorage,
} from "../models";
import { useUser } from "../helper/UserContext";
import { signOut } from "../helper/Utils";

function Temp({navigation}) {
  const { dataStoreReady, setIsLoading } = useLoad();
  const { user, setOrg, org, orgUserStorage, resetContext } = useUser();
  const name = "Temp2";

  useEffect(() => {
    DataStore.start();
  }, []);

  const createOrganization = async () => {
    const newOrg = await DataStore.save(
      new Organization({
        name: name,
        accessCode: "Temple8",
        manager: user!.attributes.sub,
        image: "default",
      }),
    );

    const newOrgUserStorage = await DataStore.save(
      new OrgUserStorage({
        organization: newOrg,
        type: UserOrStorage.USER,
        user: user!.attributes.sub,
        name: user!.attributes.name,
        image: "default",
        group: name,
      }),
    );

    console.log(newOrg);
    console.log(newOrgUserStorage);
    setOrg(newOrg);
    AsyncStorage.setItem("asyncOrg", JSON.stringify(newOrg));
  };

  const handleGet = async () => {
    const org = await AsyncStorage.getItem("asyncOrg");
    setOrg(JSON.parse(org!));
  };

  const CreateEquipment = async () => {
    const equipment = await DataStore.save(
      new Equipment({
        name: "Random Equipment",
        organization: org!,
        lastUpdatedDate: new Date().toISOString(),
        assignedTo: orgUserStorage!,
        details: "idc",
        image: "default",
        group: org!.name,
      }),
    );
    console.log(equipment);
  };

  const queryOrganizations = async () => {
    const orgs = await DataStore.query(Organization);
    console.log(orgs);
  };

  const queryOrgUserStorage = async () => {
    const orgUserStorages = await DataStore.query(OrgUserStorage);
    console.log(orgUserStorages);
  };

  const queryEquipment = async () => {
    const equipment = await DataStore.query(Equipment);
    console.log(equipment);
  };

  const queryContainer = async () => {
    const containers = await DataStore.query(Container);
    console.log(containers);
  };

  if (!dataStoreReady) {
    return <LoadingPage />;
  }
  return (
    <View>
      <Button onPress={createOrganization}>Create Organization!</Button>
      <Button onPress={CreateEquipment}>Create Equipment!</Button>
      <Button onPress={() => handleGet()}>Get Async Org</Button>
      <Button onPress={queryOrganizations}>Query Organizations!</Button>
      <Button onPress={queryOrgUserStorage}>Query OrgUserStorage!</Button>
      <Button onPress={queryEquipment}>Query Equipment!</Button>
      <Button onPress={queryContainer}>Query Containers!</Button>
      <Button onPress={() => signOut(setIsLoading, navigation, resetContext)}>
        Sign Out!
      </Button>
    </View>
  );
}

export default Temp;
