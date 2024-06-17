import { createNativeStackNavigator } from '@react-navigation/native-stack';

//screens
import MyOrgsScreen from '../screens/MyOrgs';
import CreateOrgScreen from '../screens/CreateOrgScreen';
import JoinOrgScreen from '../screens/JoinOrgScreen';
import MenuScreen from '../screens/MenuScreen';

const Stack = createNativeStackNavigator();

function MenuNavigator() {
  return (
    <Stack.Navigator>
        <Stack.Screen name="Menu" component={MenuScreen}/>
        <Stack.Screen name="MyOrgs" component={MyOrgsScreen}/>
        <Stack.Screen name="JoinOrg" component={JoinOrgScreen}/>
        <Stack.Screen name="CreateOrg" component={CreateOrgScreen}/>
    </Stack.Navigator>
  );
}

export default MenuNavigator;