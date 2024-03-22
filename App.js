import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Amplify } from 'aws-amplify';
import amplifyconfig from './src/amplifyconfiguration.json';
import React, { useEffect, useState } from 'react';
import { Auth } from 'aws-amplify';
import { AuthProvider } from './components/AuthProvider';
import { useAuth } from './components/AuthProvider';

//screens
import HomeScreen from './screens/HomeScreen';
import MenuScreen from './screens/MenuScreen';
import CreateAccScreen from './screens/CreateAccScreen'
import CreateOrgScreen from './screens/CreateOrgScreen';
import JoinOrgScreen from './screens/JoinOrgScreen';
import MemberTabs from './screens/OrgMember';
import AccessCodeScreen from './screens/AccessCodeScreen';
import LoginScreen from './screens/LoginScreen';

Amplify.configure(amplifyconfig);
const Stack = createNativeStackNavigator();

function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppContent />
      </NavigationContainer>
    </AuthProvider>
  );
}
export default App;

function AppContent() {
  const { isUserAuthenticated } = useAuth();
  const { updateUserAuthentication } = useAuth();

  useEffect(() => {
    checkCurrentUser();
  }, []);

  const checkCurrentUser = async () => {
    // updateUserAuthentication updates AuthProvider context
    try {
      await Auth.currentAuthenticatedUser();
        // If this succeeds, there is a logged-in user
        console.log("User is logged in");
        updateUserAuthentication(true);
    } catch (error) {
        // No current authenticated user
        console.log("No user is logged in");
        updateUserAuthentication(false);
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
      headerRight: () => (
        isUserAuthenticated ? <MyHeaderProfileButton navigation={navigation}/> : null
      )
    })}>
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerLeft: () => null }}/>
      <Stack.Screen name="Menu" component={MenuScreen} 
      initialParams={{ screenOptions: { backScreen: 'Home' } }} />
      <Stack.Screen name="Login" component={LoginScreen}/>
      <Stack.Screen name="CreateAcc" component={CreateAccScreen}/>
      <Stack.Screen name="JoinOrg" component={JoinOrgScreen}
      initialParams={{ screenOptions: { backScreen: 'Menu' } }}/>
      <Stack.Screen name="CreateOrg" component={CreateOrgScreen}
      initialParams={{ screenOptions: { backScreen: 'Menu' } }}/>
      <Stack.Screen name="MemberTabs" component={MemberTabs}
      initialParams={{ screenOptions: { backScreen: 'Menu' } }}/>
      <Stack.Screen name="Access Code" component={AccessCodeScreen}
      initialParams={{ screenOptions: { backScreen: 'Menu' } }}/>
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

// Custom header logout button on the right
const MyHeaderProfileButton = ({navigation}) => {
  async function signOut() {
    try {
      await Auth.signOut();
      navigation.navigate('Home');
    } catch (error) {
      console.log('error signing out: ', error);
    }
  }
  return (
    <>
      <TouchableOpacity onPress={() => {signOut()}}>
        <MaterialCommunityIcons name="logout" size={30} color="black" />
      </TouchableOpacity>
    </>
  );
};