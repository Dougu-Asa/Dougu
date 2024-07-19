// dropdown for the current members
import React, { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { DataStore } from "@aws-amplify/datastore";
import { useIsFocused } from "@react-navigation/native";

// project imports
import { OrgUserStorage } from "../models";
import { useUser } from "../helper/UserContext";
import { UserNames } from "../types/ModelTypes";

const CurrMembersDropdown = ({
  setUser,
  isCreate,
  resetValue,
}: {
  setUser: (inputUser: OrgUserStorage | null) => void;
  isCreate: boolean;
  resetValue: boolean;
}) => {
  const [value, setValue] = useState<string | null>(null);
  const [isFocus, setIsFocus] = useState(false);
  const [userNames, setUserNames] = useState<UserNames[]>([]);
  const isFocused = useIsFocused();
  const { user, org } = useUser();

  // useEffect
  useEffect(() => {
    async function getMembers() {
      let data;
      if (isCreate) {
        // when creating equipment, you want to be able to assign it to anyone
        data = await DataStore.query(OrgUserStorage, (c) =>
          c.organization.name.eq(org!.name),
        );
      } else {
        // when swapping equipment, you don't want to swap with yourself
        data = await DataStore.query(OrgUserStorage, (c) =>
          c.and((c) => [
            c.organization.name.eq(org!.name),
            c.or((c) => [
              c.type.eq("STORAGE"),
              c.user.userId.ne(user!.attributes.sub),
            ]),
          ]),
        );
      }
      const userNames = data.map((user) => ({
        label: user["name"],
        value: user["name"],
        data: user,
      }));
      setUserNames(userNames);
    }

    const subscription = DataStore.observeQuery(OrgUserStorage).subscribe(
      (snapshot) => {
        const { items, isSynced } = snapshot;
        console.log(
          `OrgUserStorage Dropdown [Snapshot] item count: ${items.length}, isSynced: ${isSynced}`,
        );
        getMembers();
      },
    );

    return () => subscription.unsubscribe();
  }, [isCreate, isFocused, org, user]);

  useEffect(() => {
    if (resetValue) {
      setValue(null);
    }
  }, [resetValue, setUser]);

  async function handleChangeUser(value: OrgUserStorage | null) {
    setUser(value);
  }

  return (
    <Dropdown
      style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
      placeholderStyle={styles.textStyle}
      selectedTextStyle={styles.textStyle}
      data={userNames}
      labelField="label"
      valueField="value"
      placeholder={"Select Member"}
      value={value}
      onFocus={() => setIsFocus(true)}
      onBlur={() => setIsFocus(false)}
      onChange={(item) => {
        setValue(item.value);
        setIsFocus(false);
        handleChangeUser(item.data);
      }}
      autoScroll={false}
    />
  );
};

export default CurrMembersDropdown;

const styles = StyleSheet.create({
  dropdown: {
    width: "auto",
    height: 40,
  },
  textStyle: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 20,
  },
});
