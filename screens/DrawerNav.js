import { createDrawerNavigator, DrawerItem } from '@react-navigation/drawer';
import { TouchableOpacity, Text, View, StyleSheet, Image} from 'react-native';
import ProfileScreen from './ProfileScreen';
import JoinOrgScreen from './JoinOrgScreen';
import CreateOrgScreen from './CreateOrgScreen';
import AccessCodeScreen from './AccessCodeScreen';
import MyOrgsScreen from './MyOrgsScreen';
import MemberTabs from './OrgMember/MemberTabs';
import { BackHandler } from 'react-native';
import { Auth } from 'aws-amplify';
import React, { useEffect} from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ManagerScreen from './ManagerScreen';

function DrawerNav({navigation}) {
    const Drawer = createDrawerNavigator();
    const insets = useSafeAreaInsets();
    const [username, setUsername] = React.useState('');

    // custom android back button
    useEffect(() => {
        async function backAction() {
          await Auth.signOut();
          navigation.navigate('Home');
          return true;
        };
    
        // Add the backAction handler when the component mounts
        BackHandler.addEventListener('hardwareBackPress', backAction);
        // Remove the backAction handler when the component unmounts
        return () => BackHandler.removeEventListener('hardwareBackPress', backAction);
    }, [navigation]);

    useEffect(() => {
        async function getUsername() {
            try {
                const user = await Auth.currentAuthenticatedUser();
                console.log('user: ', user.attributes.name);
                setUsername(user.attributes.name);
            } catch (error) {
                console.log('error getting username: ', error);
            }
        }
        getUsername();
    }, []);
    
    //Custom header logout button on the right
    const MyHeaderProfileButton = ({navigation}) => {
        return (
            <TouchableOpacity style={styles.profile} onPress={() => navigation.toggleDrawer()}>
                <Image source={require('../assets/miku.jpg')} style={styles.circleImage}/>
            </TouchableOpacity>
        );
    };

    async function signOut() {
        try {
          await Auth.signOut();
          navigation.navigate('Home'); // Navigate to the home screen
        } catch (error) {
          console.log('error signing out: ', error);
        }
    }
      
    function CustomDrawerContent({navigation, ...props}) {
    return (
        <View style={{
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
            flex: 1,
            height: '100%',
          }}>
            <View style={styles.header}>
                <Text style={styles.headerText}>{username}</Text>
            </View>
            <View style={styles.listContainer}>
                <DrawerItem label="Profile" onPress={() => {navigation.navigate('Profile')}}/>
                <DrawerItem label="Current Org" onPress={() => {navigation.navigate('MemberTabs')}}/>
                <DrawerItem label="My Orgs" onPress={() => {navigation.navigate('MyOrgs')}}/>
                <DrawerItem label="Join Org!" onPress={() => {navigation.navigate('JoinOrg')}}/>
                <DrawerItem label="Create an Org!" onPress={() => {navigation.navigate('CreateOrg')}}/>
                <DrawerItem label="Mange Orgs" onPress={() => {navigation.navigate('Manager')}}/>
            </View>
            <View style={styles.footer}>
                <DrawerItem label="Logout" onPress={signOut}/>
            </View>
        </View>
    );
    }

    return (
        <Drawer.Navigator 
        screenOptions={({navigation}) => ({
            headerLeft: () => <MyHeaderProfileButton navigation={navigation}/>,
            headerTitleAlign: 'center',
            headerTitleStyle: {
                fontSize: 28,
                fontWeight: 'bold',
                color: '#791111'
            }
        })}
        drawerContent={(props) => <CustomDrawerContent {...props}/>}>
            <Drawer.Screen name="Profile" component={ProfileScreen}/>
            <Drawer.Screen name="MemberTabs" component={MemberTabs}/>
            <Drawer.Screen name="JoinOrg" component={JoinOrgScreen}/>
            <Drawer.Screen name="CreateOrg" component={CreateOrgScreen}/>
            <Drawer.Screen name="Access Code" component={AccessCodeScreen}/>
            <Drawer.Screen name="MyOrgs" component={MyOrgsScreen}/>
            <Drawer.Screen name="Manager" component={ManagerScreen}/>
        </Drawer.Navigator>
    );
};

export default DrawerNav;

const styles = StyleSheet.create({
    header: {
        justifyContent: 'center',
        height: '10%',
    },
    headerText: {
        fontSize: 18,
        left: 20,
    },
    listContainer: {
        borderWidth: 1,
        height: '80%',
    },
    footer: {
        height: '10%',
    },
    profile: {
        left: 20
    },
    circleImage: {
        width: 45, 
        height: 45, 
        borderRadius: 35 / 2, 
        padding: 5, 
        left: 5,
    },
});