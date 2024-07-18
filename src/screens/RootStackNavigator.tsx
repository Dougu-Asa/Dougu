import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "./HomeScreen";
import DrawerNav from "./drawer/DrawerNav";
import CreateEquipmentScreen from "./organization/CreateEquipmentScreen";
import ManageEquipmentScreen from "./organization/ManageEquipment";
import UserStorages from "./organization/UserStorages";
import CreateStorageScreen from "./organization/CreateStorageScreen";
import Indicator from "../components/Indicator";
import { RootStackParamList } from "../types/NavigationTypes";
import { useLoad } from "../helper/LoadingContext";

// Create a stack navigator to handle navigation throughout the app
const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootStackNavigator() {
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
          name="ManageEquipment"
          component={ManageEquipmentScreen}
        />
        <Stack.Screen
          name="CreateEquipment"
          component={CreateEquipmentScreen}
        />
        <Stack.Screen name="UserStorages" component={UserStorages} />
        <Stack.Screen name="CreateStorage" component={CreateStorageScreen} />
      </Stack.Navigator>
      {isLoading ? <Indicator /> : null}
    </>
  );
}
