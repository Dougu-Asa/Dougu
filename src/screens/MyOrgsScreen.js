import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { DataStore } from '@aws-amplify/datastore';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { OrgUserStorage, Organization, User } from '../models';
import { useUser } from '../helper/UserContext';

/*
  This screen will display the organizations that the user is a part of.
  The user can select an organization to open the MemberTabs for that organization.
*/
const MyOrgsScreen = ({navigation}) => {
  const [orgNames, setOrgNames] = useState([]);
  const { user, setOrg} = useUser();

  // useEffect to keep orgNames up to date
  useEffect(() => {
    const subscription = DataStore.observeQuery(OrgUserStorage).subscribe(snapshot => {
      const { items, isSynced } = snapshot;
      console.log(`MyOrgsScreen OrgUserStorage item count: ${items.length}, isSynced: ${isSynced}`);
      getOrgs();
    });

    return () => subscription.unsubscribe();
  }, []);

  // get the organizations that the user is a part of
  async function getOrgs() {
    let orgs = await DataStore.query(Organization, (c) => c.UserOrStorages.user.userId.eq(user.attributes.sub));
    const orgData = orgs.map((org, index) => ({
      label: org['name'],
      value: index,
    }));
    setOrgNames(orgData);
  }

  // set the current organization and navigate to the MemberTabs
  const setAndNavigate = async (orgName) => {
    const org = await DataStore.query(Organization, (c) => c.name.eq(orgName));
    // AsyncStorage helps us keep track of previous sessions on the device
    const key = user.attributes.sub + ' currOrg';
    await AsyncStorage.setItem(key, JSON.stringify(org[0]));
    setOrg(org[0]);
    navigation.navigate('MemberTabs');
  }

  const orgItem = ({ item }) => (
    <TouchableOpacity onPress={() => setAndNavigate(item.label)} style={styles.orgContainer}>
      <Text>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={orgNames}
      renderItem={orgItem}
      keyExtractor={item => item.value}
    />
  );
};

export default MyOrgsScreen;

const styles = StyleSheet.create({
  orgContainer: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: '#777777',
    borderRadius: 5,
  }
});
