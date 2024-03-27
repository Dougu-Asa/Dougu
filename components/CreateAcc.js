import { StatusBar } from 'expo-status-bar';
import { Alert, Modal, View, Button, TextInput, StyleSheet, Pressable, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import React, { useEffect, useState } from 'react';
import { Auth } from 'aws-amplify'
import PopupModal from './PopupModal';
import { DataStore } from '@aws-amplify/datastore';
import { User } from '../src/models';

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

  // popup modal
  const [modalVisible, setModalVisible] = useState(false);
  const [errorMsg, setErrorMsg] = useState('Error!');

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
      const user = await Auth.signIn(email, password);
      console.log(user);
      const newUser = await DataStore.save(
        new User({
          userId: user.attributes.sub,
          name: user.attributes.name,
          email: user.attributes.email,
        })
      );
      console.log(newUser);
      navigation.navigate('DrawerNav', {screen: 'MemberTabs'});
    } catch (error) {
      console.log('error signing up:', error);
      console.log(error);
      setErrorMsg(error.toString());
      setModalVisible(true);
    }
  }

  return(
    <View>
      <PopupModal modalVisible={modalVisible} setModalVisible={setModalVisible} text={errorMsg}/>
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
  },
});

export default CreateAccScreen;