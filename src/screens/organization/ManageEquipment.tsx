import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

// project imports
import EquipmentTable from "../../components/organization/EquipmentTable";
import { useLoad } from "../../helper/LoadingContext";
import { ManageEquipmentScreenProps } from "../../types/ScreenTypes";

const ManageEquipmentScreen = ({
  route,
  navigation,
}: ManageEquipmentScreenProps) => {
  const { isManager } = route.params;
  const { setIsLoading } = useLoad();

  const handleCreate = () => {
    if (isManager) {
      navigation.navigate("CreateEquipment");
    } else {
      Alert.alert(
        "Authorization Error",
        "You do not have permission to create equipment",
        [{ text: "OK" }],
      );
    }
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Manage Equipment</Text>
          <TouchableOpacity onPress={handleCreate}>
            <Ionicons name="add" size={40} style={styles.addIcon} />
          </TouchableOpacity>
        </View>
        <EquipmentTable setIsLoading={setIsLoading} />
      </View>
    </View>
  );
};
export default ManageEquipmentScreen;

const styles = StyleSheet.create({
  mainContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#fff",
    borderWidth: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  addIcon: {
    backgroundColor: "#f4f4f4",
    borderRadius: 10,
    marginLeft: 30,
  },
});
