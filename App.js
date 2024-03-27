import { TouchableOpacity} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Amplify } from 'aws-amplify';
import amplifyconfig from './src/amplifyconfiguration.json';
import React, { useEffect, useState } from 'react';
import { Auth } from 'aws-amplify';
import { AuthProvider } from './components/AuthProvider';
import { useAuth } from './components/AuthProvider';
import '@azure/core-asynciterator-polyfill';

//screens
import HomeScreen from './screens/HomeScreen';
import DrawerNav from './screens/DrawerNav';

Amplify.configure(amplifyconfig);
const Stack = createNativeStackNavigator();

function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppContent/>
      </NavigationContainer>
    </AuthProvider>
  );
}
export default App;

function AppContent() {
  const { setIsUserAuthenticated } = useAuth();
  useEffect(() => {
    checkCurrentUser();
  }, []);

  const checkCurrentUser = async () => {
    // updateUserAuthentication updates AuthProvider context
    try {
      await Auth.currentAuthenticatedUser();
        // If this succeeds, there is a logged-in user
        console.log("User is logged in");
        setIsUserAuthenticated(true);
    } catch (error) {
        // No current authenticated user
        console.log("No user is logged in");
        setIsUserAuthenticated(false);
    }
  };

  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="DrawerNav" component={DrawerNav} options={{ headerShown: false }}/>
    </Stack.Navigator>
  );
};