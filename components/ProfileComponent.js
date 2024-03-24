import React, {useEffect, useState} from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { useModal } from './ModalProvider';
import { Auth } from 'aws-amplify';
import { useNavigation } from '@react-navigation/native';

const ProfileComponent = () => {  
    const { isModalVisible } = useModal();
    const { setIsModalVisible } = useModal();
    const navigation = useNavigation();
    const [user, setUser] = useState(null);

    useEffect(() => {
        checkCurrentUser();
    }, []);

    const checkCurrentUser = async () => {
        try {
            setUser(await Auth.currentAuthenticatedUser());
        } catch (error) {
            console.log("No user is logged in");
        }
    };

    async function signOut() {
        try {
          setIsModalVisible(false);
          await Auth.signOut();
          navigation.navigate('Home'); // Navigate to the home screen
        } catch (error) {
          console.log('error signing out: ', error);
        }
    }

    const goToProfile = () => {
        setIsModalVisible(false);
        navigation.navigate('Profile');
    };

    if(!isModalVisible) {
        return null;
    };
    return (
        <View style={styles.modalContainer}>
            {user ? <Text>{user.attributes.name}</Text> : <Text>Not logged in</Text>}
            <TouchableOpacity onPress={goToProfile}>
                <Text> Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={signOut}>
                <Text>Logout</Text>
            </TouchableOpacity>
        </View>
    );
};

export default ProfileComponent;

const styles = StyleSheet.create({
    modalContainer: {
        position: 'absolute',
        right: 10, 
        top: 10,
        width: 200, 
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 5,
        elevation: 5, // For Android shadow
        shadowColor: '#000', // For iOS shadow
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 3.84,
        zIndex: 100, // Make sure the modal is on top of everything
    },
});