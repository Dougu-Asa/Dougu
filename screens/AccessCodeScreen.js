import { StatusBar } from 'expo-status-bar';
import { Text, View, Button } from 'react-native';
import MainStyle from '../styles/MainStyle';
import React, {useEffect} from 'react';
import { BackHandler } from 'react-native';
import ProfileComponent from '../components/ProfileComponent';

function AccessCodeScreen({route, navigation}) {
  const {accessCode} = route.params;
  // Custom so thata back button press goes to the menu
  useEffect(() => {
    console.log('accessCode: ', accessCode);
    const backAction = () => {
      navigation.navigate('Menu');
      return true;
    };

    // Add the backAction handler when the component mounts
    BackHandler.addEventListener('hardwareBackPress', backAction);
    // Remove the backAction handler when the component unmounts
    return () => BackHandler.removeEventListener('hardwareBackPress', backAction);
  }, [navigation]);

  return(
    <View style={MainStyle.container}>
      <ProfileComponent />
      <Text>Access Code!</Text>
      <Text>{accessCode}</Text>
      <Text>Give this code to your members so they can join your organization!</Text>
      <Button
          title="Start Managing!"
          onPress={() => navigation.navigate('MemberTabs', {screen: 'My Equipment'})}
      />
      <StatusBar style="auto" />
    </View>
  );
}

export default AccessCodeScreen;