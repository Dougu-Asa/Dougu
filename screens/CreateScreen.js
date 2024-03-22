import { StatusBar } from 'expo-status-bar';
import { Text, View, Button, TextInput, StyleSheet } from 'react-native';
import MainStyle from '../styles/MainStyle';
import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { useState } from 'react';
//import { signUp } from 'aws-amplify/auth';
import { useEffect } from 'react';
//import { autoSignIn } from 'aws-amplify/auth';
import { Auth } from 'aws-amplify';
import { Hub } from 'aws-amplify';

function CreateScreen({navigation}) {
  // Function to toggle the password visibility state 
  const [showPassword, setShowPassword] = useState(false); 
  const toggleShowPassword = (num) => { 
    setShowPassword(!showPassword);
  }; 

  const [email, onChangeEmail] = React.useState('');
  const [first, onChangeFirst] = React.useState('');
  const [last, onChangeLast] = React.useState('');
  const [username, onChangeUsername] = React.useState('');
  const [password, onChangePassword] = React.useState('');

  // username = first + ' ' + last
  useEffect(() => {
    onChangeUsername(first + ' ' + last);
  }, [first, last]);

  // auto sign in
  useEffect(() => {
    listenToAutoSignInEvent();
  }, []);

  // no need for email to be verified
  /*async function handleAutoSignIn() {
  try {
    const signInOutput = await autoSignIn();
    // handle sign-in steps
    console.log(signInOutput);
  } catch (error) {
    console.log(error.underlyingError);
  }
  }*/

  function listenToAutoSignInEvent() {
    Hub.listen('auth', ({ payload }) => {
      const { event } = payload;
      if (event === 'autoSignIn') {
        const user = payload.data;
        console.log('auto sign in success');
        console.log(user);
        // assign user
      } else if (event === 'autoSignIn_failure') {
        // redirect to sign in page
        console.log('redirect to sign in page');
      }
    });
  }

  async function handleSignUp({ username, password, email }) {
    try {
      console.log(username, password, email);
      if(username === undefined || password === undefined || email === undefined) {
        console.log('missing fields');
        return;
      }
      const { user } = await Auth.signUp({
        username: email,
        password: password,
        name: username,
        options: {
          autoSignIn: true // sign in once created
        }
      });
      console.log(user);
      //handleAutoSignIn();
      navigation.navigate('Login');
    } catch (error) {
      console.log('error signing up:', error.underlyingException);
    }
  }

  return(
    <View style={MainStyle.container}>
      <Text>Create Account</Text>
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
      <Button title="Create Account!" onPress={() => handleSignUp({username, email, password})} />
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 60,
    borderWidth: 1,
    width: '70%',
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
    width: '70%',
    height: 60,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '70%'
  },
  name: {
    width: '40%',
    height: 60,
    borderWidth: 1,
    padding: 10,
  },
  icon: {
    padding: 10,
    width: '18%',
  }
});

export default CreateScreen;