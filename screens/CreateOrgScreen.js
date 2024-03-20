import { StatusBar } from 'expo-status-bar';
import { Button, Text, View, TextInput, StyleSheet } from 'react-native';
import MainStyle from '../styles/MainStyle';
import React from 'react';

function CreateOrgScreen({navigation}) {
  const [name, onChangeName] = React.useState('');

  return(
    <View style={MainStyle.container}>
      <Text>Create an Org!</Text>
      <TextInput
      style={styles.input}
      onChangeText={onChangeName}
      value={name}
      placeholder="Org Name"
      keyboardType="default"
      />
      <Button title="Create Org!" onPress={() => navigation.navigate('Access Code')} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});

export default CreateOrgScreen;