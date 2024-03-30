import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { Auth } from 'aws-amplify';
import { DataStore } from '@aws-amplify/datastore';
import { Equipment } from '../../src/models';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

const EquipmentScreen = ({navigation}) => {
  const [equipment, setEquipment] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    if(isFocused){
      getEquipment();
    }
  }, [isFocused]);

  useEffect(() => {
    subscribeToChanges();
  }, []);

  async function subscribeToChanges() {
    DataStore.observeQuery(Equipment).subscribe(snapshot => {
        const { items, isSynced } = snapshot;
        console.log(`myEquipment [Snapshot] item count: ${items.length}, isSynced: ${isSynced}`);
        getEquipment();
    });
  }

    async function getEquipment() {
      const user = await Auth.currentAuthenticatedUser();
      const key = user.attributes.sub + ' currOrg';
      const org = await AsyncStorage.getItem(key);
      if(org == null){
          return;
      };
      const orgJSON = JSON.parse(org);
      const equipment = await DataStore.query(Equipment, (c) => c.and(c => [
          c.organization.id.eq(orgJSON.id),
          c.assignedTo.user.userId.eq(user.attributes.sub),
      ]));
      const equipmentData = equipment.map((equip, index) => ({
          label: equip['name'],
          value: index,
      }));
      setEquipment(equipmentData);
    }

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.orgContainer}>
      <Text>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Equipment</Text>
      <FlatList
      data={equipment}
      renderItem={renderItem}
      keyExtractor={item => item.value}
      />
    </View>
  );
};

export default EquipmentScreen;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    backgroundColor: '#fff',
  },  
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    color: '#000',
  },
  orgContainer: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: '#777777',
    borderRadius: 5,
  }
});
