import { Text, View, TextInput, TouchableOpacity} from 'react-native';
import React from 'react';
import { DataStore } from '@aws-amplify/datastore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// project imports
import createJoinStyles from '../../styles/CreateJoinStyles';
import { useLoad } from '../../helper/LoadingContext';
import { Organization, User, OrgUserStorage, UserOrStorage } from '../../models';
import { useUser } from '../../helper/UserContext';
import { handleError } from '../../helper/Error';

/*
  Screen for creating an organization, user enters the name of the org
  and a random access code is generated. The user that creates the org is
  automatically the manager of the org.
*/
function CreateOrgScreen({navigation}) {
  const {setIsLoading} = useLoad();
  const [name, onChangeName] = React.useState('');
  const { user, setOrg } = useUser();
  var randomstring = require("randomstring");

  // generate codes and check if they are unique. If not, generate another
  async function generateCode(){
    while(true){
      const code = randomstring.generate({
        length: 7,
        capitalization: 'uppercase',
      });
      // Check that access code and name are unique
      const orgs = await DataStore.query(Organization, (c) => c.or(c => [
        c.accessCode.eq(code),
        c.name.eq(name)
      ]));
      if(orgs == null || orgs.length == 0){
        return code;
      }
    }
  }

  // create an org and orgUserStorage to add to the database
  async function create(code){
    // query for the user that will be the org manager
    const DBuser = await DataStore.query(User, user.attributes.sub);
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
    // Add the OrgUserStorage to the DB
    const newOrgUserStorage = await DataStore.save(
      new OrgUserStorage({
        organization: newOrg,
        type: UserOrStorage.USER,
        user: DBuser,
        name: DBuser.name,
      })
    );
    if(newOrgUserStorage == null) throw new Error("OrgUserStorage not created successfully.");
    return newOrg;
  }

  // handle verification, creation, and navigation when creating a new Organization
  async function handleCreate(){
    try {
      setIsLoading(true);
      // Generate a random access code
      const code = await generateCode();
      // Create the org and orgUserStorage
      const newOrg = await create(code);
      // use a key to keep track of currentOrg per user
      const key = user.attributes.sub + ' currOrg';
      await AsyncStorage.setItem(key, JSON.stringify(newOrg));
      setOrg(newOrg);
      onChangeName('');
      setIsLoading(false);
      navigation.navigate('AccessCode', {accessCode: code});
    }
    catch (error) {
      handleError("handleCreate", error, setIsLoading);
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
      <TouchableOpacity style={createJoinStyles.button} onPress={() => {handleCreate()}}>
        <Text style={createJoinStyles.btnText}>Create Org</Text>
      </TouchableOpacity>
  </View>
  );
}

export default CreateOrgScreen;