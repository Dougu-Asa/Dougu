import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Amplify} from 'aws-amplify';
import '@azure/core-asynciterator-polyfill';
import { registerRootComponent } from 'expo';
import * as Sentry from '@sentry/react-native';

// Project Files
import HomeScreen from './screens/HomeScreen';
import DrawerNav from './screens/DrawerNav';
import CreateEquipmentScreen from './screens/Organization/CreateEquipmentScreen';
import ManageEquipmentScreen from './screens/Organization/ManageEquipment';
import UserStorages from './screens/Organization/UserStorages';
import CreateStorageScreen from './screens/Organization/CreateStorageScreen';
import Indicator from './components/Indicator';
import { LoadingProvider, useLoad } from './components/LoadingContext';
import { UserProvider } from './components/UserContext';
import amplifyconfig from './amplifyconfiguration.json';

/*
  Entry point into the application, and attaches the necessary providers and navigators
  to be used throughout the entire app 
*/

// Use sentry to track and log errors throughout the app
Sentry.init({
  dsn: 'https://dc0105cfe4212e7f682ce47529bc0c51@o4507486458871808.ingest.us.sentry.io/4507486460051456',
  tracesSampleRate: 1.0,
  _experiments: {
    profilesSampleRate: 1.0,
  },
});

// Configure amplify, which connects our app to the backend
Amplify.configure(amplifyconfig);

// Create a stack navigator to handle navigation throughout the app
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
  // loading indicator covers the entire app, therefore isLoading is used to determine if it should be displayed
  const {isLoading} = useLoad();

  return (
    <>
      <Stack.Navigator
      initialRouteName="Home"
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