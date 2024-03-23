import { StatusBar } from 'expo-status-bar';
import { Text, View, Button, TextInput, StyleSheet } from 'react-native';
import MainStyle from '../styles/MainStyle';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import React, { useEffect, useState } from 'react';
import { Auth } from 'aws-amplify';
import { API } from 'aws-amplify';
import { createUser } from '../src/graphql/mutations';

function CreateAccScreen({navigation}) {
  // Function to toggle the password visibility state 
  const [showPassword, setShowPassword] = useState(false); 
  const toggleShowPassword = (num) => { 
    setShowPassword(!showPassword);
  }; 

  // for the form
  const [email, onChangeEmail] = React.useState('');
  const [first, onChangeFirst] = React.useState('');
  const [last, onChangeLast] = React.useState('');
  const [username, onChangeUsername] = React.useState('');
  const [password, onChangePassword] = React.useState('');

  // username = first + ' ' + last
  useEffect(() => {
    onChangeUsername(first + ' ' + last);
  }, [first, last]);

  async function handleSignUp({ username, password, email }) {
    try {
      console.log(username, password, email);
      if(username === undefined || password === undefined || email === undefined) {
        console.log('missing fields');
        return;
      }
      await Auth.signUp({
        username: email,   // email is the username
        password: password,
        attributes: {
          name: username,
        }
      });
      const user = await Auth.signIn(email, password);    // sign in once created
      const newUser = { id: user.attributes.sub, name: user.attributes.name, email: user.attributes.email};
      console.log(newUser);
      // upload our new user to the database
      await API.graphql({
        query: createUser,
        variables: {
          input: newUser
        }
      }); 
      navigation.navigate('Menu');
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

export default CreateAccScreen;