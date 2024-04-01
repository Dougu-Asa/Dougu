import { StatusBar } from 'expo-status-bar';
import { Button, Text, View, TextInput, createJoinStylesheet, TouchableOpacity, Alert } from 'react-native';
import React, {useEffect, useState} from 'react';
import { BackHandler } from 'react-native';
import { Auth } from 'aws-amplify';
import { DataStore } from '@aws-amplify/datastore';
import { Organization, User, OrgUserStorage, UserOrStorage } from '../src/models';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dimensions } from 'react-native'
import createJoinStyles from '../styles/CreateJoinStyles';
import { useLoad } from '../components/LoadingContext';

function CreateOrgScreen({navigation}) {
  const {setIsLoading} = useLoad();
  const [name, onChangeName] = React.useState('');
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

  var randomstring = require("randomstring");
  async function createOrg(){
    try {
      setIsLoading(true);
      const user = await Auth.currentAuthenticatedUser();
      if(user == null){
        throw new Error("User is not authenticated.");
      }
      const code = randomstring.generate({
        length: 7,
        capitalization: 'uppercase',
      });
      console.log("Org Code: " + code);
      // Check that access code and name are unique
      const orgs = await DataStore.query(Organization, (c) => c.or(c => [
        c.accessCode.eq(code),
        c.name.eq(name)
      ]));
      console.log('orgs: ', orgs);
      if(orgs && orgs.length > 0){
        throw new Error("Organization name or access code is not unique.");
      }
      // query for the user that is the org manager
      const DBuser = await DataStore.query(User, user.attributes.sub);
      console.log('DBuser: ', DBuser);
      if(DBuser == null) throw new Error("User not found in database.");
      // Add the org to the database
      const newOrg = await DataStore.save(
        new Organization({
          name: name,
          accessCode: code,
          manager: DBuser,
        })
      );
      if(newOrg == null) throw new Error("Organization not created successfully.");
      console.log('newOrg: ', newOrg);
      // Add the OrgUserStorage to the DB
      const newOrgUserStorage = await DataStore.save(
        new OrgUserStorage({
          organization: newOrg,
          type: UserOrStorage.USER,
          user: DBuser,
          name: DBuser.name,
        })
      );
      // query current org to be saved in async storage
      const currOrg = await DataStore.query(Organization, newOrg.id);
      console.log('newOrgUserStorage: ', newOrgUserStorage);
      // use a key to keep track of currentOrg per user
      const key = user.attributes.sub + ' currOrg';
      await AsyncStorage.setItem(key, JSON.stringify(currOrg));
      onChangeName('');
      setIsLoading(false);
      navigation.navigate('Access Code', {accessCode: code});
    }
    catch (e) {
      setIsLoading(false);
      // setup popups
      console.log(e);
      Alert.alert('Error!', e.message, [{text: 'OK'}]);
    }
  }

  return(
    <View style={createJoinStyles.mainContainer}>
      <Text style={createJoinStyles.title}>Create Org</Text>
      <Text style={createJoinStyles.subtitle}>Create a name for your org</Text>
      <TextInput
        style={createJoinStyles.input}
        onChangeText={onChangeName}
        value={name}
        placeholder="Ex. Asayake Taiko"
        keyboardType="default"
        />
      <TouchableOpacity style={createJoinStyles.button} onPress={() => {createOrg()}}>
        <Text style={createJoinStyles.btnText}>Create Org</Text>
      </TouchableOpacity>
  </View>
  );
}

export default CreateOrgScreen;