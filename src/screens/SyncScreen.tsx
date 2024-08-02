import React, { useEffect } from "react";
import { View, Image, StyleSheet } from "react-native";
import { Hub, DataStore, Auth } from "aws-amplify";

import { SyncScreenProps } from "../types/ScreenTypes";
import { useUser } from "../helper/UserContext";

/*
  after a user logs in, this screen is displayed while the app
  syncs datastore with the backend
*/
function SyncScreen({ route, navigation }: SyncScreenProps) {
  const { syncType } = route.params;
  const { accessCode } = route.params;
  const { newOrg } = route.params;
  const { user, setOrg } = useUser();

  // start DataStore and listen for DataStore ready event
  useEffect(() => {
    const handleDataStore = async () => {
      if (syncType !== "START") {
        await DataStore.clear();
        // wait for DataStore to clear (2 seconds)
        setTimeout(async () => {
          // this updates Auth to trigger a refresh of the user
          await Auth.updateUserAttributes(user!, {
            name: user!.attributes.name,
          });
          await DataStore.start();
        }, 2000);
      } else {
        await DataStore.start();
      }
    };

    // depending on where the user is coming from, navigate to the correct screen
    const handleNavigation = async () => {
      switch (syncType) {
        case "START":
          navigation.navigate("DrawerNav", { screen: "MyOrgs" });
          break;
        case "CREATE":
          setOrg(newOrg ? newOrg : null);
          navigation.navigate("DrawerNav", {
            screen: "AccessCode",
            params: { accessCode: accessCode ? accessCode : "ERROR" },
          });
          break;
        case "JOIN":
          setOrg(newOrg ? newOrg : null);
          navigation.navigate("DrawerNav", {
            screen: "MemberTabs",
            params: {
              screen: "Equipment",
            },
          });
          break;
      }
    };

    handleDataStore();
    const listener = Hub.listen("datastore", async (hubData) => {
      const { event } = hubData.payload;
      if (event === "ready") {
        setTimeout(() => {
          handleNavigation();
        }, 1000);
      }
    });

    return () => {
      listener();
    };
  }, [accessCode, navigation, newOrg, setOrg, syncType, user]);

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
