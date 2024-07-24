import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import { Auth, DataStore } from "aws-amplify";

// Project Files
import { useUser } from "../helper/UserContext";
import LoginScreen from "../components/Login";
import CreateAccScreen from "../components/CreateAcc";
import { HomeScreenProps } from "../types/ScreenTypes";

/* 
  HomeScreen is the first screen that the user sees when they open the app. 
  It allows the user to login or create an account. 
*/
export default function HomeScreen({ navigation }: HomeScreenProps) {
  const [login, setLogin] = React.useState(true);
  const { setUser } = useUser();

  useEffect(() => {
    // Checks if a user is currently logged in. If so, navigates to the MemberTabs screen
    const checkCurrentUser = async () => {
      try {
        const user = await Auth.currentAuthenticatedUser();
        console.log("User is logged in");
        setUser(user);
        navigation.navigate("DrawerNav", { screen: "MyOrgs" });
      } catch {
        console.log("No user is logged in");
      }
    };

    checkCurrentUser();
  }, [navigation, setUser]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dougu</Text>
      <View style={styles.loginCreateContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setLogin(true)}>
            <Text>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setLogin(false)}>
            <Text>Create</Text>
          </TouchableOpacity>
        </View>
        {login ? (
          <LoginScreen navigation={navigation} />
        ) : (
          <CreateAccScreen navigation={navigation} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    width: "100%",
  },
  title: {
    marginTop: "10%",
    fontSize: 40,
    fontWeight: "bold",
    color: "#791111",
  },
  loginCreateContainer: {
    width: "80%",
    height: "80%",
    borderWidth: 1,
    borderRadius: 20,
  },
  header: {
    height: "10%",
    width: "100%",
    borderWidth: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
});
