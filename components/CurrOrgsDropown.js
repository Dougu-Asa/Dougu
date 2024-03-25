import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { Auth } from 'aws-amplify';
import { DataStore } from '@aws-amplify/datastore';
import { OrgUserStorage, Organization } from '../src/models';

const CurrOrgsDropdown = () => {
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [orgNames, setOrgNames] = useState([]);

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
      getOrgs();
    });
  }

  async function getOrgs() {
    const user = await Auth.currentAuthenticatedUser();
    let orgs = await DataStore.query(Organization, (c) => c.UserOrStorages.user.userId.eq(user.attributes.sub));
    const orgNames = orgs.map((org, index) => ({
      label: org['name'],
      value: String(index)  // Convert index to string and start counting from 1
    }));
    setOrgNames(orgNames);
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