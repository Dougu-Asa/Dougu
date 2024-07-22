import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";

import { useUser } from "../../helper/UserContext";
import { InfoScreenProps } from "../../types/ScreenTypes";

function InfoScreen({ navigation }: InfoScreenProps) {
  const [orgName, setOrgName] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const { user, org } = useUser();

  // get the accesscode, orgName, and check if the user is the manager
  useEffect(() => {
    async function getOrgInfo() {
      setOrgName(org!.name);
      setAccessCode(org!.accessCode);
    }

    getOrgInfo();
  }, [org, user]);

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/asayake.png")}
        style={styles.circleImage}
      />
      <View style={styles.nonBtnRow}>
        <Text style={[styles.rowHeader, { flex: 2 }]}>Name</Text>
        <Text style={{ flex: 3 }}>{orgName}</Text>
      </View>
      <View style={styles.nonBtnRow}>
        <Text style={[styles.rowHeader, { flex: 2 }]}>Access Code</Text>
        <Text style={{ flex: 3 }}>{accessCode}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.rowHeader}>Members</Text>
        <TouchableOpacity
          style={styles.rightArrow}
          onPress={() =>
            navigation.navigate("UserStorages", { tabParam: "Members" })
          }
        >
          <Text>View Members</Text>
          <AntDesign name="right" size={20} />
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <Text style={styles.rowHeader}>Storages</Text>
        <TouchableOpacity
          style={styles.rightArrow}
          onPress={() =>
            navigation.navigate("UserStorages", { tabParam: "Storages" })
          }
        >
          <Text>View Storages</Text>
          <AntDesign name="right" size={20} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.equipmentBtn}
        onPress={() => navigation.navigate("ManageEquipment")}
      >
        <Text style={styles.eBtnText}>Equipment List</Text>
      </TouchableOpacity>
    </View>
  );
}

export default InfoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  circleImage: {
    width: 100,
    height: 100,
    borderRadius: 100 / 2,
    marginTop: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    margin: 20,
  },
  rowHeader: {
    fontWeight: "bold",
    flex: 2,
  },
  nonBtnRow: {
    flexDirection: "row",
    width: "90%",
    margin: 20,
  },
  rightArrow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "50%",
    flex: 3,
  },
  equipmentBtn: {
    backgroundColor: "#EEEEEE",
    height: 50,
    width: "50%",
    justifyContent: "center",
    borderRadius: 10,
  },
  eBtnText: {
    alignSelf: "center",
    fontWeight: "bold",
  },
});
