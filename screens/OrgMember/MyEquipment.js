import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import MainStyle from '../../styles/MainStyle';
import React from 'react';

function MyEquipmentScreen(){
    return (
        <View style={MainStyle.container}>
            <Text>My Equipment!</Text>
            <StatusBar style="auto" />
        </View>
    );
};

export default MyEquipmentScreen;