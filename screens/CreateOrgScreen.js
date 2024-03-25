import { StatusBar } from 'expo-status-bar';
import { Button, Text, View, TextInput, StyleSheet } from 'react-native';
import MainStyle from '../styles/MainStyle';
import React, {useEffect, useState} from 'react';
import { BackHandler } from 'react-native';
import ProfileComponent from '../components/ProfileComponent';
import PopupModal from '../components/PopupModal';
import { Auth } from 'aws-amplify';
import { DataStore } from '@aws-amplify/datastore';
import { Organization, User, OrgUserStorage, UserOrStorage } from '../src/models';

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
  [modalText, setModalText] = React.useState('');
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
      const DBuser = await DataStore.query(User, (c) => c.userId.eq(user.attributes.sub));
      console.log('DBUser: ', DBuser[0]);
      // Add the org to the database
      const newOrg = await DataStore.save(
        new Organization({
          name: name,
          accessCode: code,
          manager: DBuser[0],
        })
      );
      console.log('newOrg: ', newOrg);
      // Add the OrgUserStorage to the DB
      const newOrgUserStorage = await DataStore.save(
        new OrgUserStorage({
          organization: newOrg,
          type: UserOrStorage.USER,
          user: DBuser[0],
        })
      );
      console.log('newOrgUserStorage: ', newOrgUserStorage);
      // add our OrgUserStorage to the user and organization
      await DataStore.save(
        User.copyOf(DBuser[0], updated => {
          updated.organizations = newOrgUserStorage;
        })
      );
      await DataStore.save(
        Organization.copyOf(newOrg, updated => {
          updated.UserOrStorages = newOrgUserStorage;
        })
      );
      navigation.navigate('Access Code', {accessCode: code});
    }
    catch (e) {
      // setup popups
      console.log(e);
      setModalText(e.toString());
      setModalVisible(true);
    }
  }

  return(
    <View style={MainStyle.container}>
      <ProfileComponent />
      <PopupModal modalVisible={modalVisible} setModalVisible={setModalVisible} text={modalText}/>
      <Text>Create an Org!</Text>
      <TextInput
      style={styles.input}
      onChangeText={onChangeName}
      value={name}
      placeholder="Org Name"
      keyboardType="default"
      />
      <Button title="Create Org!" onPress={createOrg} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});

export default CreateOrgScreen;