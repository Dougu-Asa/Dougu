import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Auth } from 'aws-amplify';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {LinearGradient} from 'expo-linear-gradient';
import { DataStore } from '@aws-amplify/datastore';
import { OrgUserStorage, User } from '../../src/models';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import { Dimensions } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function UserStorages({route, navigation}) {
    const {tabParam} = route.params;
    const [orgName, setOrgName] = useState('');
    const [manager, setManager] = useState(false);
    const [tab, setTab] = useState('');
    const [currData, setCurrData] = useState([]);
    const [isManager, setIsManager] = useState(false);

    useLayoutEffect(() => {
        navigation.setOptions({
          headerTitle: 'Members and Storages',
        });
    }, [navigation]);

    // check what tab we are on on enter
    useEffect(() => {
        if(tabParam == 'Members') setTab('Members');
        else setTab('Storages');
    }, []);

    // update data whenever tab changes
    useEffect(() => {
        getData();
    }, [tab]);

    async function getData() {
        const user = await Auth.currentAuthenticatedUser();
        const key = user.attributes.sub + ' currOrg';
        const org = await AsyncStorage.getItem(key);
        if(org == null){
            return;
        };
        const orgJSON = JSON.parse(org);
        setOrgName(orgJSON.name);
        const manager = await DataStore.query(User, (c) => c.userId.eq(orgJSON.organizationManagerUserId));
        setManager(manager[0]);
        if(orgJSON.organizationManagerUserId == user.attributes.sub) setIsManager(true);
        let data;
        if(tab === 'Members'){
            data = await DataStore.query(OrgUserStorage, (c) => c.and(c => [
                c.organization.name.eq(orgJSON.name),
                c.user.userId.ne(orgJSON.organizationManagerUserId),
                c.type.eq('USER'),
            ]));
        }
        else {
            data = await DataStore.query(OrgUserStorage, (c) => c.and(c => [
                c.organization.name.eq(orgJSON.name),
                c.type.eq('STORAGE'),
            ]));
        }
        setCurrData(data);
    }
    const handleCreate = async () => {
        if(!isManager){
            Alert.alert('You need to be a manager to create a storage!');
        }
    }

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#791111', '#550c0c']} style={styles.header}>
                <Text style={styles.headerText}>{orgName}</Text>
            </LinearGradient>
            <View style={styles.tab}>
                <TouchableOpacity
                    style={[styles.button, tab === 'Members' ? styles.selectedBtn : null]}
                    onPress={() => setTab('Members')}>
                    <Text style={[styles.buttonText, tab === 'Members' ? styles.selectedText : null]}>
                        Members
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, tab === 'Storages' ? styles.selectedBtn : null]}
                    onPress={() => setTab('Storages')}>
                    <Text style={[styles.buttonText, tab === 'Storages' ? styles.selectedText : null]}>
                        Storages
                    </Text>
                </TouchableOpacity>
            </View>
            <ScrollView style={{width: Dimensions.get('window').width}}>
                {tab === 'Members' ? <MemberRow item={manager} manager={true} /> : null}
                {currData.map((item) => (<MemberRow item={item}/>))}
                {tab === 'Storages' ? 
                <TouchableOpacity style={styles.createBtn} onPress={handleCreate}>
                    <Text style={styles.createBtnTxt}>Create Storage</Text>
                    <MaterialCommunityIcons name="crown" color={'#fff'} size={32}/>
                </TouchableOpacity> : null}
            </ScrollView>
        </View>
    );
}

function MemberRow({item, manager}){
    return (
        <View style={userStorage.row}>
            <FontAwesome name="user-circle" size={32} color="gray" style={userStorage.profile} />
            <View style={userStorage.nameRow}>
                <Text style={userStorage.name}>{item.name}</Text>
                {manager ? <MaterialCommunityIcons name="crown" 
                color={'#791111'} size={32} style={{marginLeft: 10}} /> : null}
            </View>
            <TouchableOpacity style={userStorage.icon} >
                <Entypo name="dots-three-horizontal" size={24} />
              </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    header: {
        width: '90%',
        height: '20%',
        marginVertical: '5%',
        borderRadius: 20,
        justifyContent: 'center',
        alignContent: 'center',
    },
    headerText: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
    },
    tab: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: '100%',
    },
    button: {
        width: '50%',
        padding: 10,
    },
    buttonText: {
        fontSize: 14,
        textAlign: 'center',
        color: '#828282',
    },
    selectedBtn: {
        backgroundColor: '#E0E0E0',
    },
    selectedText: {
        color: 'black',
    },
    createBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '80%',
        height: 50,
        backgroundColor: '#333333',
        alignSelf: 'center',
        borderRadius: 10,
        marginVertical: 10,
    },
    createBtnTxt: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
        marginRight: 10,
    }
});

const userStorage = StyleSheet.create({
    row: {
        flexDirection: 'row',
        width: '100%',
        minHeight: 60,
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
        alignItems: 'center',
    },
    nameRow: {
        flexDirection: 'row',
        flex: 9,
        alignItems: 'center',
    },
    profile: {
        padding: 10,
        flex: 1,
        marginLeft: 10,
    },
    name: {
        fontSize: 14,
        marginLeft: 10,
        fontWeight: 'bold',
    },
    icon: {
        justifyContent: 'center',
        marginRight: 5,
        flex: 1,
        padding: 5,
    },
});