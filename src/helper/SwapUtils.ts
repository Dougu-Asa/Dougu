import { DataStore } from "aws-amplify";
import { Alert } from "react-native";

import { OrgUserStorage, Equipment, Container } from "../models";
import { ContainerObj, EquipmentObj } from "../types/ModelTypes";
import { handleError } from "./Utils";

/* 
    This file contains utility functions for swapping equipment and containers
    between OrgUserStorages. There are four main types:
    1. equipment -> new OrgUserStorage
    2. container -> new OrgUserStorage
    3. equipment -> container
    4. equipment -> container, new OrgUserStorage
*/

// reassign the equipment to the new OrgUserStorage by the id passed in
// equipment -> new OrgUserStorage
export const reassignEquipment = async (
  item: EquipmentObj,
  assignedTo: OrgUserStorage,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  try {
    if (item.assignedTo === assignedTo.id) return;
    setIsLoading(true);
    const swapOrgUserStorage = await DataStore.query(
      OrgUserStorage,
      assignedTo.id,
    );
    const equip = await DataStore.query(Equipment, item.id);
    if (!swapOrgUserStorage) throw new Error("OrgUserStorage does not exist!");
    if (!equip) throw new Error("Equipment does not exist!");
    await DataStore.save(
      Equipment.copyOf(equip, (updated) => {
        updated.assignedTo = swapOrgUserStorage;
        updated.lastUpdatedDate = new Date().toISOString();
      }),
    );
    // update container
    setIsLoading(false);
    Alert.alert("Swap Successful!");
  } catch (e) {
    handleError("Swap Equipment", e as Error, setIsLoading);
  }
};

// reassign the container to the new OrgUserStorage by the id passed in
// container -> new OrgUserStorage
export const reassignContainer = async (
  item: ContainerObj,
  assignedTo: OrgUserStorage,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  try {
    if (item.assignedTo === assignedTo.id) return;
    setIsLoading(true);
    const swapOrgUserStorage = await DataStore.query(
      OrgUserStorage,
      assignedTo.id,
    );
    const container = await DataStore.query(Container, item.id);
    if (!swapOrgUserStorage) throw new Error("OrgUserStorage does not exist!");
    if (!container) throw new Error("Container does not exist!");
    const containerEquipment = await DataStore.query(Equipment, (c) =>
      c.containerId.eq(item.id),
    );
    // reassign the container to the new OrgUserStorage
    await DataStore.save(
      Container.copyOf(container, (updated) => {
        updated.assignedTo = swapOrgUserStorage;
        updated.lastUpdatedDate = new Date().toISOString();
      }),
    );
    // reassign all equipment that belongs to the container
    containerEquipment.forEach(async (equip) => {
      await DataStore.save(
        Equipment.copyOf(equip, (updated) => {
          updated.assignedTo = swapOrgUserStorage;
          updated.lastUpdatedDate = new Date().toISOString();
        }),
      );
    });
    setIsLoading(false);
    Alert.alert("Swap Successful!");
  } catch (e) {
    handleError("Swap Container", e as Error, setIsLoading);
  }
};

// reassign the equipment to the container by the id passed in
// equipment -> container
export const addEquipmentToContainer = async (
  item: EquipmentObj,
  containerItem: ContainerObj,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  try {
    if (item.container === containerItem.id) return;
    setIsLoading(true);
    const equip = await DataStore.query(Equipment, item.id);
    const container = await DataStore.query(Container, containerItem.id);
    if (!equip) throw new Error("Equipment does not exist!");
    if (!container) throw new Error("Container does not exist!");
    const contanierUser = await container.assignedTo;
    // equipment is reassigned to the container and container owner
    await DataStore.save(
      Equipment.copyOf(equip, (updated) => {
        updated.lastUpdatedDate = new Date().toISOString();
        updated.containerId = container.id;
        updated.assignedTo = contanierUser;
      }),
    );
    setIsLoading(false);
    Alert.alert("Added Equipment to Container!");
  } catch (e) {
    handleError("addEquipmentToContainer", e as Error, setIsLoading);
  }
};

export const moveOutOfContainer = async (
  item: EquipmentObj,
  assignedTo: OrgUserStorage,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  try {
    setIsLoading(true);
    const equip = await DataStore.query(Equipment, item.id);
    const assignedToUser = await DataStore.query(OrgUserStorage, assignedTo.id);
    if (!equip) throw new Error("Equipment does not exist!");
    if (!assignedToUser) throw new Error("OrgUserStorage does not exist!");
    await DataStore.save(
      Equipment.copyOf(equip, (updated) => {
        updated.lastUpdatedDate = new Date().toISOString();
        updated.containerId = null;
        updated.assignedTo = assignedToUser;
      }),
    );
    setIsLoading(false);
    Alert.alert("Equipment Moved Out of Container!");
  } catch (e) {
    handleError("Move Out of Container", e as Error, setIsLoading);
  }
};
