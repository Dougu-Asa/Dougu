import React, { useEffect } from "react";
import { View, Image, StyleSheet } from "react-native";
import { Hub, DataStore } from "aws-amplify";

import { SyncScreenProps } from "../types/ScreenTypes";

/*
  after a user logs in, this screen is displayed while the app
  syncs datastore with the backend
*/
function SyncScreen({ navigation }: SyncScreenProps) {
  // start DataStore and listen for DataStore ready event
  useEffect(() => {
    DataStore.start();
    const listener = Hub.listen("datastore", async (hubData) => {
      const { event } = hubData.payload;
      if (event === "ready") {
        navigation.navigate("DrawerNav", { screen: "MyOrgs" });
      }
    });

    return () => {
      listener();
    };
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/asayake_taiko.png")}
        style={styles.circleImage}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eceff1",
    alignItems: "center",
    width: "100%",
    justifyContent: "center",
  },
  circleImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginTop: 20,
  },
});

export default SyncScreen;
