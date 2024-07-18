import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import React from "react";
import { useEffect, useState } from "react";
import { Auth, DataStore } from "aws-amplify";
import AsyncStorage from "@react-native-async-storage/async-storage";

// project imports
import { useLoad } from "../../helper/LoadingContext";
import {
  User,
  OrgUserStorage,
  Equipment,
  Organization,
  UserOrStorage,
} from "../../models";

export default function CreateStorageScreen({ navigation }) {
  const [name, onChangeName] = useState("");
  const [details, onChangeDetails] = useState("");
  const { setIsLoading } = useLoad();

  async function handleCreate() {
    try {
      // check that name isn't empty
      if (name == "") {
        throw new Error("Name must not be empty.");
      }
      setIsLoading(true);
      // create the storage
      const user = await Auth.currentAuthenticatedUser();
      let key = user.attributes.sub + " currOrg";
      const org = await AsyncStorage.getItem(key);
      const orgJSON = JSON.parse(org);
      const dataOrg = await DataStore.query(Organization, orgJSON.id);
      if (dataOrg == null) throw new Error("Organization not found.");
      const storage = await DataStore.save(
        new OrgUserStorage({
          name: name,
          organization: dataOrg,
          type: UserOrStorage.STORAGE,
          details: details,
        }),
      );
      setIsLoading(false);
      Alert.alert("Storage Created Successfully!");
    } catch (error) {
      setIsLoading(false);
      Alert.alert("Create Storage Error!", error.toString());
    }
  }
  return (
    <View style={styles.container}>
      <View style={[styles.rowContainer, { marginTop: 20 }]}>
        <View style={styles.row1}>
          <Text style={styles.rowHeader}>Name</Text>
        </View>
        <View style={styles.row2}>
          <TextInput
            style={styles.input}
            onChangeText={onChangeName}
            value={name}
            placeholder="name"
            keyboardType="default"
          />
        </View>
      </View>

      <View style={styles.rowContainer}>
        <View style={styles.row1}>
          <Text style={styles.rowHeader}>Details</Text>
        </View>
        <View style={styles.row2}>
          <TextInput
            style={styles.details}
            onChangeText={onChangeDetails}
            value={details}
            placeholder="details"
            keyboardType="default"
            multiline={true}
          />
        </View>
      </View>
      <TouchableOpacity style={styles.createBtn} onPress={handleCreate}>
        <Text style={styles.createBtnTxt}> Create </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    height: "100%",
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  details: {
    height: 80,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  row1: {
    flex: 1,
    justifyContent: "center",
  },
  row2: {
    flex: 3,
  },
  rowHeader: {
    fontSize: 14,
    fontWeight: "bold",
    alignSelf: "center",
  },
  createBtn: {
    backgroundColor: "#791111",
    width: "50%",
    padding: 10,
    height: 50,
    alignSelf: "center",
    marginTop: 20,
  },
  createBtnTxt: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
