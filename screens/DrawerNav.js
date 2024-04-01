import { createDrawerNavigator, DrawerItem } from '@react-navigation/drawer';
import { TouchableOpacity, Text, View, StyleSheet, Image, Alert} from 'react-native';
import JoinOrgScreen from './JoinOrgScreen';
import CreateOrgScreen from './CreateOrgScreen';
import AccessCodeScreen from './AccessCodeScreen';
import MyOrgsScreen from './MyOrgsScreen';
import MemberTabs from './OrgMember/MemberTabs';
import JoinOrCreateScreen from './JoinOrCreateScreen';
import { BackHandler } from 'react-native';
import { Auth } from 'aws-amplify';
import React, { useEffect} from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { useLoad } from '../components/LoadingContext';
import { OrgUserStorage } from '../src/models';
import { DataStore } from '@aws-amplify/datastore';

function DrawerNav({navigation}) {
    const Drawer = createDrawerNavigator();
    const insets = useSafeAreaInsets();
    const [username, setUsername] = React.useState('');
    const [hasOrg, setHasOrg] = React.useState(false);
    const isFocused = useIsFocused();
    const {setIsLoading} = useLoad();

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

    // because users are first directed here on sign in, we check if they are part of an org
    useEffect(() => {
        if(isFocused){
            checkUserOrg();
        }
      }, [isFocused]);
      async function checkUserOrg() {
        try {
            const user = await Auth.currentAuthenticatedUser();
            console.log('Drawer user: ', user.attributes);
            setUsername(user.attributes.name);
            // check if there was a previous org session
            const key = user.attributes.sub + ' currOrg';
            const org = await AsyncStorage.getItem(key);
            const orgJSON = JSON.parse(org);
            const orgUserStorages = await DataStore.query(OrgUserStorage, (c) => c.user.userId.eq(user.attributes.sub));
            if(org == null){
                // check if the user is part of an org from a previous device
                if(orgUserStorages.length <= 0){
                    setHasOrg(false);
                    navigation.navigate('JoinOrCreate');
                    return;
                }
                setHasOrg(true);
                navigation.navigate('MyOrgs');
            }
            else{
                setHasOrg(true);
                navigation.navigate('MemberTabs', {currOrg: orgJSON});
            }
        } catch (error) {
            console.log('error getting user: ', error);
            Alert.alert('Drawer Error', error.message, [{text: 'OK'}]);
            navigation.navigate('Home');
        }
      }
    
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
            setIsLoading(true);
            await Auth.signOut();
            setIsLoading(false);
            navigation.navigate('Home'); // Navigate to the home screen
        } catch (error) {
            setIsLoading(false);
            console.log('error signing out: ', error);
            Alert.alert('Sign Out Error!', 'Error signing out. Please try again.', [{text: 'OK'}]);
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
                {hasOrg ? <DrawerItem label="Curr Org" onPress={() => {navigation.navigate('MemberTabs')}}/> : null}
                <DrawerItem label="My Orgs" onPress={() => {navigation.navigate('MyOrgs')}}/>
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
            headerTitleStyle: {
                fontSize: 28,
                fontWeight: 'bold',
                color: '#791111'
            },
            headerTitle: 'Dougu',
        })}
        drawerContent={(props) => <CustomDrawerContent {...props}/>}>
            <Drawer.Screen name="MemberTabs" component={MemberTabs}/>
            <Drawer.Screen name="JoinOrg" component={JoinOrgScreen}/>
            <Drawer.Screen name="CreateOrg" component={CreateOrgScreen}/>
            <Drawer.Screen name="Access Code" component={AccessCodeScreen}/>
            <Drawer.Screen name="MyOrgs" component={MyOrgsScreen}/>
            <Drawer.Screen name="JoinOrCreate" component={JoinOrCreateScreen}/>
        </Drawer.Navigator>
    );
};

export default DrawerNav;

const styles = StyleSheet.create({
    header: {
        justifyContent: 'center',
        height: '10%',
        borderBottomColor: 'grey',
        borderBottomWidth: 0.5,
    },
    headerText: {
        fontSize: 18,
        left: 20,
    },
    listContainer: {
        height: '80%',
    },
    footer: {
        height: '10%',
        justifyContent: 'center',
        borderTopColor: 'grey',
        borderTopWidth: 0.5,
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