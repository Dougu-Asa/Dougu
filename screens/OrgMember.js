import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import MainStyle from '../styles/MainStyle';
import { useEffect } from 'react';
import { BackHandler } from 'react-native';

// The navigator for a logged in member of an organization
const Tab = createMaterialTopTabNavigator();

function MemberTabs({navigation}) {
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

  return (
    // tab navigator has the tab bar at the bottom of the screen
    <Tab.Navigator tabBarPosition='bottom'>
      <Tab.Screen name="My Equipment" component={MyEquipmentScreen} />
      <Tab.Screen name="Swap Equipment" component={SwapEquipmentScreen} />
      <Tab.Screen name="Team Equipment" component={TeamEquipmentScreen} />
    </Tab.Navigator>
  );
};

function MyEquipmentScreen(){
    return (
        <View style={MainStyle.container}>
            <Text>My Equipment!</Text>
            <StatusBar style="auto" />
        </View>
    );
};

function TeamEquipmentScreen(){
    return (
        <View style={MainStyle.container}>
            <Text>Team Equipment!</Text>
            <StatusBar style="auto" />
        </View>
    );
};

function SwapEquipmentScreen(){
    return (
        <View style={MainStyle.container}>
            <Text>Swap Equipment!</Text>
            <StatusBar style="auto" />
        </View>
    );
};

export default MemberTabs;