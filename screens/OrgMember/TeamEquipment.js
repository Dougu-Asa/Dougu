import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import MainStyle from '../../styles/MainStyle';
import React from 'react';
import { useUserOrg } from '../../components/UserOrgProvider';

function TeamEquipmentScreen(){
    const { currOrg } = useUserOrg();

    return (
        <View style={MainStyle.container}>
            <Text>Temp</Text>
            <Text>Team Equipment!</Text>
            <StatusBar style="auto" />
        </View>
    );
};
// <Text>{currOrg.name}</Text>

export default TeamEquipmentScreen;