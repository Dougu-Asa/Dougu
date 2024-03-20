import { StatusBar } from 'expo-status-bar';
import {Text, View, Button, SafeAreaView, StyleSheet, TextInput } from 'react-native';
import MainStyle from '../styles/MainStyle';
import React from 'react';

function HomeScreen({navigation}) {

    return(
      <View style={MainStyle.container}>
        <Text>Login/Register!</Text>
        <Button
          title="Login"
          onPress={() => navigation.navigate('Login')}
        />
        <Button
          title="Create Account"
          onPress={() => navigation.navigate('Create')}
        />
        <StatusBar style="auto" />
      </View>
    );
}

export default HomeScreen;