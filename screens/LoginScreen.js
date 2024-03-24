import { StatusBar } from 'expo-status-bar';
import { Alert, Modal, Pressable, Text, View, Button, TextInput, StyleSheet } from 'react-native';
import MainStyle from '../styles/MainStyle';
import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { useState } from 'react';
import {Auth} from 'aws-amplify';

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
      navigation.navigate('Menu');
    } catch (error) {
      console.log('error signing in', error);
      setErrorMsg(error.toString());
      setModalVisible(true);
    }
  }

  const [username, onChangeUsername] = React.useState('');
  const [password, onChangePassword] = React.useState('');

  return(
    <View style={MainStyle.container}>
      <Text>Login</Text>
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
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>{errorMsg}</Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.textStyle}>Ok</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <Button title="Login!" onPress={() => signIn({username, password})} />
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
    height: '40%',
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default LoginScreen;