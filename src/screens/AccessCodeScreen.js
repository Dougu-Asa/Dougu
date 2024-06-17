import { Text, View, TouchableOpacity} from 'react-native';
import React, {useEffect} from 'react';
import { BackHandler } from 'react-native';

import createJoinStyles from '../styles/CreateJoinStyles';

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
    <View style={createJoinStyles.mainContainer}>
      <Text style={createJoinStyles.title}>Access Code!</Text>
      <Text style={createJoinStyles.accessCode}>{accessCode}</Text>
      <Text style={createJoinStyles.subtitle}>Give this code to your members so they can join your organization!</Text>
      <TouchableOpacity 
      onPress={() => navigation.navigate('DrawerNav', {screen: 'MyOrgs'})}
      style={createJoinStyles.button}>
        <Text style={createJoinStyles.btnText}>Start Managing!</Text>
      </TouchableOpacity>
    </View>
  );
}

export default AccessCodeScreen;