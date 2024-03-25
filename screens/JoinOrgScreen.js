import { StatusBar } from 'expo-status-bar';
import { Text, View, Button, TextInput, StyleSheet } from 'react-native';
import MainStyle from '../styles/MainStyle';
import React, {useEffect, useState} from 'react';
import { BackHandler } from 'react-native';
import ProfileComponent from '../components/ProfileComponent';
import PopupModal from '../components/PopupModal';
import { OrgUserStorage, Organization, User, UserOrStorage } from '../src/models';
import { DataStore } from '@aws-amplify/datastore';
import { Auth } from 'aws-amplify';

function JoinOrgScreen({navigation}) {
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

  // popup modal
  const [modalVisible, setModalVisible] = useState(false);
  const [errorMsg, setErrorMsg] = useState('Error!');
  async function joinOrg(){
    try{
      console.log("Joining Org");
      // Query for the org with the access code
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
      const DBuser = await DataStore.query(User, (c) => c.userId.eq(user.attributes.sub));
      console.log('DBUser: ', DBuser[0]);
      const newOrgUserStorage = await DataStore.save(
        new OrgUserStorage({
          organization: org[0],
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
      const temp = await DataStore.save(
        Organization.copyOf(org[0], updated => {
          updated.UserOrStorages = newOrgUserStorage;
        })
      );
      console.log('temp: ', temp);
      navigation.navigate('MemberTabs', {screen: 'My Equipment'})
    }
    catch(e){
      console.log(e);
      setErrorMsg(e.toString());
      setModalVisible(true);
    }
  }

  return(
    <View style={MainStyle.container}>
      <ProfileComponent />
      <PopupModal modalVisible={modalVisible} setModalVisible={setModalVisible} text={errorMsg}/>
      <Text>Join an Org</Text>
      <TextInput
        style={styles.input}
        onChangeText={onChangeCode}
        value={code}
        placeholder="Org Code"
        keyboardType="default"
      />
      <Button
          title="Join My Org"
          onPress={() => {joinOrg()}}
      />
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

export default JoinOrgScreen;