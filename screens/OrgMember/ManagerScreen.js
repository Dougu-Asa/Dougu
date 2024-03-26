import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import MainStyle from '../../styles/MainStyle';
import React from 'react';
import ProfileComponent from '../../components/ProfileComponent';

function ManagerScreen() {
  return (
    <View style={MainStyle.container}>
      <ProfileComponent />
      <Text>Manager</Text>
      <StatusBar style="auto" />
    </View>
  )
}

export default ManagerScreen;