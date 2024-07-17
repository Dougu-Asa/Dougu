import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { NavigatorScreenParams } from '@react-navigation/native';
import { CompositeScreenProps } from '@react-navigation/native';
import { DrawerScreenProps, DrawerNavigationProp, DrawerContentComponentProps } from '@react-navigation/drawer';
import { Dispatch, SetStateAction } from 'react';
import { OrgUserStorage } from './models';

/* 
    This file defines the types used in the application.
*/

// userContext types
export type OrgType = {
    name: string;
    id: string;
    [key: string]: any; // Allows any other properties
};

export type UserType = {
    attributes: {
        sub: string;
        name: string;
        [key: string]: any; 
    };
    [key: string]: any; 
};

export type UserContextType = {
    user: UserType | null;
    setUser: Dispatch<SetStateAction<UserType | null>>;
    org: OrgType | null;
    setOrg: Dispatch<SetStateAction<OrgType | null>>;
    orgUserStorage: OrgUserStorage | null;
    resetContext: () => void;       // doesn't take a param, doesn't return anything
};


// loadingContext types
export type LoadingContextType = {
    isLoading: boolean;
    setIsLoading: Dispatch<SetStateAction<boolean>>;
};


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


// Navigator props per screen
export type JoinOrgScreenProps = CompositeScreenProps<
    DrawerScreenProps<DrawerParamList, 'JoinOrg'>,
    NativeStackScreenProps<RootStackParamList>>;

export type DrawerNavProps = NativeStackScreenProps<RootStackParamList, 'DrawerNav'>;

export interface MyHeaderProfileButtonProps {
    navigation: DrawerNavigationProp<DrawerParamList>;      // use DrawerNavigationProp because we don't need route
}
