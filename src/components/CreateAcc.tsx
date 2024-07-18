import { Alert, View, TextInput, StyleSheet, Text } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import React, { useEffect, useState } from 'react';
import { Auth } from 'aws-amplify'
import { DataStore } from '@aws-amplify/datastore';

// Project Files
import { User } from '../models';
import { useLoad } from '../helper/LoadingContext';
import { useUser } from '../helper/UserContext';
import { handleError } from '../helper/Error';
import { NavigationOnlyProps } from '../types/NavigationTypes';

/*
  A component that allows the user to create an account
  using their email and password. This is handled by
  using Cognito from AWS Amplify. Users are also uploaded
  to the database using Amplify Datastore.
*/
function CreateAccScreen({navigation}: NavigationOnlyProps) {
  const {setIsLoading} = useLoad();
  const {setUser} = useUser();

  // for the form
  const [email, onChangeEmail] = React.useState('');
  const [first, onChangeFirst] = React.useState('');
  const [last, onChangeLast] = React.useState('');
  const [username, onChangeUsername] = React.useState('');
  const [password, onChangePassword] = React.useState('');

  // Function to toggle the password visibility state 
  const [showPassword, setShowPassword] = useState(false); 
  const toggleShowPassword = () => { 
    setShowPassword(!showPassword);
  }; 

  // username = first + ' ' + last
  useEffect(() => {
    onChangeUsername(first + ' ' + last);
  }, [first, last]);

  async function handleSignUp({ username, password, email } : { username: string, password: string, email: string }) {
    try {
      setIsLoading(true);
      if(username === undefined || username == ' ' || password === undefined || email === undefined) {
        Alert.alert('Form Error', 'Please fill out all fields.', [{text: 'OK'}]);
        return;
      }
      await Auth.signUp({
        username: email,   // email is the username
        password: password,
        attributes: {
          name: username,
        }
      });
      const user = await Auth.signIn(email, password);
      const newUser = await DataStore.save(
        new User({
          userId: user.attributes.sub,
          name: user.attributes.name,
          email: user.attributes.email,
        })
      );
      setUser(user);
      onChangeEmail('');
      onChangeFirst('');
      onChangeLast('');
      onChangePassword('');
      onChangeUsername('');
      setIsLoading(false);
      navigation.navigate('DrawerNav', {screen: 'JoinOrCreate'});
    } catch (error) {
      handleError("handleSignUp", error as Error, setIsLoading);
    }
  }

  return(
    <View style={styles.container}>
      <Text style={styles.header}>Create Account</Text>
      <View style={styles.nameContainer}>
        <TextInput
        style={styles.name}
        onChangeText={onChangeFirst}
        value={first}
        placeholder="first"
        keyboardType="default"
        />
        <TextInput
        style={styles.name}
        onChangeText={onChangeLast}
        value={last}
        placeholder="last"
        keyboardType="default"
        />
      </View>
      <TextInput
      style={styles.input}
      onChangeText={onChangeEmail}
      value={email}
      placeholder="email"
      keyboardType="email-address"
      />
      <View style={styles.passwordContainer}>
        <TextInput
        style={styles.pinput}
        onChangeText={onChangePassword}
        secureTextEntry={!showPassword}
        value={password}
        placeholder="password"
        keyboardType="default"
        />
        <MaterialCommunityIcons 
          name={showPassword ? 'eye-off' : 'eye'} 
          size={28} 
          color="#aaa"
          style={styles.icon} 
          onPress={() => toggleShowPassword()}
        /> 
      </View>
      <TouchableOpacity style={styles.button} onPress={() => handleSignUp({username, email, password})}>
        <Text style={styles.btnText}>Create</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: '8%',
  },
  input: {
    height: 60,
    borderWidth: 1,
    borderRadius: 10,
    margin: '5%',
    width: '80%',
    padding: 10,
  },
  pinput: {
    height: 60,
    width: '82%',
    padding: 10,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 10,
    width: '80%',
    height: 60,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: '5%',
  },
  name: {
    width: '40%',
    height: 60,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
  icon: {
    padding: 5,
    width: '18%',
  },
  button: {
    height: 50,
    margin: 15,
    backgroundColor: '#333333',
    width: '80%',   
    borderRadius: 10,
  },
  btnText: {
    textAlign: 'center',
    color: '#fff',
    padding: 10,
  },
});

export default CreateAccScreen;