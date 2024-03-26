import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import MainStyle from '../../styles/MainStyle';
import React from 'react';
import ProfileComponent from '../../components/ProfileComponent';

function MyEquipmentScreen(){
    return (
        <View style={MainStyle.container}>
            <ProfileComponent />
            <Text>My Equipment!</Text>
            <StatusBar style="auto" />
        </View>
    );
};

export default MyEquipmentScreen;