import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import MainStyle from '../../styles/MainStyle';
import React from 'react';
import ProfileComponent from '../../components/ProfileComponent';
import { useUserOrg } from '../../components/UserOrgProvider';

function TeamEquipmentScreen(){
    const { currOrg } = useUserOrg();

    return (
        <View style={MainStyle.container}>
            <ProfileComponent />
            <Text>{currOrg.name}</Text>
            <Text>Team Equipment!</Text>
            <StatusBar style="auto" />
        </View>
    );
};

export default TeamEquipmentScreen;