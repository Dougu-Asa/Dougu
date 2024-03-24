const PopupModal = ({ children, isOpen, onClose }) => {

    return 
    <Modal
    animationType="slide"
    transparent={true}
    visible={modalVisible}
    onRequestClose={() => {
      Alert.alert('Modal has been closed.');
      setModalVisible(!modalVisible);
    }}>
    <View style={styles.centeredView}>
      <View style={styles.modalView}>
        <Text style={styles.modalText}>{errorMsg}</Text>
        <Pressable
          style={[styles.button, styles.buttonClose]}
          onPress={() => setModalVisible(!modalVisible)}>
          <Text style={styles.textStyle}>Ok</Text>
        </Pressable>
      </View>
    </View>
  </Modal>
};