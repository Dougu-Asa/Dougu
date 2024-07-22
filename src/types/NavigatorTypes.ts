import type { NavigatorScreenParams } from "@react-navigation/native";
import { DrawerNavigationProp } from "@react-navigation/drawer";

/* 
    Defines the types for the navigator objects used in the app.
*/

// Navigator types
export type RootStackParamList = {
  Home: undefined;
  DrawerNav: NavigatorScreenParams<DrawerParamList>;
  ManageEquipment: undefined;
  CreateEquipment: undefined;
  UserStorages: { tabParam: string };
  CreateStorage: undefined;
};

export type DrawerParamList = {
  MemberTabs: NavigatorScreenParams<TabParamList>;
  JoinOrg: undefined;
  CreateOrg: undefined;
  AccessCode: { accessCode: string };
  MyOrgs: undefined;
  JoinOrCreate: undefined;
};

export type TabParamList = {
  Equipment: undefined;
  Swap: undefined;
  Team: undefined;
  OrgInfo: undefined;
};

export interface MyHeaderProfileButtonProps {
  navigation: DrawerNavigationProp<DrawerParamList>; // use DrawerNavigationProp because we don't need route
}
