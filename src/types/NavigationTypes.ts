import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { NavigatorScreenParams } from '@react-navigation/native';
import { CompositeScreenProps } from '@react-navigation/native';
import { DrawerScreenProps, DrawerNavigationProp } from '@react-navigation/drawer';

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
