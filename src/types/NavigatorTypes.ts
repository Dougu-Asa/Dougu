import type { NavigatorScreenParams } from "@react-navigation/native";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { Organization } from "../models";

/* 
    Defines the types for the navigator objects used in the app.
*/

// Navigator types
export type RootStackParamList = {
  Home: undefined;
  SyncScreen: {
    syncType: "START" | "CREATE" | "JOIN";
    accessCode?: string;
    newOrg?: Organization;
  };
  RequestReset: undefined;
  ResetPassword: { email: string };
  DrawerNav: NavigatorScreenParams<DrawerParamList>;
};

export type DrawerParamList = {
  MemberTabs: NavigatorScreenParams<TabParamList>;
  JoinOrg: undefined;
  CreateOrg: undefined;
  AccessCode: { accessCode: string };
  MyOrgs: undefined;
  Profile: undefined;
};

export type TabParamList = {
  Equipment: undefined;
  Swap: undefined;
  Team: undefined;
  OrgInfo: NavigatorScreenParams<OrgStackParamList>;
};

export type OrgStackParamList = {
  InfoScreen: undefined;
  ManageEquipment: undefined;
  CreateEquipment: undefined;
  UserStorages: { tabParam: string };
  CreateStorage: undefined;
};

export interface MyHeaderProfileButtonProps {
  navigation: DrawerNavigationProp<DrawerParamList>; // use DrawerNavigationProp because we don't need route
}
