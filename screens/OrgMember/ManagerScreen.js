import React, {useEffect, useState} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Auth } from 'aws-amplify';

function ManagerScreen({navigation}) {
  const [orgName, setOrgName] = useState('');
  const [accessCode, setAccessCode] = useState('');

  // get the accesscode and orgName
  useEffect(() => {
    getOrgInfo();
  }, []);

  async function getOrgInfo() {
    const user = await Auth.currentAuthenticatedUser();
    const key = user.attributes.sub + ' currOrg';
    const org = await AsyncStorage.getItem(key);
    if(org == null){
      return;
    }
    const orgJSON = JSON.parse(org);
    setOrgName(orgJSON.name);
    setAccessCode(orgJSON.accessCode);
  }

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/asayake.png')} style={styles.circleImage}/>
      <View style={styles.nonBtnRow}>
        <Text style={[styles.rowHeader, {flex: 2}]}>Name</Text>
        <Text style={{flex: 3}}>{orgName}</Text>
      </View>
      <View style={styles.nonBtnRow}>
        <Text style={[styles.rowHeader, {flex: 2}]}>Access Code</Text>
        <Text style={{flex: 3}}>{accessCode}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.rowHeader}>Members</Text>
        <TouchableOpacity style={styles.rightArrow}>
          <Text>Manage Members</Text>
          <AntDesign name="right" size={20} />
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <Text style={styles.rowHeader}>Storages</Text>
        <TouchableOpacity style={styles.rightArrow}>
          <Text>Manage Storagse</Text>
          <AntDesign name="right" size={20} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.equipmentBtn} onPress={() => navigation.navigate('ManageEquipment')}>
        <Text style={styles.eBtnText}>Manage Equipment</Text>
      </TouchableOpacity>
    </View>
  );
}

export default ManagerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  circleImage: {
    width: 100,
    height: 100,
    borderRadius: 100/2,
    marginTop: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    margin: 20,
  },
  rowHeader: {
    fontWeight: 'bold',
    flex: 2,
  },
  nonBtnRow: {
    flexDirection: 'row',
    width: '90%',
    margin: 20,
  },
  rightArrow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '50%',
    flex: 3,
  },
  equipmentBtn: {
    backgroundColor: '#EEEEEE',
    height: 50,
    width: '50%',
    justifyContent: 'center',
    borderRadius: 10,
  },
  eBtnText: {
    alignSelf: 'center',
    fontWeight: 'bold',
  }
});