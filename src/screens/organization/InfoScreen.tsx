import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useUser } from "../../helper/context/UserContext";
import { InfoScreenProps } from "../../types/ScreenTypes";
import { useIsFocused } from "@react-navigation/native";
import { useHeader } from "../../helper/context/HeaderContext";

/*
  InfoScreen displays the organization's name, access code, and offers
  navigation to view more information about the organization's members,
  storages, and equipment.
*/
export default function InfoScreen({ navigation }: InfoScreenProps) {
  const { org } = useUser();
  const { setInfoFocus } = useHeader();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      setInfoFocus(true);
    } else {
      setInfoFocus(false);
    }
  }, [isFocused, setInfoFocus]);

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/asayake.png")}
        style={styles.circleImage}
      />
      <TouchableOpacity
        onPress={() => navigation.navigate("OrgImage", { key: org!.image })}
      >
        <Text style={styles.link}>Edit Org Image</Text>
      </TouchableOpacity>
      <View style={styles.row}>
        <Text style={[styles.rowHeader, { flex: 2 }]}>Name</Text>
        <Text style={{ flex: 3 }}>{org!.name}</Text>
      </View>
      <View style={styles.row}>
        <Text style={[styles.rowHeader, { flex: 2 }]}>Access Code</Text>
        <Text style={{ flex: 3 }}>{org!.accessCode}</Text>
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
      <View style={styles.row}>
        <Text style={styles.rowHeader}>Equipment</Text>
        <TouchableOpacity
          style={styles.rightArrow}
          onPress={() => navigation.navigate("Sheet")}
        >
          <Text>View Sheet</Text>
          <AntDesign name="right" size={20} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.equipmentBtn}
        onPress={() => navigation.navigate("ManageEquipment")}
      >
        <Text style={styles.eBtnText}>Manage Equipment</Text>
      </TouchableOpacity>
    </View>
  );
}

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
  equipmentBtn: {
    backgroundColor: "#EEEEEE",
    height: 50,
    width: "50%",
    justifyContent: "center",
    borderRadius: 10,
    marginTop: 20,
  },
  eBtnText: {
    alignSelf: "center",
    fontWeight: "bold",
  },
  link: {
    color: "#0000ff",
    fontSize: 14,
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    margin: 15,
  },
  rowHeader: {
    fontWeight: "bold",
    flex: 2,
  },
  rightArrow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "50%",
    flex: 3,
  },
});
