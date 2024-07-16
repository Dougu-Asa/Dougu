import { createDrawerNavigator, DrawerItem } from '@react-navigation/drawer';
import { TouchableOpacity, Text, View, StyleSheet, Image, Alert} from 'react-native';
import { Auth } from 'aws-amplify';
import { useEffect} from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { DataStore } from '@aws-amplify/datastore';

// project imports
import JoinOrgScreen from './JoinOrgScreen';
import CreateOrgScreen from './CreateOrgScreen';
import AccessCodeScreen from './AccessCodeScreen';
import MyOrgsScreen from './MyOrgsScreen';
import MemberTabs from './member/MemberTabs';
import JoinOrCreateScreen from './JoinOrCreateScreen';
import { useLoad } from '../helper/LoadingContext';
import { OrgUserStorage } from '../models';
import { useUser } from '../helper/UserContext';
import { handleError } from '../helper/Error';

/* 
    DrawerNav is the main form of navigation for the app.
    It separates the groupings of what a user can navigate
    when logged in, and checks if the user is part of an org
    to direct them to the correct screen.
*/
function DrawerNav({navigation}) {
    const Drawer = createDrawerNavigator();
    const insets = useSafeAreaInsets();
    const isFocused = useIsFocused();
    const {setIsLoading} = useLoad();
    const {user, org, setOrg, resetContext} = useUser();

    // because users are first directed here on sign in, we check if they are part of an org
    useEffect(() => {
        if(isFocused){
            checkUserOrg();
        }
      }, [isFocused]);

    /* Helper function that checks if the user is part of an org
    We do this so users can automatically be directed to their
    organization if they have one */
    async function checkUserOrg() {
        try {
            const key = user.attributes.sub + ' currOrg';
            const org = await AsyncStorage.getItem(key);
            const orgJSON = JSON.parse(org);
            const orgUserStorages = await DataStore.query(OrgUserStorage, (c) => c.user.userId.eq(user.attributes.sub));
            // check if there was a previous org session
            if(orgJSON != null){
                setOrg(orgJSON);
                navigation.navigate('MemberTabs', {currOrg: orgJSON});
            }
            // check if user has an orgUserStorage (from previous devices)
            else if(orgUserStorages != null && orgUserStorages.length > 0){
                navigation.navigate('MyOrgs');
            }
            // user has no org and no previous org
            else{
                navigation.navigate('JoinOrCreate');   
            }
        } catch (error) {
            handleError("checkUserOrg", error);
        }
    }
    
    //Left profile icon
    const MyHeaderProfileButton = ({navigation}) => {
        return (
            <TouchableOpacity style={styles.profile} onPress={() => navigation.toggleDrawer()}>
                <Image source={require('../assets/miku.jpg')} style={styles.circleImage}/>
            </TouchableOpacity>
        );
    };

    // Helper function that signs out the user
    async function signOut() {
        try {
            setIsLoading(true);
            await Auth.signOut();
            setIsLoading(false);
            navigation.navigate('Home');
            resetContext();
        } catch (error) {
            handleError("signOut", error, setIsLoading);
        }
    }

    // Check if there is a current org when the user clicks on the current org button
    function handleCurrOrgNav(){
        if(org == null){
            Alert.alert('No Current Organization', 'You must set an organization to view this.', [{text: 'OK'}]);
        }
        else{
            navigation.navigate('MemberTabs');
        }
    }
      
    // Create a custom drawer component to override default
    // react navigation drawer
    function CustomDrawerContent({navigation, ...props}) {
    return (
        <View style={{
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
            flex: 1,
            height: '100%',
          }}>
            <View style={styles.header}>
                <Text style={styles.headerText}>{user.attributes.name}</Text>
            </View>
            <View style={styles.listContainer}>
                <DrawerItem label="Current Org" onPress={() => {handleCurrOrgNav()}}/>
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
        initialRouteName="MyOrgs"
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