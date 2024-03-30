import { View, Button, TextInput, StyleSheet, Alert, TouchableOpacity, Text } from 'react-native';
import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { useState } from 'react';
import {Auth} from 'aws-amplify';
import { Dimensions } from 'react-native';

function LoginScreen({navigation}) {
  // Function to toggle the password visibility state 
  const [showPassword, setShowPassword] = useState(false); 
  const toggleShowPassword = () => { 
    setShowPassword(!showPassword); 
  }; 

  // modal popup
  const [modalVisible, setModalVisible] = useState(false);
  const [errorMsg, setErrorMsg] = useState('Error!');

  async function signIn({username, password}) {
    try {
      await Auth.signIn(username, password);
      onChangePassword('');
      onChangeUsername('');
      navigation.navigate('DrawerNav' , {screen: 'MemberTabs', params: {screen: 'Equipment'}});
    } catch (error) {
      console.log('error signing in', error);
      Alert.alert('Error', error.message, [{text: 'OK'}]);
    }
  }

  const [username, onChangeUsername] = React.useState('');
  const [password, onChangePassword] = React.useState('');

  return(
    <View style={styles.container}>
      <Text style={styles.headerText}>Login</Text>
      <TextInput
      style={styles.input}
      onChangeText={onChangeUsername}
      value={username}
      placeholder="email"
      keyboardType="email-address"
      />
      <View style={styles.password}>
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
          size={24} 
          color="#aaa"
          style={styles.icon} 
          onPress={toggleShowPassword} 
        /> 
      </View>
      <TouchableOpacity style={styles.button} onPress={() => signIn({username, password})}>
        <Text style={styles.btnText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
  },  
  input: {
    height: 60,
    margin: '5%',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    width: '80%'
  },
  pinput: {
    height: 50,
    margin: '5%',
    padding: 10,
    width: '75%',
  },
  password: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    width: '80%',
    height: 60,
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
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: '8%',
  },
});

export default LoginScreen;