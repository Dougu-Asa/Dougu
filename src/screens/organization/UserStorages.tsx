import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { DataStore } from "@aws-amplify/datastore";
import { Dimensions } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

// project imports
import { OrgUserStorage, UserOrStorage } from "../../models";
import { useUser } from "../../helper/context/UserContext";
import MemberRow from "../../components/organization/MemberRow";
import { UserStoragesScreenProps } from "../../types/ScreenTypes";
import { sortOrgUserStorages } from "../../helper/EquipmentUtils";

/*
  Screen for viewing all members and storages in an organization
  It has two tabs: Members and Storages, where each tab displays
  its respective data
*/
export default function UserStorages({
  route,
  navigation,
}: UserStoragesScreenProps) {
  const { tabParam } = route.params;
  const [orgName, setOrgName] = useState("");
  const [manager, setManager] = useState<OrgUserStorage | null>(null);
  const [tab, setTab] = useState(tabParam);
  const [currData, setCurrData] = useState<OrgUserStorage[]>([]);
  const { user, org } = useUser();

  // update our data everytime the tab or data changes
  useEffect(() => {
    const getManager = async () => {
      const managerOrgUserStorage = await DataStore.query(OrgUserStorage, (c) =>
        c.and((c) => [
          c.user.eq(org!.manager),
          c.organization.name.eq(org!.name),
          c.type.eq(UserOrStorage.USER),
        ]),
      );
      if (managerOrgUserStorage.length <= 0)
        throw new Error("Manager not found");
      setManager(managerOrgUserStorage[0]);
    };

    const getData = async () => {
      let data;
      if (tab === "Members") {
        data = await DataStore.query(OrgUserStorage, (c) =>
          c.and((c) => [
            c.organization.name.eq(org!.name),
            c.user.ne(org!.manager),
            c.type.eq("USER"),
          ]),
        );
      } else {
        data = await DataStore.query(OrgUserStorage, (c) =>
          c.and((c) => [
            c.organization.name.eq(org!.name),
            c.type.eq("STORAGE"),
          ]),
        );
      }
      data = sortOrgUserStorages(data);
      setCurrData(data);
    };

    setOrgName(org!.name);
    getManager();
    const subscription = DataStore.observeQuery(OrgUserStorage).subscribe(
      () => {
        getData();
      },
    );

    return () => subscription.unsubscribe();
  }, [org, tab, user]);

  // create a storage, only managers can create storages
  const handleCreate = async () => {
    if (org!.manager !== user!.id)
      Alert.alert("You need to be a manager to create a storage!");
    else navigation.navigate("CreateStorage");
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#791111", "#550c0c"]} style={styles.header}>
        <Text style={styles.headerText}>{orgName}</Text>
      </LinearGradient>
      <View style={styles.tab}>
        <TouchableOpacity
          style={[styles.button, tab === "Members" ? styles.selectedBtn : null]}
          onPress={() => setTab("Members")}
        >
          <Text
            style={[
              styles.buttonText,
              tab === "Members" ? styles.selectedText : null,
            ]}
          >
            Members
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            tab === "Storages" ? styles.selectedBtn : null,
          ]}
          onPress={() => setTab("Storages")}
        >
          <Text
            style={[
              styles.buttonText,
              tab === "Storages" ? styles.selectedText : null,
            ]}
          >
            Storages
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={{ width: Dimensions.get("window").width }}>
        {tab === "Members" ? (
          <MemberRow item={manager} isManager={true} />
        ) : null}
        {currData.map((item, index) => (
          <MemberRow key={index} item={item} isManager={false} />
        ))}
        {tab === "Storages" ? (
          <TouchableOpacity style={styles.createBtn} onPress={handleCreate}>
            <Text style={styles.createBtnTxt}>Create Storage</Text>
            <MaterialCommunityIcons name="crown" color={"#fff"} size={32} />
          </TouchableOpacity>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  header: {
    width: "90%",
    height: "20%",
    marginVertical: "5%",
    borderRadius: 20,
    justifyContent: "center",
    alignContent: "center",
  },
  headerText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  tab: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
  },
  button: {
    width: "50%",
    padding: 10,
  },
  buttonText: {
    fontSize: 14,
    textAlign: "center",
    color: "#828282",
  },
  selectedBtn: {
    backgroundColor: "#E0E0E0",
  },
  selectedText: {
    color: "black",
  },
  createBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
    height: 50,
    backgroundColor: "#333333",
    alignSelf: "center",
    borderRadius: 10,
    marginVertical: 10,
  },
  createBtnTxt: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    marginRight: 10,
  },
});
