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
  itemId: string,
  assignedTo: string,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  try {
    setIsLoading(true);
    const swapOrgUserStorage = await DataStore.query(
      OrgUserStorage,
      assignedTo,
    );
    const equip = await DataStore.query(Equipment, itemId);
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
  assignedTo: string,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  try {
    setIsLoading(true);
    const swapOrgUserStorage = await DataStore.query(
      OrgUserStorage,
      assignedTo,
    );
    const container = await DataStore.query(Container, item.id);
    if (!swapOrgUserStorage) throw new Error("OrgUserStorage does not exist!");
    if (!container) throw new Error("Container does not exist!");
    /*await DataStore.save(
      Container.copyOf(container, (updated) => {
        updated.assignedTo = swapOrgUserStorage;
        updated.lastUpdatedDate = new Date().toISOString();
      }),
    ); */
    // update all equipment that belongs to the container
    const equipment = container.equipment;
    console.log("equipment of container:", equipment);
    setIsLoading(false);
    Alert.alert("Swap Successful!");
  } catch (e) {
    handleError("Swap Container", e as Error, setIsLoading);
  }
};

// reassign the equipment to the container by the id passed in
// equipment -> container
export const addEquipmentToContainer = async (
  itemId: string,
  containerId: string,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  try {
    setIsLoading(true);
    const container = await DataStore.query(Container, containerId);
    const equip = await DataStore.query(Equipment, itemId);
    if (!container) throw new Error("Container does not exist!");
    if (!equip) throw new Error("Equipment does not exist!");
    /*await DataStore.save(
      Equipment.copyOf(equip, (updated) => {
        updated.lastUpdatedDate = new Date().toISOString();
        updated.containerEquipmentId = container.id;
      }),
    ); */
    console.log("equipment added to container:", equip);
    let equipment = await container.equipment.toArray();
    console.log("equipment of container:", equipment);
    equipment.push(equip);
    console.log("equipment of container:", equipment);
    // update container
    /*await DataStore.save(
      Container.copyOf(container, (updated) => {
        updated.equipment = equipment;
        updated.lastUpdatedDate = new Date().toISOString();
      }),
    ); */
    setIsLoading(false);
    Alert.alert("Added Equipment to Container!");
  } catch (e) {
    handleError("addEquipmentToContainer", e as Error, setIsLoading);
  }
};
