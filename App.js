import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Amplify } from 'aws-amplify';
import amplifyconfig from './src/amplifyconfiguration.json';
import React, { useEffect, useState } from 'react';
import { Auth } from 'aws-amplify';
import '@azure/core-asynciterator-polyfill';
import { useNavigation } from '@react-navigation/native';

//screens
import HomeScreen from './screens/HomeScreen';
import DrawerNav from './screens/DrawerNav';
import CreateEquipmentScreen from './screens/OrgMember/CreateEquipmentScreen';

Amplify.configure(amplifyconfig);
const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
        <AppContent />
    </NavigationContainer>
  );
}
export default App;

function AppContent() {
  const navigation = useNavigation();

  useEffect(() => {
    checkCurrentUser();
  }, []);

  const checkCurrentUser = async () => {
    // updateUserAuthentication updates AuthProvider context
    try {
      await Auth.currentAuthenticatedUser();
      // If this succeeds, there is a logged-in user
      console.log("User is logged in");
      navigation.navigate('DrawerNav' , {screen: 'MemberTabs', params: {screen: 'Equipment'}});
    } catch (error) {
      // No current authenticated user
      console.log("No user is logged in");
    }
  };

  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="DrawerNav" component={DrawerNav} options={{ headerShown: false }}/>
      <Stack.Screen name="CreateEquipment" component={CreateEquipmentScreen}/>
    </Stack.Navigator>
  );
};