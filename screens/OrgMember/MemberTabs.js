import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React, { useEffect, useState, useLayoutEffect} from 'react';
import { useIsFocused } from '@react-navigation/native';
import { BackHandler } from 'react-native';
import EquipmentScreen from './Equipment';
import SwapEquipmentScreen from './SwapEquipment';
import TeamEquipmentScreen from './TeamEquipment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesone5 from 'react-native-vector-icons/FontAwesome5';
import Entypo from 'react-native-vector-icons/Entypo';

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
          // navigate to joinOrg with a false prop
          navigation.navigate('JoinOrg');
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
    }}>
        <Tab.Screen name="Equipment" component={EquipmentScreen} 
        options={{
          tabBarIcon: () => (
            <FontAwesone5 name="home" color={'black'} size={20} />
          ),
        }}/>
        <Tab.Screen name="Swap" component={SwapEquipmentScreen} 
        options={{
          tabBarIcon: () => (
            <Entypo name="cycle" color={'black'} size={20} />
          ),
        }}/>
        <Tab.Screen name="Team" component={TeamEquipmentScreen} 
        options={{
          tabBarIcon: () => (
            <FontAwesone5 name="users" color={'black'} size={19} />
          ),
        }}/>
    </Tab.Navigator>
  );
};

export default MemberTabs;