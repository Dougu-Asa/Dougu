import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import React from "react";
import { useState } from "react";
import { DataStore } from "aws-amplify";
import { Tab } from "@rneui/themed";

// project imports
import CurrMembersDropdown from "../../components/CurrMembersDropdown";
import {
  OrgUserStorage,
  Equipment,
  Organization,
  Container,
} from "../../models";
import { useLoad } from "../../helper/LoadingContext";
import { useUser } from "../../helper/UserContext";
import { handleError } from "../../helper/Utils";

/*
  Create equipment screen allows a manager to create equipment
  and assign it to a user/storage.
*/
export default function CreateEquipmentScreen() {
  const [name, onChangeName] = useState("");
  const [quantity, onChangeQuantity] = useState<string>("");
  const [assignUser, setAssignUser] = useState<OrgUserStorage | null>(null);
  const [details, onChangeDetails] = useState("");
  // index 0 is equipment, index 1 is container
  const [index, setIndex] = useState(0);
  const [resetValue, setResetValue] = useState(false);
  const { setIsLoading } = useLoad();
  const { org } = useUser();

  // ensure all input values are valid
  const verifyValues = () => {
    // check that quantity > 1
    const quantityCount = index === 0 ? parseInt(quantity) : 1;
    if (isNaN(quantityCount) || assignUser == null || name === "") {
      throw new Error("Please fill out all fields.");
    }
    if (quantityCount < 1 || quantityCount > 25) {
      throw new Error("You must make between 1 and 25 equipment at a time.");
    }
    return quantityCount;
  };

  const CreateEquipment = async (
    quantityCount: number,
    dataOrg: Organization,
    orgUserStorage: OrgUserStorage,
  ) => {
    // create however many equipment specified by quantity
    for (let i = 0; i < quantityCount; i++) {
      await DataStore.save(
        new Equipment({
          name: name,
          organization: dataOrg,
          lastUpdatedDate: new Date().toISOString(),
          assignedTo: orgUserStorage,
          details: details,
          image: "default",
          group: org!.name,
          containerEquipmentId: null,
        }),
      );
    }
    Alert.alert("Equipment created successfully!");
  };

  const CreateContainer = async (
    dataOrg: Organization,
    orgUserStorage: OrgUserStorage,
  ) => {
    const container = await DataStore.query(Container, (c) =>
      c.and((c) => [
        c.name.eq(name),
        c.organizationContainersId.eq(dataOrg.id),
      ]),
    );
    if (container.length > 0) {
      throw new Error("Container already exists in the organization.");
    }
    // ensure no container with the same name exists
    await DataStore.save(
      new Container({
        name: name,
        organization: dataOrg,
        lastUpdatedDate: new Date().toISOString(),
        assignedTo: orgUserStorage,
        details: details,
        color: "#ffffff",
        group: org!.name,
        equipment: [],
      }),
    );
    Alert.alert("Container created successfully!");
  };

  // Create a new equipment and assign it to a user
  const handleCreate = async () => {
    try {
      setIsLoading(true);
      const quantityCount = verifyValues();
      // find the orgUserStorage to assign to
      const dataOrg = await DataStore.query(Organization, org!.id);
      const orgUserStorage = await DataStore.query(
        OrgUserStorage,
        assignUser!.id,
      );
      if (dataOrg == null || orgUserStorage == null) {
        throw new Error("Organization or User not found.");
      }
      // index 0 is equipment, index 1 is container
      if (index === 0) {
        await CreateEquipment(quantityCount, dataOrg, orgUserStorage);
      } else {
        await CreateContainer(dataOrg, orgUserStorage);
      }
      onChangeName("");
      onChangeQuantity("");
      onChangeDetails("");
      setAssignUser(null);
      setResetValue(true);
      setIsLoading(false);
    } catch (error) {
      handleError("CreateEquipment", error as Error, setIsLoading);
    }
  };

  // update the quantity of equipment
  const handleNumberChange = (text: string) => {
    onChangeQuantity(text);
  };

  // update the user to assign the equipment to
  const handleUserChange = (user: OrgUserStorage | null) => {
    setAssignUser(user);
    setResetValue(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.rowContainer}>
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
          <Text style={styles.rowHeader}>Type</Text>
        </View>
        <View style={styles.row2}>
          <View style={styles.toggleContainer}>
            <Tab
              value={index}
              onChange={setIndex}
              dense
              buttonStyle={(active) =>
                active ? styles.selectedBtn : styles.button
              }
              titleStyle={(active) =>
                active ? styles.selectedText : styles.text
              }
              disableIndicator={true}
            >
              <Tab.Item>Equipment</Tab.Item>
              <Tab.Item>Container</Tab.Item>
            </Tab>
          </View>
        </View>
      </View>
      <View style={styles.rowContainer}>
        <View style={styles.row1}>
          <Text style={styles.rowHeader}>Quantity</Text>
        </View>
        <View style={styles.row2}>
          <TextInput
            style={styles.input}
            onChangeText={handleNumberChange}
            value={index === 0 ? quantity.toString() : "1"}
            placeholder="quantity"
            keyboardType="numeric"
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
      <CurrMembersDropdown
        setUser={handleUserChange}
        isCreate={true}
        resetValue={resetValue}
      />
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
    marginHorizontal: 12,
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
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
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "90%",
    marginHorizontal: "auto",
  },
  selectedBtn: {
    backgroundColor: "#000000",
    padding: 10,
  },
  selectedText: {
    color: "#ffffff",
  },
  text: {
    color: "#000000",
  },
  button: {
    backgroundColor: "#f6f6f6",
    padding: 10,
  },
  createBtn: {
    backgroundColor: "#791111",
    width: "50%",
    padding: 10,
    height: 50,
    alignSelf: "center",
    marginTop: 30,
  },
  createBtnTxt: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
