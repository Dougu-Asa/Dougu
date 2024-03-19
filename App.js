import { StatusBar } from 'expo-status-bar';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AntDesign from 'react-native-vector-icons/AntDesign';

//screens
import HomeScreen from './screens/HomeScreen';
import MenuScreen from './screens/MenuScreen';
import CreateAccountScreen from './screens/CreateAccountScreen';
import MyOrgsScreen from './screens/MyOrgs';
import CreateOrgScreen from './screens/CreateOrgScreen';
import JoinOrgScreen from './screens/JoinOrgScreen';
import MemberTabs from './screens/OrgMember';
import AccessCodeScreen from './screens/AccessCodeScreen';

const Stack = createNativeStackNavigator();

// Custom header back button w/ custom back screens
const MyHeaderBackButton = ({ navigation, backScreen}) => {
  const handlePress = () => {
    if (backScreen) {
      navigation.navigate(backScreen);
    } else {
      navigation.goBack();
    }
  };
  return (
    <TouchableOpacity onPress={handlePress}>
      <AntDesign name="arrowleft" size={24} color="black"/>
    </TouchableOpacity>
  );
};

function App() {
  return (
    <NavigationContainer>
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
        })}
      >
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerLeft: () => null }}/>
        <Stack.Screen name="Menu" component={MenuScreen}/>
        <Stack.Screen name="CreateAccount" component={CreateAccountScreen}/>
        <Stack.Screen name="MyOrgs" component={MyOrgsScreen}/>
        <Stack.Screen name="JoinOrg" component={JoinOrgScreen}/>
        <Stack.Screen name="CreateOrg" component={CreateOrgScreen}/>
        <Stack.Screen name="MemberTabs" component={MemberTabs}
        initialParams={{ screenOptions: { backScreen: 'Menu' } }}/>
        <Stack.Screen name="Access Code" component={AccessCodeScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;