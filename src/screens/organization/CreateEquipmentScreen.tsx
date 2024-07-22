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

// project imports
import CurrMembersDropdown from "../../components/CurrMembersDropdown";
import { OrgUserStorage, Equipment, Organization } from "../../models";
import { useLoad } from "../../helper/LoadingContext";
import { useUser } from "../../helper/UserContext";
import { handleError } from "../../helper/Error";

function CreateEquipmentScreen() {
  const [name, onChangeName] = useState("");
  const [quantity, onChangeQuantity] = useState<string>("");
  const [assignUser, setAssignUser] = useState<OrgUserStorage | null>(null);
  const [details, onChangeDetails] = useState("");
  const [selected, setSelected] = useState("equip");
  const { setIsLoading } = useLoad();
  const { org } = useUser();

  async function handleCreate() {
    try {
      // check that quantity > 1
      const quantityCount = parseInt(quantity);
      if (quantityCount < 1 || isNaN(quantityCount) || quantityCount > 50) {
        throw new Error(
          "Quantity must be a number or greater than 0 and less than 50.",
        );
      }
      // check that selected user isn't null
      if (assignUser == null) {
        throw new Error("User must be selected.");
      }
      // check that name isn't empty
      if (name === "") {
        throw new Error("Name must not be empty.");
      }
      setIsLoading(true);
      // create the equipment
      const dataOrg = await DataStore.query(Organization, org!.id);
      const orgUserStorage = await DataStore.query(
        OrgUserStorage,
        assignUser.id,
      );
      if (dataOrg == null || orgUserStorage == null) {
        throw new Error("Organization or User not found.");
      }
      // create however many equipment specified by quantity
      for (let i = 0; i < quantityCount; i++) {
        await DataStore.save(
          new Equipment({
            name: name,
            organization: dataOrg,
            lastUpdatedDate: new Date().toISOString(),
            assignedTo: orgUserStorage,
            details: details,
          }),
        );
      }
      setIsLoading(false);
      Alert.alert("Equipment created successfully!");
    } catch (error) {
      handleError("CreateEquipment", error as Error, setIsLoading);
    }
  }

  // ensure the quantity is only a numeric value
  const handleNumberChange = (text: string) => {
    onChangeQuantity(text);
  };

  const handleUserChange = (user: OrgUserStorage | null) => {
    setAssignUser(user);
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
            <TouchableOpacity
              style={[
                styles.button,
                selected === "equip" ? styles.selectedBtn : null,
              ]}
              onPress={() => setSelected("equip")}
            >
              <Text style={[selected === "equip" ? styles.selectedText : null]}>
                Equip
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                selected === "container" ? styles.selectedBtn : null,
              ]}
              onPress={() => setSelected("container")}
            >
              <Text
                style={[selected === "container" ? styles.selectedText : null]}
              >
                Container
              </Text>
            </TouchableOpacity>
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
            value={quantity.toString()}
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
        resetValue={false}
      />
      <TouchableOpacity style={styles.createBtn} onPress={handleCreate}>
        <Text style={styles.createBtnTxt}> Create </Text>
      </TouchableOpacity>
    </View>
  );
}

export default CreateEquipmentScreen;

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
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  selectedBtn: {
    backgroundColor: "#000000", // Selected background color
  },
  selectedText: {
    color: "#ffffff", // Selected text color
  },
  button: {
    backgroundColor: "#f6f6f6",
    padding: 10,
    borderRadius: 10,
    width: "35%",
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
