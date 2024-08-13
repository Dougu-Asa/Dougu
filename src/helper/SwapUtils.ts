import { DataStore } from "aws-amplify";
import { Alert } from "react-native";

import { OrgUserStorage, Equipment, Container } from "../models";
import { ContainerObj, EquipmentObj } from "../types/ModelTypes";
import { handleError } from "./Utils";

/* 
    This file contains utility functions for swapping equipment and containers
    in SwapGestures.tsx. There are four main types:
    1. Equipment -> UserStorage
    2. Container -> UserStorage
    3. Equipment -> Container
    4. Equipment -> Out of Container
*/

// reassign the equipment to the new OrgUserStorage by the id passed in
// Equipment -> UserStorage
export const reassignEquipment = async (
  item: EquipmentObj,
  assignedTo: OrgUserStorage,
) => {
  try {
    if (item.assignedTo === assignedTo.id) return;
    // ensure equipment and user exist
    const swapOrgUserStorage = await DataStore.query(
      OrgUserStorage,
      assignedTo.id,
    );
    const equip = await DataStore.query(Equipment, item.id);
    if (!swapOrgUserStorage) throw new Error("OrgUserStorage does not exist!");
    if (!equip) throw new Error("Equipment does not exist!");
    // reassign
    await DataStore.save(
      Equipment.copyOf(equip, (updated) => {
        updated.assignedTo = swapOrgUserStorage;
        updated.lastUpdatedDate = new Date().toISOString();
      }),
    );
    // update container
    Alert.alert("Swap Successful!");
  } catch (e) {
    handleError("Swap Equipment", e as Error, null);
  }
};

// reassign the container to the new OrgUserStorage by the id passed in
// Container -> UserStorage
export const reassignContainer = async (
  item: ContainerObj,
  assignedTo: OrgUserStorage,
) => {
  try {
    if (item.assignedTo === assignedTo.id) return;
    // ensure container and user exist
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
    // reassign all equipment that belong to the container
    containerEquipment.forEach(async (equip) => {
      await DataStore.save(
        Equipment.copyOf(equip, (updated) => {
          updated.assignedTo = swapOrgUserStorage;
          updated.lastUpdatedDate = new Date().toISOString();
        }),
      );
    });
    Alert.alert("Swap Successful!");
  } catch (e) {
    handleError("Swap Container", e as Error, null);
  }
};

// reassign the equipment to the container by the id passed in
// Equipment -> Container
export const addEquipmentToContainer = async (
  item: EquipmentObj,
  containerItem: ContainerObj,
) => {
  try {
    if (item.container === containerItem.id) return;
    // ensure equipment and container exist
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
    Alert.alert("Added Equipment to Container!");
  } catch (e) {
    handleError("addEquipmentToContainer", e as Error, null);
  }
};

// reassign the equipment out of the container
// Equipment -> Out of Container
export const moveOutOfContainer = async (
  item: EquipmentObj,
  assignedTo: OrgUserStorage,
) => {
  try {
    // ensure equipment and user exist
    const equip = await DataStore.query(Equipment, item.id);
    const assignedToUser = await DataStore.query(OrgUserStorage, assignedTo.id);
    if (!equip) throw new Error("Equipment does not exist!");
    if (!assignedToUser) throw new Error("OrgUserStorage does not exist!");
    // equipment is reassigned to the user and removed from the container
    await DataStore.save(
      Equipment.copyOf(equip, (updated) => {
        updated.lastUpdatedDate = new Date().toISOString();
        updated.containerId = null;
        updated.assignedTo = assignedToUser;
      }),
    );
    Alert.alert("Equipment Moved Out of Container!");
  } catch (e) {
    handleError("Move Out of Container", e as Error, null);
  }
};
