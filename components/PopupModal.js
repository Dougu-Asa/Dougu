import React from 'react';
import {Modal, Text, Pressable, View, StyleSheet} from 'react-native';

// This component is a popup modal that displays a message to the user
const PopupModal = ({modalVisible, setModalVisible, text}) => {
    if(!modalVisible){
        return null;
    }
    return (
        <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}>
            <View style={popUp.centeredView}>
            <View style={popUp.modalView}>
                <Text style={popUp.modalText}>{text}</Text>
                <Pressable
                style={[popUp.button, popUp.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}>
                <Text style={popUp.textStyle}>Ok</Text>
                </Pressable>
            </View>
            </View>
        </Modal>
    );
};

const popUp = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 22,
    },
    modalView: {
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      width: '80%',
      height: '40%',
    },
    button: {
      borderRadius: 20,
      padding: 10,
      elevation: 2,
    },
    buttonOpen: {
      backgroundColor: '#F194FF',
    },
    buttonClose: {
      backgroundColor: '#2196F3',
    },
    textStyle: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    modalText: {
      marginBottom: 15,
      textAlign: 'center',
    },
  });

export default PopupModal;