import type { NavigationProp } from "@react-navigation/core";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  DrawerScreenProps,
  DrawerNavigationProp,
} from "@react-navigation/drawer";
import type { CompositeScreenProps } from "@react-navigation/native";
import { MaterialTopTabScreenProps } from "@react-navigation/material-top-tabs";

import {
  RootStackParamList,
  DrawerParamList,
  TabParamList,
} from "./NavigatorTypes";

/*
    Defines the types for the screen props used in the app.
    Basically, one type for each screen that is used.
*/

// Types for navigator screen props
export type DrawerNavProps = NativeStackScreenProps<
  RootStackParamList,
  "DrawerNav"
>;

export type HomeScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Home"
>;

// for CreateAcc and Login screens
export type NavigationOnlyProps = {
  navigation: NavigationProp<RootStackParamList>;
};

// drawer screen types
export type JoinOrgScreenProps = {
  navigation: DrawerNavigationProp<DrawerParamList, "JoinOrg">;
};

export type CreateOrgScreenProps = {
  navigation: DrawerNavigationProp<DrawerParamList, "CreateOrg">;
};

export type JoinOrCreateScreenProps = DrawerScreenProps<
  DrawerParamList,
  "JoinOrCreate"
>;

export type AccessCodeScreenProps = DrawerScreenProps<
  DrawerParamList,
  "AccessCode"
>;

export type MyOrgsScreenProps = DrawerScreenProps<DrawerParamList, "MyOrgs">;

// use compositeScreenProps if you need to access screens from multiple navigators
export type MemberTabsScreenProps = CompositeScreenProps<
  DrawerScreenProps<DrawerParamList, "MemberTabs">,
  NativeStackScreenProps<RootStackParamList>
>;

// organization directory types
export type InfoScreenProps = CompositeScreenProps<
  MaterialTopTabScreenProps<TabParamList, "OrgInfo">,
  CompositeScreenProps<
    DrawerScreenProps<DrawerParamList>,
    NativeStackScreenProps<RootStackParamList>
  >
>;

export type ManageEquipmentScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "ManageEquipment"
>;

export type UserStoragesScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "UserStorages"
>;
