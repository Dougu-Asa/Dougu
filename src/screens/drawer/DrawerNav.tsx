import { createDrawerNavigator } from "@react-navigation/drawer";
import {
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
  BackHandler,
} from "react-native";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import { DataStore } from "@aws-amplify/datastore";

// project imports
import JoinOrgScreen from "./JoinOrgScreen";
import CreateOrgScreen from "./CreateOrgScreen";
import AccessCodeScreen from "./AccessCodeScreen";
import MyOrgsScreen from "./MyOrgsScreen";
import MemberTabs from "../member/MemberTabs";
import ProfileScreen from "./ProfileScreen";
import { OrgUserStorage, Organization } from "../../models";
import { useUser } from "../../helper/context/UserContext";
import { handleError } from "../../helper/Utils";
import {
  MyHeaderProfileButtonProps,
  DrawerParamList,
} from "../../types/NavigatorTypes";
import { DrawerNavProps } from "../../types/ScreenTypes";
import CustomDrawerContent from "../../components/drawer/CustomDrawerContent";
import { signOut } from "../../helper/Utils";
import { useLoad } from "../../helper/context/LoadingContext";

/* 
    DrawerNav is the main form of navigation for the app.
    It separates the groupings of what a user can navigate
    when logged in, and checks if the user is part of an org
    to direct them to the correct screen.
*/
export default function DrawerNav({ navigation }: DrawerNavProps) {
  const Drawer = createDrawerNavigator<DrawerParamList>();
  const isFocused = useIsFocused();
  const { user, setOrg, resetContext } = useUser();
  const { setIsLoading } = useLoad();

  // Override android backbutton by adding a listener
  // This prevents returning to home without signing out
  useEffect(() => {
    function backAction(): boolean {
      signOut(setIsLoading, navigation, resetContext);
      return true;
    }

    BackHandler.addEventListener("hardwareBackPress", backAction);
    return () =>
      BackHandler.removeEventListener("hardwareBackPress", backAction);
  }, [navigation, resetContext, setIsLoading]);

  // because users are first directed here on sign in, we check if they are part of an org
  useEffect(() => {
    // check if user is part of an org to automatically direct them to the correct screen
    const checkUserOrg = async () => {
      try {
        const key = user!.attributes.sub + " currOrg";
        const org = await AsyncStorage.getItem(key);
        // check if user has an orgUserStorage (from previous devices)
        const orgUserStorages = await DataStore.query(OrgUserStorage, (c) =>
          c.user.eq(user!.attributes.sub),
        );
        // check if there was a previous org session
        if (org != null) {
          const orgJSON = await JSON.parse(org);
          const orgData = await DataStore.query(Organization, orgJSON.id);
          if (orgData == null) {
            throw new Error("Organization not found");
          }
          setOrg(orgData);
          navigation.navigate("DrawerNav", {
            screen: "MemberTabs",
            params: {
              screen: "Equipment",
            },
          });
        } else if (orgUserStorages != null && orgUserStorages.length > 0) {
          navigation.navigate("DrawerNav", { screen: "MyOrgs" });
        } else {
          // user has no org and no previous org
          navigation.navigate("DrawerNav", { screen: "JoinOrg" });
        }
      } catch (error) {
        handleError("checkUserOrg", error as Error, null);
      }
    };

    if (isFocused) {
      checkUserOrg();
    }
  }, [isFocused, navigation, setOrg, user]);

  // ensure user isn't null
  if (!user) {
    Alert.alert(
      "Error",
      "User is null, please sign in again",
      [{ text: "OK" }],
      { cancelable: false },
    );
    navigation.navigate("Home");
    return null;
  }

  //Left profile icon
  function MyHeaderProfileButton({ navigation }: MyHeaderProfileButtonProps) {
    return (
      <TouchableOpacity
        style={styles.profile}
        onPress={() => navigation.toggleDrawer()}
      >
        <Image
          source={require("../../assets/userprofiles/miku.jpg")}
          style={styles.circleImage}
        />
      </TouchableOpacity>
    );
  }

  return (
    <Drawer.Navigator
      screenOptions={({ navigation }) => ({
        headerLeft: () => <MyHeaderProfileButton navigation={navigation} />,
        headerTitleAlign: "center",
        headerTitleStyle: {
          fontSize: 28,
          fontWeight: "bold",
          color: "#791111",
        },
        headerTitle: "Dougu",
        swipeEnabled: false,
      })}
      initialRouteName="MyOrgs"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="MemberTabs" component={MemberTabs} />
      <Drawer.Screen name="JoinOrg" component={JoinOrgScreen} />
      <Drawer.Screen name="CreateOrg" component={CreateOrgScreen} />
      <Drawer.Screen name="AccessCode" component={AccessCodeScreen} />
      <Drawer.Screen name="MyOrgs" component={MyOrgsScreen} />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  profile: {
    left: 20,
  },
  circleImage: {
    width: 45,
    height: 45,
    borderRadius: 35 / 2,
    padding: 5,
    left: 5,
  },
});
