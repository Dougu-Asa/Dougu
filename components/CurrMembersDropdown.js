// dropdown for the current members
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { Auth } from 'aws-amplify';
import { DataStore } from '@aws-amplify/datastore';
import { OrgUserStorage, Organization, User } from '../src/models';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

const CurrMembersDropdown = ({setUser, isCreate}) => {
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [userNames, setUserNames] = useState([]);
  const isFocused = useIsFocused(); 

  // useEffect 
  useEffect(() => {
    subscribeToChanges();
  }, []);

  // check focused
  useEffect(() => {
    if(isFocused){
      getMembers();
    }
  }, [isFocused]);

  async function subscribeToChanges() {
    // Query for the organizations that the user is a part of
    DataStore.observeQuery(
      OrgUserStorage,
    ).subscribe(snapshot => {
      const { items, isSynced } = snapshot;
      console.log(`OrgUserStorage Dropdown [Snapshot] item count: ${items.length}, isSynced: ${isSynced}`);
      getMembers();
    });
  }

  async function getMembers() {
    const user = await Auth.currentAuthenticatedUser();
    const key = user.attributes.sub + ' currOrg';
    const org = await AsyncStorage.getItem(key);
    if(org == null){
      return;
    };
    const orgJSON = JSON.parse(org);
    if(isCreate){
      data = await DataStore.query(OrgUserStorage, (c) => c.organization.name.eq(orgJSON.name));
    }
    else{
      data = await DataStore.query(OrgUserStorage, (c) => c.and(c => [
        c.organization.name.eq(orgJSON.name),
        c.or(c => [
          c.type.eq('STORAGE'),
          c.user.userId.ne(user.attributes.sub),
        ])
      ]));
    }
    const userNames = data.map(user => ({
      label: user['name'],
      value: user['name'], 
      data: user,
    }));
    setUserNames(userNames);
  }

  async function handleChangeUser(value) {
    setUser(value);
  }

  return (
    <Dropdown
      style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
      placeholderStyle={styles.textStyle}
      selectedTextStyle={styles.textStyle}
      data={userNames}
      labelField="label"
      valueField="value"
      placeholder={'Select Member'}
      value={value}
      onFocus={() => setIsFocus(true)}
      onBlur={() => setIsFocus(false)}
      onChange={item => {
        setValue(item.value);
        setIsFocus(false);
        handleChangeUser(item.data);
      }}
      autoScroll={false}
    />
  );
};

export default CurrMembersDropdown;

const styles = StyleSheet.create({
  dropdown: {
    width: 'auto',
    height: 40,
  },
  textStyle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 20,
  }
});