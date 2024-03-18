import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//screens
import HomeScreen from './screens/HomeScreen';
import CreateAccountScreen from './screens/CreateAccountScreen';
import MenuNavigator from './components/MenuNavigator';


const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen}/>
        <Stack.Screen name="MenuNav" component={MenuNavigator}/>
        <Stack.Screen name="CreateAccount" component={CreateAccountScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;