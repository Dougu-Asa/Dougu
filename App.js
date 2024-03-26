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
import CreateAccScreen from './screens/CreateAccScreen'
import LoginScreen from './screens/LoginScreen';
import { UserOrgProvider } from './components/UserOrgProvider';
import DrawerNav from './screens/OrgMember/DrawerNav';

Amplify.configure(amplifyconfig);
const Stack = createNativeStackNavigator();

function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <UserOrgProvider>
          <AppContent/>
        </UserOrgProvider>
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
    <Stack.Navigator
    screenOptions={({ navigation, route }) => ({
      headerTitleStyle: {
      fontWeight: 'bold',
    },
    headerTitleAlign: 'center',
    headerLeft: (props) => {
      // Access custom options set for the current screen, assuming they are passed as route params
      const screenOptions = route.params?.screenOptions || {};
      return (
        <MyHeaderBackButton
          {...props}
          navigation={navigation}
          backScreen={screenOptions.backScreen}
          backScreenLabel={screenOptions.backScreenLabel}
        />
      );
    },
    })}>
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerLeft: () => null }}/>
      <Stack.Screen name="Login" component={LoginScreen}/>
      <Stack.Screen name="CreateAcc" component={CreateAccScreen}/>
      <Stack.Screen name="DrawerNav" component={DrawerNav} options={{ headerShown: false }}/>
    </Stack.Navigator>
  );
};

// Custom header back button w/ custom back screens
const MyHeaderBackButton = ({ navigation, backScreen}) => {
  async function handlePress() {
    if (backScreen) {
      if(backScreen === 'Home') {
        await Auth.signOut();
      }
      navigation.navigate(backScreen);
    } else {
      navigation.goBack();
    }
  };
  return (
    <TouchableOpacity onPress={handlePress}>
      <AntDesign name="arrowleft" size={30} color="black"/>
    </TouchableOpacity>
  );
};