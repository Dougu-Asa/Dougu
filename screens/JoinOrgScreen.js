import { StatusBar } from 'expo-status-bar';
import { Text, View, Button, TextInput, StyleSheet } from 'react-native';
import MainStyle from '../styles/MainStyle';
import React from 'react';

function JoinOrgScreen({navigation}) {
  const [code, onChangeCode] = React.useState('');

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