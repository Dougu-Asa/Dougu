import { DataStore } from "@aws-amplify/datastore";
import { Alert } from "react-native";
import { OrgUserStorage, Equipment, Container, UserOrStorage } from "../models";
import { Organization } from "../models";
import { addUserToGroup, createUserGroup } from "./AWS";
import { UserType } from "../types/ContextTypes";
import { Hex } from "../types/ModelTypes";

/*
  This file contains all the utility functions for creating new objects in the
  database. There are three main types:
  1. Create an organization
  2. Create a user group
  3. Create equipment or containers
*/

// create an org and orgUserStorage to add to the database
export const createOrg = async (
  token: string,
  name: string,
  code: string,
  userId: string,
): Promise<Organization> => {
  // Add the org to the database
  const newOrg = await DataStore.save(
    new Organization({
      name: name,
      accessCode: code,
      manager: userId,
      image: "default",
    }),
  );
  if (newOrg == null) throw new Error("Organization not created successfully.");
  // create a user group for the org
  await createUserGroup(token, name);
  return newOrg;
};

export const createOrgUserStorage = async (
  token: string,
  org: Organization,
  user: UserType,
): Promise<boolean> => {
  // Add the OrgUserStorage to the DB
  const newOrgUserStorage = await DataStore.save(
    new OrgUserStorage({
      organization: org,
      type: UserOrStorage.USER,
      user: user!.id,
      name: user!.name,
      group: org.name,
    }),
  );
  if (newOrgUserStorage == null)
    throw new Error("OrgUserStorage not created successfully.");
  // add user to the user group
  return await addUserToGroup(token, org.name, user!.id);
};

export const CreateEquipment = async (
  quantityCount: number,
  name: string,
  dataOrg: Organization,
  orgUserStorage: OrgUserStorage,
  details: string,
  color: Hex,
) => {
  // create however many equipment specified by quantity
  for (let i = 0; i < quantityCount; i++) {
    await DataStore.save(
      new Equipment({
        name: name,
        organization: dataOrg,
        lastUpdatedDate: new Date().toISOString(),
        assignedTo: orgUserStorage,
        details: details,
        image: "default",
        color: color,
        group: dataOrg.name,
        containerId: null,
      }),
    );
  }
  Alert.alert("Equipment created successfully!");
};

export const CreateContainer = async (
  quantityCount: number,
  name: string,
  dataOrg: Organization,
  orgUserStorage: OrgUserStorage,
  details: string,
) => {
  console.log("quantityCount: ", quantityCount);
  for (let i = 0; i < quantityCount; i++) {
    await DataStore.save(
      new Container({
        name: name,
        organization: dataOrg,
        lastUpdatedDate: new Date().toISOString(),
        assignedTo: orgUserStorage,
        details: details,
        color: "#ffffff",
        group: dataOrg.name,
      }),
    );
  }
  Alert.alert("Container created successfully!");
};
