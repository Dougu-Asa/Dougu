import { View, Button, TextInput, StyleSheet } from 'react-native';
import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { useState } from 'react';
import {Auth} from 'aws-amplify';
import PopupModal from './PopupModal';

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
      navigation.navigate('DrawerNav', {screen: 'MemberTabs'});
    } catch (error) {
      console.log('error signing in', error);
      setErrorMsg(error.toString());
      setModalVisible(true);
    }
  }

  const [username, onChangeUsername] = React.useState('');
  const [password, onChangePassword] = React.useState('');

  return(
    <View style={styles.container}>
      <PopupModal modalVisible={modalVisible} setModalVisible={setModalVisible} text={errorMsg}/>
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
      <Button title="Login!" onPress={() => signIn({username, password})} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },  
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