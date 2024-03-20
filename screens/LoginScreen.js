import { StatusBar } from 'expo-status-bar';
import { Text, View, Button, TextInput, StyleSheet } from 'react-native';
import MainStyle from '../styles/MainStyle';
import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { useState } from 'react';

function LoginScreen({navigation}) {
  // Function to toggle the password visibility state 
  const [showPassword, setShowPassword] = useState(false); 
  const toggleShowPassword = () => { 
    setShowPassword(!showPassword); 
  }; 

  const [userName, onChangeUsername] = React.useState('');
  const [password, onChangePassword] = React.useState('');

  return(
    <View style={MainStyle.container}>
      <Text>Create Account</Text>
      <TextInput
      style={styles.input}
      onChangeText={onChangeUsername}
      value={userName}
      placeholder="username/email"
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
      <Button title="Login!" onPress={() => navigation.navigate('Menu')} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 60,
    margin: '5%',
    borderWidth: 1,
    padding: 10,
    width: '50%'
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
    width: '50%',
    height: 60,
  },
});

export default LoginScreen;