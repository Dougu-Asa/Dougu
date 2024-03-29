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
    if(isFocused){
      subscribeToChanges();
    }
  }, [isFocused]);



  async function subscribeToChanges() {
    // Query for the organizations that the user is a part of
    DataStore.observeQuery(
      OrgUserStorage,
    ).subscribe(snapshot => {
      const { items, isSynced } = snapshot;
      console.log(`[Snapshot] item count: ${items.length}, isSynced: ${isSynced}`);
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
    let users;
    if(isCreate){
      users = await DataStore.query(User, (c) => c.organizations.organization.name.eq(orgJSON.name));
    }
    else{
      users = await DataStore.query(User, (c) => c.and(c => [
        c.organizations.organization.name.eq(orgJSON.name),
        c.userId.ne(user.attributes.sub)
      ]));
    }
    const userNames = users.map(user => ({
      label: user['name'],
      value: user['name'], 
      data: user,
    }));
    setUserNames(userNames);
  }

  async function handleChangeUser(value) {
    if(isCreate){
      setUser(value);
    }
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