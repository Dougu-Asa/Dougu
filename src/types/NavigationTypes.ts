import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import type { NavigatorScreenParams } from '@react-navigation/native';
import { CompositeScreenProps } from '@react-navigation/native';
import { DrawerScreenProps, DrawerNavigationProp } from '@react-navigation/drawer';
import type { NavigationProp } from '@react-navigation/core';

/* 
    Defines the types for the navigation objects used in the app.
    For both navigators and screens
*/

// Navigator types
export type RootStackParamList = {
    Home: undefined;
    DrawerNav: NavigatorScreenParams<DrawerParamList>;
    ManageEquipment: {isManager: boolean};
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
    navigation: DrawerNavigationProp<DrawerParamList>;      // use DrawerNavigationProp because we don't need route
}


// Types for navigator screen props
export type DrawerNavProps = NativeStackScreenProps<RootStackParamList, 'DrawerNav'>;

export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

export type NavigationOnlyProps = {                 // for CreateAcc and Login
    navigation: NavigationProp<RootStackParamList>;
};

export type JoinOrgScreenProps = CompositeScreenProps<
    DrawerScreenProps<DrawerParamList, 'JoinOrg'>,
    NativeStackScreenProps<RootStackParamList>>;