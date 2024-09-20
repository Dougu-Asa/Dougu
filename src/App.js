import { NavigationContainer } from "@react-navigation/native";
import { DataStore, AuthModeStrategyType } from "aws-amplify/datastore";
import { Amplify } from "aws-amplify";
import "@azure/core-asynciterator-polyfill";
import { registerRootComponent } from "expo";

// Project Files
import LoadingProvider from "./helper/context/LoadingContext";
import UserProvider from "./helper/context/UserContext";
import amplifyconfig from "./amplifyconfiguration.json";
import RootStackNavigator from "./screens/RootStackNavigator";

/*
  Entry point into the application, and attaches the necessary providers and navigators
  to be used throughout the entire app 
*/

// Configure amplify, which connects our app to the backend
Amplify.configure(amplifyconfig);
DataStore.configure({
  authModeStrategyType: AuthModeStrategyType.MULTI_AUTH,
});

function App() {
  return (
    <NavigationContainer>
      <LoadingProvider>
        <UserProvider>
          <RootStackNavigator />
        </UserProvider>
      </LoadingProvider>
    </NavigationContainer>
  );
}

export default registerRootComponent(App);
