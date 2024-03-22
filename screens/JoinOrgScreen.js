import { StatusBar } from 'expo-status-bar';
import { Text, View, Button, TextInput, StyleSheet } from 'react-native';
import MainStyle from '../styles/MainStyle';
import React, {useEffect} from 'react';
import { BackHandler } from 'react-native';

function JoinOrgScreen({navigation}) {
  const [code, onChangeCode] = React.useState('');
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
        <Text>Join an Org</Text>
        <TextInput
          style={styles.input}
          onChangeText={onChangeCode}
          value={code}
          placeholder="Org Code"
          keyboardType="default"
        />
        <Button
            title="Join My Org"
            onPress={() => navigation.navigate('MemberTabs', {screen: 'My Equipment'})}
        />
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

export default JoinOrgScreen;