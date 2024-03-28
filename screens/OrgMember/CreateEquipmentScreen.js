import { StatusBar } from 'expo-status-bar';
import { Text, View, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import React from 'react';
import { useEffect, useState } from 'react';
import { BackHandler } from 'react-native';
import CurrMembersDropdown from '../../components/CurrMembersDropdown';

function CreateEquipmentScreen({navigation}){
    const [name, onChangeName] = useState('');
    const [quantity, onChangeQuantity] = useState('');
    const [assign, onChangeAssign] = useState('');
    const [details, onChangeDetails] = useState('');


    // Custom so thata back button press goes to the menu
    useEffect(() => {
        const backAction = () => {
        navigation.navigate('Manager');
        return true;
    };

        // Add the backAction handler when the component mounts
        BackHandler.addEventListener('hardwareBackPress', backAction);
        // Remove the backAction handler when the component unmounts
        return () => BackHandler.removeEventListener('hardwareBackPress', backAction);
    }, [navigation]);

    async function handleCreate(){

    };

    return (
        <View>
            <Text>My Equipment!</Text>
            <TextInput
            style={styles.input}
            onChangeText={onChangeName}
            value={name}
            placeholder="name"
            keyboardType="default"
            />
            <Text> Type </Text>
            <TextInput
            style={styles.input}
            onChangeText={onChangeQuantity}
            value={quantity}
            placeholder="quantity"
            keyboardType="default"
            />
            <TextInput
            style={styles.input}
            onChangeText={onChangeDetails}
            value={details}
            placeholder="details"
            keyboardType="default"
            />
            <CurrMembersDropdown />
            <TouchableOpacity onPress={handleCreate}>
                <Text> Create </Text>
            </TouchableOpacity>
        </View>
    );
};

export default CreateEquipmentScreen;

const styles = StyleSheet.create({
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
    },
});