import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useLayoutEffect } from "react";
import { useIsFocused } from "@react-navigation/native";

import CreateEquipmentScreen from "./CreateEquipmentScreen";
import ManageEquipmentScreen from "./ManageEquipmentScreen";
import SheetScreen from "./SheetScreen";
import UserStorages from "./UserStorages";
import CreateStorageScreen from "./CreateStorageScreen";
import InfoScreen from "./InfoScreen";
import ItemImageScreen from "./ItemImageScreen";
import { OrgStackParamList } from "../../types/NavigatorTypes";
import { OrgStackScreenProps } from "../../types/ScreenTypes";
import ItemImageProvider from "../../helper/context/ItemImageContext";

/*
    Stack navigator for the organization screens.
    It contains all the methods for managing an organization.
*/
export default function OrgStackNavigator({ navigation }: OrgStackScreenProps) {
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
    <ItemImageProvider>
      <Stack.Navigator
        screenOptions={{
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: "semibold",
          },
        }}
      >
        <Stack.Screen name="InfoScreen" component={InfoScreen} />
        <Stack.Screen
          name="ManageEquipment"
          component={ManageEquipmentScreen}
        />
        <Stack.Screen
          name="CreateEquipment"
          component={CreateEquipmentScreen}
        />
        <Stack.Screen name="ItemImage" component={ItemImageScreen} />
        <Stack.Screen name="UserStorages" component={UserStorages} />
        <Stack.Screen name="CreateStorage" component={CreateStorageScreen} />
        <Stack.Screen name="Sheet" component={SheetScreen} />
      </Stack.Navigator>
    </ItemImageProvider>
  );
}
