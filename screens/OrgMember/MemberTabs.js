import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React, { useEffect, useState, useLayoutEffect} from 'react';
import { useIsFocused } from '@react-navigation/native';
import { BackHandler } from 'react-native';
import MyEquipmentScreen from './MyEquipment';
import SwapEquipmentScreen from './SwapEquipment';
import TeamEquipmentScreen from './TeamEquipment';
import ManagerScreen from './ManagerScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

// The navigator for a logged in member of an organization
const Tab = createMaterialTopTabNavigator();

function MemberTabs({navigation}) {
  const [currOrgName, setCurrOrgName] = React.useState('');
  const isFocused = useIsFocused();

  // Custom so thata back button press goes to the menu
  useEffect(() => {
    const backAction = () => {
      navigation.navigate('Menu');
    };

    // Add the backAction handler when the component mounts
    BackHandler.addEventListener('hardwareBackPress', backAction);
    // Remove the backAction handler when the component unmounts
    return () => BackHandler.removeEventListener('hardwareBackPress', backAction);
  }, [navigation]);

  useEffect(() => {
    if(isFocused){
      console.log('isFocused: ', isFocused);
      getCurrOrg();
    }
  }, [isFocused]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: currOrgName,
    });
  }, [navigation, currOrgName]);

  async function getCurrOrg() {
    try {
        const org = await AsyncStorage.getItem('currOrg');
        const orgJSON = JSON.parse(org);
        if(org == null){
            navigation.navigate('Home');
        }
        console.log('orgJSON: ', orgJSON.name);
        setCurrOrgName(orgJSON.name);
    } catch (error) {
        console.log('error getting current org: ', error);
    }
  }

  return (
    // tab navigator has the tab bar at the bottom of the screen
    <Tab.Navigator tabBarPosition='bottom'
    screenOptions={{
        tabBarLabelStyle: { fontSize: 10 },
      }}>
        <Tab.Screen name="My Equipment" component={MyEquipmentScreen} />
        <Tab.Screen name="Swap Equipment" component={SwapEquipmentScreen} />
        <Tab.Screen name="Team Equipment" component={TeamEquipmentScreen} />
        <Tab.Screen name="Manage Equpment" component={ManagerScreen} />
    </Tab.Navigator>
  );
};

export default MemberTabs;