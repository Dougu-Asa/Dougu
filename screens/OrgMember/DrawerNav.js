import { createDrawerNavigator, DrawerItem } from '@react-navigation/drawer';
import { TouchableOpacity, Text, View, StyleSheet} from 'react-native';
import ProfileScreen from '../ProfileScreen';
import JoinOrgScreen from '../JoinOrgScreen';
import CreateOrgScreen from '../CreateOrgScreen';
import AccessCodeScreen from '../AccessCodeScreen';
import MemberTabs from './MemberTabs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { BackHandler } from 'react-native';
import { Auth } from 'aws-amplify';
import React, { useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function DrawerNav({navigation}) {
    const Drawer = createDrawerNavigator();
    const insets = useSafeAreaInsets();

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
    
    //Custom header logout button on the right
    const MyHeaderProfileButton = ({navigation}) => {
        return (
            <TouchableOpacity style={styles.profile} onPress={() => navigation.toggleDrawer()}>
                <FontAwesome name="user-circle-o" size={35} color="black" style={{padding: 5}}/>
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
                <DrawerItem label="User Name" />
            </View>
            <View style={styles.listContainer}>
                <DrawerItem label="Profile" onPress={() => {navigation.navigate('Profile')}}/>
                <DrawerItem label="Current Org" onPress={() => {navigation.navigate('MemberTabs')}}/>
                <DrawerItem label="Join Org!" onPress={() => {navigation.navigate('JoinOrg')}}/>
                <DrawerItem label="Create an Org!" onPress={() => {navigation.navigate('CreateOrg')}}/>
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
            headerStyle: {
                backgroundColor: 'gray',
            },
        })}
        drawerContent={(props) => <CustomDrawerContent {...props}/>}>
            <Drawer.Screen name="Profile" component={ProfileScreen}/>
            <Drawer.Screen name="MemberTabs" component={MemberTabs}/>
            <Drawer.Screen name="JoinOrg" component={JoinOrgScreen}/>
            <Drawer.Screen name="CreateOrg" component={CreateOrgScreen}/>
            <Drawer.Screen name="Access Code" component={AccessCodeScreen}/>
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
        fontSize: 32,
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
    }
});