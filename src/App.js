import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Amplify, Auth } from 'aws-amplify';
import amplifyconfig from './amplifyconfiguration.json';
import React, { useEffect, useState, useRef } from 'react';
import '@azure/core-asynciterator-polyfill';
import { useNavigation } from '@react-navigation/native';
import Indicator from './components/Indicator';
import { LoadingProvider, useLoad } from './components/LoadingContext';
import { UserProvider, useUser } from './components/UserContext';
import { registerRootComponent } from 'expo';

//screens
import HomeScreen from './screens/HomeScreen';
import DrawerNav from './screens/DrawerNav';
import CreateEquipmentScreen from './screens/OrgMember/CreateEquipmentScreen';
import ManageEquipmentScreen from './screens/OrgMember/ManageEquipment';
import UserStorages from './screens/OrgMember/UserStorages';
import CreateStorageScreen from './screens/OrgMember/CreateStorageScreen';
import * as Sentry from '@sentry/react-native';

// Use sentry to track and log errors throughout the app
Sentry.init({
  dsn: 'https://dc0105cfe4212e7f682ce47529bc0c51@o4507486458871808.ingest.us.sentry.io/4507486460051456',
  tracesSampleRate: 1.0,
  _experiments: {
    profilesSampleRate: 1.0,
  },
});


Amplify.configure(amplifyconfig);
const Stack = createNativeStackNavigator();

function App() {

  return (
    <NavigationContainer>
        <LoadingProvider>
          <UserProvider>
            <AppContent />
          </UserProvider>
        </LoadingProvider>
    </NavigationContainer>
  );
}

// Wrap sentry for features, export registerRootComponent for new App.js location
const WrappedApp = Sentry.wrap(App);
export default registerRootComponent(WrappedApp);

function AppContent() {
  const {isLoading} = useLoad();
  const navigation = useNavigation();
  const {setUser} = useUser();

  useEffect(() => {
    checkCurrentUser();
  }, []);

  const checkCurrentUser = async () => {
    // updateUserAuthentication updates AuthProvider context
    try {
      const user = await Auth.currentAuthenticatedUser();
      // If this succeeds, there is a logged-in user
      console.log("User is logged in");
      setUser(user);
      navigation.navigate('DrawerNav' , {screen: 'MemberTabs', params: {screen: 'Equipment'}});
    } catch (error) {
      // No current authenticated user
      console.log("No user is logged in");
    }
  };

  return (
    <>
      <Stack.Navigator
      screenOptions={{headerTitleAlign: 'center'}}
      >
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="DrawerNav" component={DrawerNav} options={{ headerShown: false }}/>
        <Stack.Screen name="ManageEquipment" component={ManageEquipmentScreen}/>
        <Stack.Screen name="CreateEquipment" component={CreateEquipmentScreen}/>
        <Stack.Screen name="UserStorages" component={UserStorages}/>
        <Stack.Screen name="CreateStorage" component={CreateStorageScreen}/>
      </Stack.Navigator>
      {isLoading ? <Indicator /> : null}
    </>
  );
};