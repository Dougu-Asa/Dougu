import { StatusBar } from 'expo-status-bar';
import { Button, Text, View, TextInput, StyleSheet } from 'react-native';
import MainStyle from '../styles/MainStyle';
import React, {useEffect} from 'react';
import { BackHandler } from 'react-native';
import ProfileComponent from '../components/ProfileComponent';
import { API } from 'aws-amplify';
import * as queries from '../src/graphql/queries'
import * as mutations from '../src/graphql/mutations'

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
  async function createOrg(){
    try {
      const code = randomstring.generate({
        length: 7,
        capitalization: 'uppercase',
      });
      console.log("Org Code: " + code);
      const filter = {
        filter: {
          or: [{ accessCode: { eq: code } }, { name: { eq: name } }]
        }
      };
      // Check that access code and name aare unique
      const org = await API.graphql({
        query: queries.listOrganizations,
        variables: filter
      });
      console.log(org.data.listOrganizations.items);
      if(org && org.data.listOrganizations.items.length > 0){
        console.log("Access code already exists");
        return;
      }
      // Add the org to the database
      const orgData = {
        name: name,
        accessCode: code
      };
      const newOrg = await API.graphql({
        query: queries.createOrganization,
        variables: { input: orgData }
      });
      console.log(newOrg);
      // Create OrgStorage

      // Add the OrgStorage to Organization

      // Navigate to the access code screen

      //navigation.navigate('Access Code');
    }
    catch (e) {
      // setup popups
      console.log(e);
    }
  }

  return(
    <View style={MainStyle.container}>
      <ProfileComponent />
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