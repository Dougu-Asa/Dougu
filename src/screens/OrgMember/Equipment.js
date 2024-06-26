import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { Auth } from 'aws-amplify';
import { DataStore } from '@aws-amplify/datastore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';

// Project imports
import { Equipment, OrgUserStorage, UserOrStorage } from '../../models';
import EquipmentItem from '../../components/EquipmentItem';

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
      const orgUserStorage = await DataStore.query(OrgUserStorage, (c) => c.and(c => [
        c.organization.id.eq(orgJSON.id),
        c.user.userId.eq(user.attributes.sub),
        c.type.eq(UserOrStorage.USER),
      ]));
      const equipment = await DataStore.query(Equipment, (c) => c.assignedTo.id.eq(orgUserStorage[0].id));
      const equipmentData = processEquipmentData(equipment);
      const groupedEquipment = chunkedEquipment(equipmentData, 3);
      setEquipment(groupedEquipment);
    }

    // get duplicates and merge their counts
    function processEquipmentData(equipment) {
      const equipmentMap = new Map();
    
      equipment.forEach((equip) => {
        if (equipmentMap.has(equip.name)) {
          const existingEquip = equipmentMap.get(equip.name);
          existingEquip.count += 1; // Increment the count
          existingEquip.data.push(equip.id); // Add the equipment to the data array
          equipmentMap.set(equip.name, existingEquip); // Update the Map
        } else {
          equipmentMap.set(equip.name, {
            id: equip.id, 
            label: equip.name,
            count: 1,
            data: [equip.id],
          });
        }
      });
    
      // Convert the Map back to an array
      const processedEquipmentData = Array.from(equipmentMap.values());
      return processedEquipmentData;
    }  

    // Function to chunk the equipment array into subarrays of 2 items each
  const chunkedEquipment = (equipment, size) =>
  equipment.reduce((acc, _, i) => i % size ? acc : [...acc, equipment.slice(i, i + size)], []);

  return (
    <View style={{backgroundColor: 'white', width: '100%', height: '100%'}}>
      <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>My Equipment</Text>
        {equipment.map((group, index) => (
        <View key={index} style={styles.equipmentRow}>
          {group.map((equip) => (
            <EquipmentItem key={equip.id} item={equip} />
          ))}
        </View>
        ))}
      </View>
      </ScrollView>
    </View>
  );
};

export default EquipmentScreen;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },  
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    color: '#000',
  },
  equipmentRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '90%', // Adjust width as needed
    marginBottom: 20, // Adjust spacing between rows as needed
  },
});
