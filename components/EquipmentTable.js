import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import { Auth, DataStore } from 'aws-amplify';
import { Equipment, OrgUserStorage, User, Storage, Organization } from '../src/models';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class EquipmentTable extends Component {
  constructor(props) {
    super(props);
    const equipmentData = this.getEquipment();
    this.subscribeToChanges();
    this.state = {
      tableHead: ['Name', 'Assigned To', 'Quantity', ''],
      tableData: [],
    }
  }

  componentDidMount() {
    this.getEquipment().then((equipmentData) => {
      this.setState({
        tableData: equipmentData,
      });
    });
  }

  // subscribe to changes in equipment
  async subscribeToChanges() {
    DataStore.observeQuery(Equipment).subscribe(snapshot => {
      const { items, isSynced } = snapshot;
      console.log(`table [Snapshot] item count: ${items.length}, isSynced: ${isSynced}`);
      this.getEquipment().then((equipmentData) => {
        this.setState({
          tableData: equipmentData,
        });
      });
    })};

  // get all the equipment that belongs to an org
  async getEquipment() {
    const user = await Auth.currentAuthenticatedUser();
    const key = user.attributes.sub + ' currOrg';
    const org = await AsyncStorage.getItem(key);
    if(org == null){
        return;
    };
    const orgJSON = JSON.parse(org);
    const equipment = await DataStore.query(Equipment, (c) => c.organization.id.eq(orgJSON.id));
    const equipmentData = await Promise.all(equipment.map(async (equip) => {
      let assignedTo = await DataStore.query(OrgUserStorage, (c) => c.equipment.id.eq(equip.id));
      return {
        id: equip.id,
        name: equip.name,
        quantity: 1,
        assignedTo: assignedTo[0].id,
        assignedToName: assignedTo[0].name,
      };
    })); 
    return equipmentData;
  };

  handleDelete = async (rowData) => {
    // delete equipment
    const equipment = await DataStore.query(Equipment, rowData.id);
    await DataStore.delete(equipment);
    Alert.alert("Equipment Deleted");
  }

  // make sure the owner wants to delete the equipment
  handleEdit = (rowData) => {
    Alert.alert(
      "Delete Equipment",
      "Would you like to delete this equipment?",
      [
        {
          text: "Delete",
          onPress: () => this.handleDelete(rowData),
          style: "destructive",
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ]
    );
  }

  render() {
    return (
      <View style={styles.table}>
        <View style={styles.row}>
          <Text style={[styles.headerText, {flex: 8}]}>{this.state.tableHead[0]}</Text>
          <Text style={[styles.headerText, {flex: 10}]}>{this.state.tableHead[1]}</Text>
          <Text style={[styles.headerText, {flex: 3}]}>{this.state.tableHead[2]}</Text>
          <Text style={[styles.headerText, {flex: 1}]}>{this.state.tableHead[3]}</Text>
        </View>
        <ScrollView>
        {
          this.state.tableData.map((rowData, index) => (
            <View key={index} style={styles.row}>
              <View style={[styles.cell, {flex: 8}]}>
                <Text>{rowData.name}</Text>
              </View>
              <View style={[styles.cell, {flex: 10}]}>
                <Text>{rowData.assignedToName}</Text>
              </View>
              <View style={[styles.cell, {flex: 3}]}>
                <Text>{rowData.quantity}</Text>
              </View>
              <TouchableOpacity style={styles.icon} onPress={() => this.handleEdit(rowData)}>
                <Entypo name="dots-three-vertical" size={20} />
              </TouchableOpacity>
            </View>
          ))
        }
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  table: {
    flex: 1,
    width: '100%',
    borderWidth: 1,
  },
  row: {
    flexDirection: 'row',
    width: '100%',
    minHeight: 50,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  headerText: {
    padding: 10,
    fontWeight: 'bold',
    fontSize: 8,
    color: 'gray',
  }, 
  cell: {
    marginLeft: 10,
    justifyContent: 'center',
  },
  icon: {
    justifyContent: 'center',
    marginRight: 5,
  }
});