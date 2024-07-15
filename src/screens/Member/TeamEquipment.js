import { Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { Auth } from 'aws-amplify';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import { DataStore } from '@aws-amplify/datastore';
import { ScrollView } from 'react-native-gesture-handler';
import { useIsFocused } from '@react-navigation/native';

// project imports
import { OrgUserStorage, Equipment } from '../../models';
import UserEquipment from '../../components/member/UserEquipment';

function TeamEquipmentScreen(){
    const [orgEquipment, setOrgEquipment] = useState([]);
    const [orgUserStorages, setOrgUserStorages] = useState([]);
    const isFocused = useIsFocused();

    useEffect(() => {
        subscribeToChanges();
    }, []);

    useEffect(() => {
        if(isFocused){
            getOrgEquipment();
        }
    }, [isFocused]);

    async function subscribeToChanges() {
        DataStore.observeQuery(Equipment).subscribe(snapshot => {
            const { items, isSynced } = snapshot;
            console.log(`teamEquipment [Snapshot] item count: ${items.length}, isSynced: ${isSynced}`);
            getOrgEquipment();
        });
      }

    async function getOrgEquipment() {
        const user = await Auth.currentAuthenticatedUser();
        const key = user.attributes.sub + ' currOrg';
        const org = await AsyncStorage.getItem(key);
        if(org == null){
            return;
        };
        const orgJSON = JSON.parse(org);
        const orgUserStorages = await DataStore.query(OrgUserStorage, (c) => c.organization.id.eq(orgJSON.id));
        // get the names of each orgUserStorage
        const orgUserStorageNames = orgUserStorages.map((orgUserStorage) => ({
            id: orgUserStorage.id,
            name: orgUserStorage.name,
        }));
        setOrgUserStorages(orgUserStorageNames);
        let equipment = [];
        for(let i = 0; i < orgUserStorages.length; i++){
            const userEquipment = await DataStore.query(Equipment, (c) =>
            c.assignedTo.id.eq(orgUserStorages[i].id));
            const processedEquipment = processEquipmentData(userEquipment);
            equipment.push(processedEquipment);
        }
        setOrgEquipment(equipment);
    }

    // get duplicates and merge their counts
    function processEquipmentData(equipment) {
        const equipmentMap = new Map();
      
        equipment.forEach((equip) => {
          if (equipmentMap.has(equip.name)) {
            const existingEquip = equipmentMap.get(equip.name);
            existingEquip.count += 1; 
            existingEquip.data.push(equip.id); 
            equipmentMap.set(equip.name, existingEquip); 
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
    
    return (
        <View style={{backgroundColor: 'white', minHeight: '100%'}}>
            <ScrollView>
            {orgEquipment.map((equipmentRow, index) => (
            <UserEquipment key={index} list={equipmentRow} name={orgUserStorages[index] ? orgUserStorages[index].name : null} />
            ))}
            </ScrollView>
        </View>
    );
};

export default TeamEquipmentScreen;