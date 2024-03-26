import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import ProfileComponent from '../../components/ProfileComponent';
import { Auth } from 'aws-amplify';
import Equipment from '../../components/Equipment';

function SwapEquipmentScreen(){
    [userName, setUserName] = useState('');

    useEffect(() => {
        getUser();
    }, []);

    getUser = async () => {
        const user = await Auth.currentAuthenticatedUser();
        setUserName(user.attributes.name);
    };

    handleSwap = () => {
        console.log("Swapping equipment");
    };

    return (
        <View style={styles.container}>
            <ProfileComponent />
            <View style={styles.userStorage}>
                <Text>{userName}</Text>
                <Equipment />
            </View>
            <TouchableOpacity
                style={styles.swapBtnContainer}
                onPress={handleSwap}
                accessibilityLabel="Learn more about this purple button"
            >
                <Text>Swap</Text>
            </TouchableOpacity>
            <View style={styles.userStorage}>
                <Text>Person 2</Text>
                <Equipment />
            </View>
        </View>
    );
};

export default SwapEquipmentScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
    },
    userStorage: {
        flex: 1,
        backgroundColor: 'lightblue',
        width: '100%',
        borderTopWidth: 1,
        borderBottomWidth: 1,
    },
    swapBtnContainer: {
        position: 'absolute',
        backgroundColor: '#841584',
        width: 80,
        height: 50,
        zIndex: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
});