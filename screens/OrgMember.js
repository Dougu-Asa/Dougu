import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useEffect, useLayoutEffect } from 'react';
import { BackHandler } from 'react-native';
import MyEquipmentScreen from './OrgMember/MyEquipment';
import SwapEquipmentScreen from './OrgMember/SwapEquipment';
import TeamEquipmentScreen from './OrgMember/TeamEquipment';
import ManagerScreen from './OrgMember/ManagerScreen';
import { useUserOrg } from '../components/UserOrgProvider';

// The navigator for a logged in member of an organization
const Tab = createMaterialTopTabNavigator();

function MemberTabs({navigation}) {
    const { currOrg } = useUserOrg();

    // Custom so thata back button press goes to the menu
    useEffect(() => {
    const backAction = () => {
      navigation.navigate('Menu');
      return true;
    };

    // Add the backAction handler when the component mounts
    BackHandler.addEventListener('hardwareBackPress', backAction);
    // Remove the backAction handler when the component unmounts
    return () => BackHandler.removeEventListener('hardwareBackPress', backAction);
  }, [navigation]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: currOrg.name, // Set your dynamic title here
    });
  }, [navigation]);

  return (
    // tab navigator has the tab bar at the bottom of the screen
    <Tab.Navigator tabBarPosition='bottom'
    screenOptions={{
        tabBarLabelStyle: { fontSize: 10 },
        tabBarStyle: { backgroundColor: 'powderblue' },
      }}>
        <Tab.Screen name="My Equipment" component={MyEquipmentScreen} />
        <Tab.Screen name="Swap Equipment" component={SwapEquipmentScreen} />
        <Tab.Screen name="Team Equipment" component={TeamEquipmentScreen} />
        <Tab.Screen name="Manage Equpment" component={ManagerScreen} />
    </Tab.Navigator>
  );
};

export default MemberTabs;