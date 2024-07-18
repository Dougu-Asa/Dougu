import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import React, { useEffect, useState, useLayoutEffect } from "react";
import { useIsFocused } from "@react-navigation/native";
import { BackHandler } from "react-native";
import FontAwesone5 from "react-native-vector-icons/FontAwesome5";
import Entypo from "react-native-vector-icons/Entypo";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Auth } from "aws-amplify";
import AsyncStorage from "@react-native-async-storage/async-storage";

// project imports
import InfoScreen from "../organization/InfoScreen";
import EquipmentScreen from "./Equipment";
import SwapEquipmentScreen from "./SwapEquipment";
import TeamEquipmentScreen from "./TeamEquipment";

// The navigator for a logged in member of an organization
const Tab = createMaterialTopTabNavigator();

function MemberTabs({ navigation }) {
  const [currOrgName, setCurrOrgName] = React.useState("");
  const [isManager, setIsManager] = React.useState(false);
  const isFocused = useIsFocused();

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
        } else return <></>;
      },
    });
  }, [navigation, currOrgName, isManager]);

  useEffect(() => {
    if (isFocused) {
      checkUserOrg();
    }
  }, [isFocused]);

  async function checkUserOrg() {
    setIsManager(false);
    const user = await Auth.currentAuthenticatedUser();
    const key = user.attributes.sub + " currOrg";
    const org = await AsyncStorage.getItem(key);
    if (org == null) {
      navigation.navigate("JoinOrCreate");
      return;
    }
    const orgJSON = JSON.parse(org);
    setCurrOrgName(orgJSON.name);
    //organizationManagerUserId
    if (orgJSON.organizationManagerUserId == user.attributes.sub) {
      setIsManager(true);
    }
  }

  return (
    // tab navigator has the tab bar at the bottom of the screen
    <Tab.Navigator
      tabBarPosition="bottom"
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
