import React from "react";
import { Text, View, StyleSheet, ScrollView } from "react-native";
import JoinOrgScreen from "./JoinOrgScreen";
import CreateOrgScreen from "./CreateOrgScreen";
import {
  CreateOrgScreenProps,
  JoinOrCreateScreenProps,
  JoinOrgScreenProps,
} from "../../types/ScreenTypes";

function JoinOrCreateScreen({
  navigation,
}: JoinOrCreateScreenProps & JoinOrgScreenProps & CreateOrgScreenProps) {
  return (
    <ScrollView style={{ backgroundColor: "white" }}>
      <View style={styles.mainContainer}>
        <Text style={styles.titleText}>
          Looks like you aren't part of an org yet! Join or Create an org!
        </Text>
        <View style={styles.container}>
          <JoinOrgScreen navigation={navigation} />
        </View>
        <View style={styles.container}>
          <CreateOrgScreen navigation={navigation} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  titleText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#791111",
    margin: 20,
    textAlign: "center",
    width: "80%",
  },
  container: {
    width: "80%",
    height: "40%",
  },
});

export default JoinOrCreateScreen;
