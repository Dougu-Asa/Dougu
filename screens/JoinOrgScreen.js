import { StatusBar } from 'expo-status-bar';
import { Text, View, Button, TextInput, createJoinStylesheet, Alert } from 'react-native';
import React, {useEffect, useState} from 'react';
import { BackHandler } from 'react-native';
import { OrgUserStorage, Organization, User, UserOrStorage } from '../src/models';
import { DataStore } from '@aws-amplify/datastore';
import { Auth } from 'aws-amplify';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from 'react-native-gesture-handler';
import createJoinStyles from '../styles/CreateJoinStyles';
import { useLoad } from '../components/LoadingContext';

function JoinOrgScreen({navigation}) {
  const {setIsLoading} = useLoad();
  const [code, onChangeCode] = React.useState('');
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

  async function joinOrg(){
    try{
      // Query for the org with the access code
      setIsLoading(true);
      const org = await DataStore.query(Organization, (c) => c.accessCode.eq(code.toUpperCase()));
      if(org.length <= 0){
        throw new Error("Organization does not exist!");
      }
      else if(org.length > 1){
        throw new Error("Multiple organizations with the same code!");
      }
      // if the user is already part of that org, throw an error
      const user = await Auth.currentAuthenticatedUser();
      const exist = await DataStore.query(OrgUserStorage, (c) => c.and(c => [
        c.organization.id.eq(org[0].id),
        c.user.userId.eq(user.attributes.sub)
      ]));
      if(exist.length > 0){
        throw new Error("User is already part of this organization!");
      }
      // If the org exists, create an OrgUserStorage object
      const DBuser = await DataStore.query(User, user.attributes.sub);
      if(DBuser == null) throw new Error("User does not exist!");
      const newOrgUserStorage = await DataStore.save(
        new OrgUserStorage({
          organization: org[0],
          type: UserOrStorage.USER,
          user: DBuser,
          name: DBuser.name,
        })
      );
      // get the current org after being updated
      const currOrg = await DataStore.query(Organization, (c) => c.id.eq(org[0].id));
      // add our OrgUserStorage to the user and organization
      // save the currOrg and newOrgUserStorage to async storage
      const key = user.attributes.sub + ' currOrg';
      await AsyncStorage.setItem(key, JSON.stringify(currOrg));
      setIsLoading(false);
      navigation.navigate('DrawerNav', {screen: 'MyOrgs'});
    }
    catch(e){
      setIsLoading(false);
      console.log(e);
      Alert.alert('Error!', e.message, [{text: 'OK'}]);
    }
  }

  return(
    <View style={createJoinStyles.mainContainer}>
      <Text style={createJoinStyles.title}>Join Org</Text>
      <Text style={createJoinStyles.subtitle}>Enter the access code provided by the organization manager</Text>
      <TextInput
        style={createJoinStyles.input}
        onChangeText={onChangeCode}
        value={code}
        placeholder="Ex. ABC1234"
        keyboardType="default"
      />
      <TouchableOpacity style={createJoinStyles.button} onPress={() => {joinOrg()}}>
        <Text style={createJoinStyles.btnText}>Join My Org</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
}

export default JoinOrgScreen;