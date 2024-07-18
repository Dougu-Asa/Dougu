import { createDrawerNavigator } from '@react-navigation/drawer';
import { TouchableOpacity, Image, Alert, StyleSheet} from 'react-native';
import { useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { DataStore } from '@aws-amplify/datastore';

// project imports
import JoinOrgScreen from './JoinOrgScreen';
import CreateOrgScreen from './CreateOrgScreen';
import AccessCodeScreen from './AccessCodeScreen';
import MyOrgsScreen from './MyOrgsScreen';
import MemberTabs from '../member/MemberTabs';
import JoinOrCreateScreen from './JoinOrCreateScreen';
import { OrgUserStorage } from '../../models';
import { useUser } from '../../helper/UserContext';
import { handleError } from '../../helper/Error';
import { DrawerNavProps, MyHeaderProfileButtonProps, DrawerParamList } from '../../types/NavigationTypes';
import { CustomDrawerContent } from '../../components/drawer/CustomDrawerContent';

/* 
    DrawerNav is the main form of navigation for the app.
    It separates the groupings of what a user can navigate
    when logged in, and checks if the user is part of an org
    to direct them to the correct screen.
*/
function DrawerNav({navigation}: DrawerNavProps) {
    const Drawer = createDrawerNavigator<DrawerParamList>();
    const isFocused = useIsFocused();
    const {user, setOrg} = useUser();

    // because users are first directed here on sign in, we check if they are part of an org
    useEffect(() => {
        if(isFocused){
            checkUserOrg();
        }
    }, [isFocused]);

    // ensure user isn't null
    if(!user){
        Alert.alert("Error", "User is null, please sign in again", [{ text: 'OK' }], { cancelable: false });
        navigation.navigate('Home');
        return null;
    }

    /* Helper function that checks if the user is part of an org
    We do this so users can automatically be directed to their
    organization if they have one */
    async function checkUserOrg() {
        try {
            const key = user!.attributes.sub + ' currOrg';
            const org = await AsyncStorage.getItem(key);
            const orgUserStorages = await DataStore.query(OrgUserStorage, (c) => c.user.userId.eq(user!.attributes.sub));
            // check if there was a previous org session
            if(org != null){
                const orgJSON = JSON.parse(org);
                setOrg(orgJSON);
                //navigation.navigate('MemberTabs');
                navigation.navigate('DrawerNav', {
                    screen: 'MemberTabs',
                    params: {
                      screen: 'Equipment',
                    },
                });
            }
            // check if user has an orgUserStorage (from previous devices)
            else if(orgUserStorages != null && orgUserStorages.length > 0){
                navigation.navigate('DrawerNav', {screen: 'MyOrgs'});
            }
            // user has no org and no previous org
            else{
                navigation.navigate('DrawerNav', {screen: 'JoinOrCreate'});
            }
        } catch (error) {
            handleError("checkUserOrg", error as Error, null);
        }
    }
    
    //Left profile icon
    const MyHeaderProfileButton = ({navigation}: MyHeaderProfileButtonProps) => {
        return (
            <TouchableOpacity style={styles.profile} onPress={() => navigation.toggleDrawer()}>
                <Image source={require('../../assets/miku.jpg')} style={styles.circleImage}/>
            </TouchableOpacity>
        );
    };

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
            <Drawer.Screen name="AccessCode" component={AccessCodeScreen}/>
            <Drawer.Screen name="MyOrgs" component={MyOrgsScreen}/>
            <Drawer.Screen name="JoinOrCreate" component={JoinOrCreateScreen}/>
        </Drawer.Navigator>
    );
};

export default DrawerNav;

const styles = StyleSheet.create({
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