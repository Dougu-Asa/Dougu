import { StatusBar } from 'expo-status-bar';
import {Text, View, Button } from 'react-native';
import MainStyle from '../styles/MainStyle';

function HomeScreen({navigation}) {
    return(
      <View style={MainStyle.container}>
        <Text>Open up App.js to start working on your app!</Text>
        <Text>Hmm</Text>
        <Button
          title="Login"
          onPress={() => navigation.navigate('MenuNav', { screen: 'Menu' })}
        />
        <Button
          title="Create Account"
          onPress={() => navigation.navigate('CreateAccount')}
        />
        <StatusBar style="auto" />
      </View>
    );
}

export default HomeScreen;