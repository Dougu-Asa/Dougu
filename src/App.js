import { NavigationContainer } from "@react-navigation/native";
import { Amplify, AuthModeStrategyType } from "aws-amplify";
import "@azure/core-asynciterator-polyfill";
import { registerRootComponent } from "expo";
import * as Sentry from "@sentry/react-native";

// Project Files
import LoadingProvider from "./helper/context/LoadingContext";
import UserProvider from "./helper/context/UserContext";
import amplifyconfig from "./amplifyconfiguration.json";
import RootStackNavigator from "./screens/RootStackNavigator";

/*
  Entry point into the application, and attaches the necessary providers and navigators
  to be used throughout the entire app 
*/

// Use sentry to track and log errors throughout the app
Sentry.init({
  dsn: "https://dc0105cfe4212e7f682ce47529bc0c51@o4507486458871808.ingest.us.sentry.io/4507486460051456",
  tracesSampleRate: 1.0,
  _experiments: {
    profilesSampleRate: 1.0,
  },
  // temporary disable for development
  enabled: false,
});

// Configure amplify, which connects our app to the backend
Amplify.configure({
  ...amplifyconfig,
  DataStore: {
    authModeStrategyType: AuthModeStrategyType.MULTI_AUTH,
  },
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

// Wrap sentry for features, export registerRootComponent for new App.js location
const WrappedApp = Sentry.wrap(App);
export default registerRootComponent(WrappedApp);
