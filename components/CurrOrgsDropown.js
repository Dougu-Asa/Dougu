import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { Auth } from 'aws-amplify';
import { DataStore } from '@aws-amplify/datastore';
import { OrgUserStorage, Organization, User } from '../src/models';
import { useUserOrg } from './UserOrgProvider';
import { useNavigation } from '@react-navigation/native';


const CurrOrgsDropdown = () => {
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [orgNames, setOrgNames] = useState([]);
  const {setCurrOrg, setCurrOrgUserStorage } = useUserOrg();
  const navigation = useNavigation();

  // useEffect 
  useEffect(() => {
    subscribeToChanges();
  }, []);

  async function subscribeToChanges() {
    // Query for the organizations that the user is a part of
    DataStore.observeQuery(
      OrgUserStorage,
    ).subscribe(snapshot => {
      const { items, isSynced } = snapshot;
      console.log(`[Snapshot] item count: ${items.length}, isSynced: ${isSynced}`);
      getOrgs({navigation});
    });
  }

  async function getOrgs() {
    const user = await Auth.currentAuthenticatedUser();
    let orgs = await DataStore.query(Organization, (c) => c.UserOrStorages.user.userId.eq(user.attributes.sub));
    const orgNames = orgs.map(org => ({
      label: org['name'],
      value: org['name']  // Convert index to string and start counting from 1
    }));
    setOrgNames(orgNames);
  }

  setAndNavigate = async (orgName) => {
    const user = await Auth.currentAuthenticatedUser();
    console.log('orgName: ', orgName);
    const org = await DataStore.query(Organization, (c) => c.name.eq(orgName));
    console.log('org: ', org[0]);
    setCurrOrg(org[0]);
    const orgUserStorage = await DataStore.query(OrgUserStorage, (c) => c.and(c => [
      c.organization.name.eq(orgName),
      c.user.userId.eq(user.attributes.sub)
    ]));
    console.log('orgUserStorage: ', orgUserStorage[0]);
    setCurrOrgUserStorage(orgUserStorage[0]);
    navigation.navigate('DrawerNav');
  }

  return (
    <Dropdown
      style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
      placeholderStyle={styles.placeholderStyle}
      selectedTextStyle={styles.selectedTextStyle}
      data={orgNames}
      labelField="label"
      valueField="value"
      placeholder={'Select Your Organization'}
      value={value}
      onFocus={() => setIsFocus(true)}
      onBlur={() => setIsFocus(false)}
      onChange={item => {
        setValue(item.value);
        setIsFocus(false);
        setAndNavigate(item.value);
      }}
      autoScroll={false}
    />
  );
};

export default CurrOrgsDropdown;

const styles = StyleSheet.create({
  dropdown: {
    width: '100%',
    height: '100%',
  },
  placeholderStyle: {
    fontSize: 16,
    textAlign: 'center',
  },
  selectedTextStyle: {
    fontSize: 16,
    textAlign: 'center',
  }
});