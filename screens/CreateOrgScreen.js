import { StatusBar } from 'expo-status-bar';
import { Button, Text, View, TextInput, StyleSheet } from 'react-native';
import MainStyle from '../styles/MainStyle';
import React, {useEffect} from 'react';
import { BackHandler } from 'react-native';
import ProfileComponent from '../components/ProfileComponent';

function CreateOrgScreen({navigation}) {
  const [name, onChangeName] = React.useState('');
  // Custom so thata back button press goes to the menu
  useEffect(() => {
    const backAction = () => {
      navigation.navigate('Menu');
      return true;
    };

    // Add the backAction handler when the component mounts
    BackHandler.addEventListener('hardwareBackPress', backAction);
    // Remove the backAction handler when the component unmounts
    return () => BackHandler.removeEventListener('hardwareBackPress', backAction);
  }, [navigation]);

  return(
    <View style={MainStyle.container}>
      <ProfileComponent />
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