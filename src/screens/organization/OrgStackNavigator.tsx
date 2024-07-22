import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useLayoutEffect } from "react";
import React from "react";
import { useIsFocused } from "@react-navigation/native";

import CreateEquipmentScreen from "./CreateEquipmentScreen";
import ManageEquipmentScreen from "./ManageEquipmentScreen";
import UserStorages from "./UserStorages";
import CreateStorageScreen from "./CreateStorageScreen";
import InfoScreen from "./InfoScreen";
import { OrgStackParamList } from "../../types/NavigatorTypes";
import { OrgStackScreenProps } from "../../types/ScreenTypes";

/*
    Stack navigator for the organization screens.
    It contains all the methods for managing an organization.
*/
function OrgStackNavigator({ navigation }: OrgStackScreenProps) {
  // Create a stack navigator to handle navigation throughout the app
  const Stack = createNativeStackNavigator<OrgStackParamList>();
  const isFocused = useIsFocused();

  // prevent double headers by removing the parent header on focus
  useLayoutEffect(() => {
    if (isFocused) {
      navigation.getParent()?.setOptions({
        headerShown: false,
      });
    } else {
      navigation.getParent()?.setOptions({
        headerShown: true,
      });
    }
  }, [navigation, isFocused]);

  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: "center",
        headerTitleStyle: {
          fontSize: 28,
          fontWeight: "bold",
          color: "#791111",
        },
      }}
    >
      <Stack.Screen name="InfoScreen" component={InfoScreen} />
      <Stack.Screen name="ManageEquipment" component={ManageEquipmentScreen} />
      <Stack.Screen name="CreateEquipment" component={CreateEquipmentScreen} />
      <Stack.Screen name="UserStorages" component={UserStorages} />
      <Stack.Screen name="CreateStorage" component={CreateStorageScreen} />
    </Stack.Navigator>
  );
}

export default OrgStackNavigator;
