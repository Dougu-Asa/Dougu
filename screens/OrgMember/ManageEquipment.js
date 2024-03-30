import React, { useState, useEffect, Component } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EquipmentTable from '../../components/EquipmentTable';

const ManageEquipmentScreen = ({navigation}) => {

  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Manage Equipment</Text>
          <TouchableOpacity onPress={() => navigation.navigate('CreateEquipment')}>
            <Ionicons name="add" size={40} style={styles.addIcon} />
          </TouchableOpacity>
        </View>
        <EquipmentTable />
      </View>
    </View>
  );
};
export default ManageEquipmentScreen;

const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  addIcon: {
    backgroundColor: '#f4f4f4',
    borderRadius: 10,
    marginLeft: 30,
  },
});