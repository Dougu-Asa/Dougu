import React, {useEffect, useState} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Auth } from 'aws-amplify';

function InfoScreen({navigation}) {
  const [orgName, setOrgName] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [isManager, setIsManager] = useState(false);

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
    if(orgJSON.organizationManagerUserId == user.attributes.sub){
      setIsManager(true);
    };
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
          <Text>View Members</Text>
          <AntDesign name="right" size={20} />
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <Text style={styles.rowHeader}>Storages</Text>
        <TouchableOpacity style={styles.rightArrow}>
          <Text>View Storages</Text>
          <AntDesign name="right" size={20} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.equipmentBtn} onPress={() => navigation.navigate('ManageEquipment', {isManager: isManager})}>
        <Text style={styles.eBtnText}>Equipment List</Text>
      </TouchableOpacity>
    </View>
  );
}

export default InfoScreen;

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