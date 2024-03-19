import { StatusBar } from 'expo-status-bar';
import { Text, View, Button, TextInput, StyleSheet } from 'react-native';
import MainStyle from '../styles/MainStyle';
import React from 'react';

function CreateAccountScreen({navigation}) {
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
      <TextInput
      style={styles.input}
      onChangeText={onChangePassword}
      value={password}
      placeholder="password"
      keyboardType="text"
      />
      <Button title="Create Account!" onPress={() => navigation.goBack()} />
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

export default CreateAccountScreen;