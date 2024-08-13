import React from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { DataStore } from "@aws-amplify/datastore";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Entypo from "react-native-vector-icons/Entypo";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { OrgUserStorage } from "../../models";
import { useLoad } from "../../helper/context/LoadingContext";
import { handleError } from "../../helper/Utils";
import { useUser } from "../../helper/context/UserContext";

/* 
    Single row from the UserStorages list. Each 
    row contains the user's name and a delete button
*/
export default function MemberRow({
  item,
  isManager,
}: {
  item: OrgUserStorage | null;
  isManager: boolean;
}) {
  const { setIsLoading } = useLoad();
  const { user, org } = useUser();

  // delete an orgUserStorage associated with the user
  // DOING SO ALSO REMOVES ALL EQUIPMENT ASSOCIATED WITH THE USER
  const handleDelete = async () => {
    try {
      setIsLoading(true);
      if (item == null) throw new Error("User/Storage not found");
      const orgUserStorage = await DataStore.query(OrgUserStorage, item.id);
      if (orgUserStorage == null) throw new Error("User/Storage not found");
      await DataStore.delete(orgUserStorage);
      setIsLoading(false);
      Alert.alert("User/Storage Deleted Successfully!");
    } catch (e) {
      handleError("handleDelete", e as Error, setIsLoading);
    }
  };

  // make sure the owner wants to delete the equipment
  const handleEdit = () => {
    if (org!.manager !== user!.id) {
      Alert.alert("You must be a manager to edit users/storages");
      return;
    }
    Alert.alert(
      "Delete " + item?.name + "?",
      "Would you like to delete this equipment? \n WARNING: Deleting will remove all associated equipment and data.",
      [
        {
          text: "Delete",
          onPress: () => handleDelete(),
          style: "destructive",
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
    );
  };

  return (
    <View style={userStorage.row}>
      <FontAwesome
        name="user-circle"
        size={32}
        color="gray"
        style={userStorage.profile}
      />
      <View style={userStorage.nameRow}>
        <Text style={userStorage.name}>{item ? item.name : "NULL ERROR"}</Text>
        {isManager ? (
          <MaterialCommunityIcons
            name="crown"
            color={"#791111"}
            size={32}
            style={{ marginLeft: 10 }}
          />
        ) : null}
      </View>
      {!isManager ? ( //let's not delete the manager...
        <TouchableOpacity style={userStorage.icon} onPress={handleEdit}>
          <Entypo name="dots-three-horizontal" size={24} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const userStorage = StyleSheet.create({
  row: {
    flexDirection: "row",
    width: "100%",
    minHeight: 60,
    borderBottomWidth: 1,
    borderBottomColor: "gray",
    alignItems: "center",
  },
  nameRow: {
    flexDirection: "row",
    flex: 9,
    alignItems: "center",
  },
  profile: {
    padding: 10,
    flex: 1,
    marginLeft: 10,
  },
  name: {
    fontSize: 14,
    marginLeft: 10,
    fontWeight: "bold",
  },
  icon: {
    justifyContent: "center",
    marginRight: 5,
    flex: 1,
    padding: 5,
  },
});
