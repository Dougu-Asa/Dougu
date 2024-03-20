import { StatusBar } from 'expo-status-bar';
import { Text, View, Button, TextInput, StyleSheet } from 'react-native';
import MainStyle from '../styles/MainStyle';
import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { useState } from 'react';

function CreateScreen({navigation}) {
  // Function to toggle the password visibility state 
  const [showPassword1, setShowPassword1] = useState(false); 
  const [showPassword2, setShowPassword2] = useState(false); 
  const toggleShowPassword = (num) => { 
    if (num == 1) {
      setShowPassword1(!showPassword1); 
    }
    else {
      setShowPassword2(!showPassword2); 
    }
  }; 

  const [userName, onChangeUsername] = React.useState('');
  const [password1, onChangePassword1] = React.useState('');
  const [password2, onChangePassword2] = React.useState('');
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
        onChangeText={onChangePassword1}
        secureTextEntry={!showPassword1}
        value={password1}
        placeholder="password"
        keyboardType="default"
        />
        <MaterialCommunityIcons 
          name={showPassword1 ? 'eye-off' : 'eye'} 
          size={24} 
          color="#aaa"
          style={styles.icon} 
          onPress={() => toggleShowPassword(1)}
        /> 
      </View>
      <View style={styles.password}>
        <TextInput
        style={styles.pinput}
        onChangeText={onChangePassword2}
        secureTextEntry={!showPassword2}
        value={password2}
        placeholder="verify password"
        keyboardType="default"
        />
        <MaterialCommunityIcons 
          name={showPassword2 ? 'eye-off' : 'eye'} 
          size={24} 
          color="#aaa"
          style={styles.icon} 
          onPress={() => toggleShowPassword(2)}
        /> 
      </View>
      <Button title="Create Account!" onPress={() => navigation.navigate('Menu')} />
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

export default CreateScreen;