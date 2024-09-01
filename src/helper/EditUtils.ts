import { Dispatch, SetStateAction } from "react";
import { ItemObj } from "../types/ModelTypes";
import { DataStore } from "@aws-amplify/datastore";
import { Equipment, Container, OrgUserStorage, UserOrStorage } from "../models";
import { handleError } from "./Utils";
import { Alert } from "react-native";

// delete equipment from the organization
const handleDelete = async (
  item: ItemObj,
  setIsLoading: Dispatch<SetStateAction<boolean>>,
) => {
  try {
    setIsLoading(true);
    let toDelete;
    if (item.type === "equipment") {
      toDelete = await DataStore.query(Equipment, item.id);
    } else {
      toDelete = await DataStore.query(Container, item.id);
      const containerEquipment = await DataStore.query(Equipment, (c) =>
        c.containerId.eq(item.id),
      );
      for (let i = 0; i < containerEquipment.length; i++) {
        await DataStore.delete(containerEquipment[i]);
      }
    }
    if (toDelete == null) throw new Error("Item not found");
    await DataStore.delete(toDelete);
    setIsLoading(false);
    Alert.alert("Equipment Deleted Successfully!");
  } catch (error) {
    handleError("handleDelete", error as Error, setIsLoading);
  }
};

// make sure the owner wants to delete the equipment
export const handleEdit = (
  equipment: ItemObj,
  isManager: boolean,
  setIsLoading: Dispatch<SetStateAction<boolean>>,
) => {
  if (!isManager) {
    Alert.alert("You must be a manager to edit equipment");
    return;
  }
  Alert.alert("Delete Equipment", "Would you like to delete this equipment?", [
    {
      text: "Delete",
      onPress: () => handleDelete(equipment, setIsLoading),
      style: "destructive",
    },
    {
      text: "Cancel",
      style: "cancel",
    },
  ]);
};

export const editProfilePictures = async (userId: string, profile: string) => {
  const orgUserStorages = await DataStore.query(OrgUserStorage, (c) =>
    c.and((c) => [c.user.eq(userId), c.type.eq(UserOrStorage.USER)]),
  );
  // for each orgUserStorage, set the profile to the new one
  orgUserStorages.forEach(async (user) => {
    await DataStore.save(
      OrgUserStorage.copyOf(user, (updated) => {
        updated.profile = profile;
      }),
    );
  });
};
