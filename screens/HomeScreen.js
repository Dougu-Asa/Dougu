import { StatusBar } from 'expo-status-bar';
import {Text, View, Button, SafeAreaView, StyleSheet, TextInput } from 'react-native';
import MainStyle from '../styles/MainStyle';
import React, {useEffect} from 'react';
import { AuthProvider } from '../components/AuthProvider';
import { useAuth } from '../components/AuthProvider';

function HomeScreen({navigation}) {
  const { isUserAuthenticated } = useAuth();
  
  useEffect(() => {
    if(isUserAuthenticated) {
      navigation.navigate('Menu');
    }
  });

  return(
    <View style={MainStyle.container}>
      <Text>Login/Register!</Text>
      <Button
        title="Login"
        onPress={() => navigation.navigate('Login')}
      />
      <Button
        title="Create Account"
        onPress={() => navigation.navigate('CreateAcc')}
      />
      <StatusBar style="auto" />
    </View>
  );
}

export default HomeScreen;