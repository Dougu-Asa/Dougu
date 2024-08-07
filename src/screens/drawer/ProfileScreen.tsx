import { Text, View } from "react-native";
import React, { useEffect } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";

import { useUser } from "../../helper/context/UserContext";

export default function ProfileScreen() {
  const { user } = useUser();

  useEffect(() => {
    console.log(user);
  }, [user]);

  return (
    <View>
      <TouchableOpacity onPress={() => console.log("create group")}>
        <Text>Create Group</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => console.log("Join Group")}>
        <Text>Join Group</Text>
      </TouchableOpacity>
    </View>
  );
}
