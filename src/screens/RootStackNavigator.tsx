import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "./HomeScreen";
import DrawerNav from "./drawer/DrawerNav";
import SyncScreen from "./SyncScreen";
import RequestReset from "./RequestReset";
import ResetPassword from "./ResetPassword";
import SpinningIndicator from "../components/SpinningIndicator";
import { RootStackParamList } from "../types/NavigatorTypes";
import { useLoad } from "../helper/LoadingContext";

// Create a stack navigator to handle navigation throughout the app
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStackNavigator() {
  // loading indicator covers the entire app, therefore isLoading is used to determine if it should be displayed
  const { isLoading } = useLoad();

  return (
    <>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{ headerTitleAlign: "center" }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DrawerNav"
          component={DrawerNav}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SyncScreen"
          component={SyncScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="RequestReset" component={RequestReset} />
        <Stack.Screen name="ResetPassword" component={ResetPassword} />
      </Stack.Navigator>
      {isLoading ? <SpinningIndicator /> : null}
    </>
  );
}
