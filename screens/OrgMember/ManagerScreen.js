import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import MainStyle from '../../styles/MainStyle';
import React from 'react';

function ManagerScreen() {
  return (
    <View style={MainStyle.container}>
      <Text>Manager</Text>
      <StatusBar style="auto" />
    </View>
  )
}

export default ManagerScreen;