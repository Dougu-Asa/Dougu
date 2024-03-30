import { StatusBar } from 'expo-status-bar';
import { Button, Text, View, TextInput, createJoinStylesheet, TouchableOpacity } from 'react-native';
import React, {useEffect, useState} from 'react';
import { BackHandler } from 'react-native';
import PopupModal from '../components/PopupModal';
import { Auth } from 'aws-amplify';
import { DataStore } from '@aws-amplify/datastore';
import { Organization, User, OrgUserStorage, UserOrStorage } from '../src/models';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dimensions } from 'react-native'
import createJoinStyles from '../styles/CreateJoinStyles';

function CreateOrgScreen({navigation}) {
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
  [modalVisible, setModalVisible] = React.useState(false);
  [errorMsg, setErrorMsg] = React.useState('');
  async function createOrg(){
    try {
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
      // Add the org to the database
      const newOrg = await DataStore.save(
        new Organization({
          name: name,
          accessCode: code,
          manager: DBuser,
        })
      );
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
      console.log('newOrgUserStorage: ', newOrgUserStorage);
      // add our OrgUserStorage to the user and organization
      await DataStore.save(
        User.copyOf(DBuser, updated => {
          updated.organizations = newOrgUserStorage;
        })
      );
      const currOrg = await DataStore.save(
        Organization.copyOf(newOrg, updated => {
          updated.UserOrStorages = newOrgUserStorage;
        })
      );
      // save the currOrg to async storage
      // use a key to keep track of currentOrg per user
      const key = user.attributes.sub + ' currOrg';
      await AsyncStorage.setItem(key, JSON.stringify(currOrg));
      onChangeName('');
      navigation.navigate('Access Code', {accessCode: code});
    }
    catch (e) {
      // setup popups
      console.log(e);
      setErrorMsg(e.toString());
      setModalVisible(true);
    }
  }

  return(
    <View style={createJoinStyles.mainContainer}>
      <PopupModal modalVisible={modalVisible} setModalVisible={setModalVisible} text={errorMsg}/>
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