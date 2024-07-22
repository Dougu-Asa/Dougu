import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import React, { useEffect, useState, useLayoutEffect } from "react";
import { useIsFocused } from "@react-navigation/native";
import FontAwesone5 from "react-native-vector-icons/FontAwesome5";
import Entypo from "react-native-vector-icons/Entypo";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Alert } from "react-native";

// project imports
import InfoScreen from "../organization/InfoScreen";
import EquipmentScreen from "./Equipment";
import SwapEquipmentScreen from "./SwapEquipment";
import TeamEquipmentScreen from "./TeamEquipment";
import { useUser } from "../../helper/UserContext";
import { MemberTabsScreenProps } from "../../types/ScreenTypes";
import SpinningIndicator from "../../components/SpinningIndicator";
import { TabParamList } from "../../types/NavigatorTypes";

// The navigator for a logged in member of an organization
const Tab = createMaterialTopTabNavigator<TabParamList>();

function MemberTabs({ navigation }: MemberTabsScreenProps) {
  const [currOrgName, setCurrOrgName] = useState("");
  const [isManager, setIsManager] = useState(false);
  const isFocused = useIsFocused();
  const { user, org, orgUserStorage, contextLoading, resetContext } = useUser();

  // set the header title and right icon, a crown is shown if the user is the manager
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: currOrgName,
      headerRight: () => {
        if (isManager) {
          return (
            <MaterialCommunityIcons
              name="crown"
              color={"#791111"}
              size={35}
              style={{ padding: 5 }}
            />
          );
        } else return null;
      },
    });
  }, [navigation, currOrgName, isManager]);

  // check if the user is the manager of the organization
  // after verifying the user, org, and orgUserStorage are not null
  useEffect(() => {
    async function checkUserOrg() {
      if (!contextLoading && (!user || !org || !orgUserStorage)) {
        Alert.alert("Error", "User, org, or orgUserStorage is null.");
        navigation.navigate("Home");
        resetContext();
        return;
      }
      setCurrOrgName(org!.name);
      if (org!.organizationManagerUserId === user!.attributes.sub) {
        setIsManager(true);
      }
    }

    if (isFocused) checkUserOrg();
  }, [
    org,
    user,
    isFocused,
    orgUserStorage,
    navigation,
    resetContext,
    contextLoading,
  ]);

  if (contextLoading) {
    return <SpinningIndicator />;
  }

  return (
    // tab navigator has the tab bar at the bottom of the screen
    <Tab.Navigator
      tabBarPosition="bottom"
      initialRouteName="OrgInfo"
      screenOptions={{
        tabBarLabelStyle: {
          fontSize: 9,
        },
        tabBarStyle: {
          height: 70,
          paddingTop: 5,
        },
        tabBarIconStyle: {
          marginTop: -5,
        },
        tabBarShowIcon: true,
        swipeEnabled: false,
      }}
    >
      <Tab.Screen
        name="Equipment"
        component={EquipmentScreen}
        options={{
          tabBarIcon: () => (
            <FontAwesone5 name="home" color={"black"} size={20} />
          ),
        }}
      />
      <Tab.Screen
        name="Swap"
        component={SwapEquipmentScreen}
        options={{
          tabBarIcon: () => <Entypo name="cycle" color={"black"} size={20} />,
        }}
      />
      <Tab.Screen
        name="Team"
        component={TeamEquipmentScreen}
        options={{
          tabBarIcon: () => (
            <FontAwesone5 name="users" color={"black"} size={19} />
          ),
        }}
      />
      <Tab.Screen
        name="OrgInfo"
        component={InfoScreen}
        options={{
          tabBarIcon: () => (
            <MaterialCommunityIcons name="crown" color={"black"} size={21} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default MemberTabs;
