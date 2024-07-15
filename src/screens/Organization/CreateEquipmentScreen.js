import { Text, View, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import React from 'react';
import { useEffect, useState } from 'react';
import { Auth, DataStore } from 'aws-amplify';
import AsyncStorage from '@react-native-async-storage/async-storage';

// my Code
import CurrMembersDropdown from '../../components/CurrMembersDropdown';
import { User, OrgUserStorage, Equipment, Organization } from '../../models';
import { useLoad } from '../../helper/LoadingContext';

function CreateEquipmentScreen({navigation}){
    const [name, onChangeName] = useState('');
    const [quantity, onChangeQuantity] = useState('');
    const [assignUser, setAssignUser] = useState(null);
    const [details, onChangeDetails] = useState('');
    const [selected, setSelected] = useState('equip')
    const {setIsLoading} = useLoad();

    async function handleCreate(){
        try{
            let quantityCt = parseInt(quantity);
            // check that quantity > 1
            if(quantityCt < 1 || isNaN(quantityCt)){
                throw new Error("Quantity must be a number or greater than 0.");
            }
            // check that selected user isn't null
            if(assignUser == null){
                throw new Error("User must be selected.");
            }
            // check that name isn't empty
            if(name == ''){
                throw new Error("Name must not be empty.");
            }
            setIsLoading(true);
            // create the equipment
            const user = await Auth.currentAuthenticatedUser();
            const key = user.attributes.sub + ' currOrg';
            const org = await AsyncStorage.getItem(key);
            const orgJSON = JSON.parse(org);
            const dataOrg = await DataStore.query(Organization, orgJSON.id);
            const orgUserStorage = await DataStore.query(OrgUserStorage, assignUser.id);
            if(dataOrg == null || orgUserStorage == null){
                throw new Error("Organization or User not found.");
            }
            // create however many equipment specified by quantity
            for(let i = 0; i < quantityCt; i++){
                const newEquipment = await DataStore.save(
                    new Equipment({
                        name: name,
                        organization: dataOrg,
                        lastUpdatedDate: new Date().toISOString(),
                        assignedTo: orgUserStorage,
                        details: details
                    })
                );
            }
            setIsLoading(false);
            Alert.alert('Equipment created successfully!');
        }
        catch(error){
            Alert.alert('Create Equipment Error', error.message, [{text: 'OK'}]);
        }
    };

    // ensure the quantity is only a numeric value
    const handleNumberChange = (text) => { 
        if (!isNaN(text)) { 
            onChangeQuantity(text); 
        } 
    }; 

    const handleUserChange = (user) => {
        setAssignUser(user);
    };

    return (
        <View style={styles.container}>
            <View style={styles.rowContainer}>
                <View style={styles.row1}>
                    <Text style={styles.rowHeader}>Name</Text>
                </View>
                <View style={styles.row2}>
                    <TextInput
                    style={styles.input}
                    onChangeText={onChangeName}
                    value={name}
                    placeholder="name"
                    keyboardType="default"
                    />
                </View>
            </View>
            <View style={styles.rowContainer}>
                <View style={styles.row1}>
                    <Text style={styles.rowHeader}>Type</Text>
                </View>
                <View style={styles.row2}>
                    <View style={styles.toggleContainer}>
                    <TouchableOpacity
                        style={[styles.button, selected === 'equip' ? styles.selectedBtn : null]}
                        onPress={() => setSelected('equip')}
                    >
                        <Text style={[styles.buttonText, selected === 'equip' ? styles.selectedText : null]}>
                        Equip
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.button, selected === 'container' ? styles.selectedBtn : null]}
                        onPress={() => setSelected('container')}
                    >
                        <Text style={[styles.buttonText, selected === 'container' ? styles.selectedText : null]}>
                        Container
                        </Text>
                    </TouchableOpacity>
                    </View>
                </View>
            </View>
            <View style={styles.rowContainer}>
                <View style={styles.row1}>
                    <Text style={styles.rowHeader}>Quantity</Text>
                </View>
                <View style={styles.row2}>
                    <TextInput
                    style={styles.input}
                    onChangeText={handleNumberChange}
                    value={quantity}
                    placeholder="quantity"
                    keyboardType="numeric"
                    />
                </View>
            </View>
            <View style={styles.rowContainer}>
                <View style={styles.row1}>
                    <Text style={styles.rowHeader}>Details</Text>
                </View>
                <View style={styles.row2}>
                    <TextInput
                        style={styles.details}
                        onChangeText={onChangeDetails}
                        value={details}
                        placeholder="details"
                        keyboardType="default"
                        multiline={true}
                    />
                </View>
            </View>
            <CurrMembersDropdown setUser={handleUserChange} isCreate={true} />
            <TouchableOpacity style={styles.createBtn} onPress={handleCreate}>
                <Text style={styles.createBtnTxt}> Create </Text>
            </TouchableOpacity>
        </View>
    );
};

export default CreateEquipmentScreen;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        height: '100%',
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
    details: {
        height: 80,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    row1: {
        flex: 1,
        justifyContent: 'center',
    },
    row2: {
        flex: 3,
    },
    rowHeader: {
        fontSize: 14,
        fontWeight: 'bold',
        alignSelf: 'center',
    },
    toggleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    selectedBtn: {
        backgroundColor: '#000000', // Selected background color
    },
    selectedText: {
        color: '#ffffff', // Selected text color
    },
    button: {
        backgroundColor: '#f6f6f6',
        padding: 10,
        borderRadius: 10,
        width: '35%',
    },
    createBtn: {
        backgroundColor: '#791111',
        width: '50%',
        padding: 10,
        height: 50,
        alignSelf: 'center',
        marginTop: 30,
    },
    createBtnTxt: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});