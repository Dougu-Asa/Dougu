import React, { useState, useRef, useEffect, useCallback } from "react";
import { Alert } from "react-native";
import { DataStore } from "aws-amplify";

// project imports
import { Equipment, OrgUserStorage } from "../../models";
import { useLoad } from "../../helper/LoadingContext";
import { useUser } from "../../helper/UserContext";
import { handleError } from "../../helper/Utils";
import { EquipmentObj, ItemObj } from "../../types/ModelTypes";
import SwapGestures from "../../components/member/SwapGestures";
import { useEquipment } from "../../helper/EquipmentContext";

/*
  Screen for swapping equipment between the current user and another user.
  This section mainly focuses on getting and passing down the equipment info
*/
export default function SwapEquipment() {
  const { setIsLoading } = useLoad();
  const { orgUserStorage } = useUser();
  const { itemData } = useEquipment();
  let swapUser = useRef<OrgUserStorage | null>(null);
  const [resetValue, setResetValue] = useState(false);
  let [listOne, setListOne] = useState<ItemObj[]>([]);
  let [listTwo, setListTwo] = useState<ItemObj[]>([]);

  // gets and sets the equipment for the current user and the swap user
  const setEquipment = useCallback(async () => {
    const userItemsOne = itemData.get(orgUserStorage!.id);
    const itemsOne = userItemsOne?.data;
    setListOne(itemsOne ? itemsOne : []);
    if (swapUser.current != null) {
      const userItemsTwo = itemData.get(swapUser.current.id);
      const itemsTwo = userItemsTwo?.data;
      setListTwo(itemsTwo ? itemsTwo : []);
    } else {
      setListTwo([]);
    }
  }, [itemData, orgUserStorage]);

  // call setEquipment everytime the swap user changes
  useEffect(() => {
    setEquipment();
  }, [setEquipment]);

  // on unmount clear the swap user and dropdown
  useEffect(() => {
    return () => {
      swapUser.current = null;
      setResetValue(true);
    };
  }, []);

  // reassign the equipment to the new OrgUserStorage by the id passed in
  const reassignEquipment = async (item: EquipmentObj, assignedTo: string) => {
    try {
      setIsLoading(true);
      const swapOrgUserStorage = await DataStore.query(
        OrgUserStorage,
        assignedTo,
      );
      const equip = await DataStore.query(Equipment, item.id);
      if (!swapOrgUserStorage)
        throw new Error("OrgUserStorage does not exist!");
      if (!equip) throw new Error("Equipment does not exist!");
      await DataStore.save(
        Equipment.copyOf(equip, (updated) => {
          updated.assignedTo = swapOrgUserStorage;
          updated.lastUpdatedDate = new Date().toISOString();
        }),
      );
      setIsLoading(false);
      Alert.alert("Swap Successful!");
    } catch (e) {
      handleError("Swap Equipment", e as Error, setIsLoading);
    }
  };

  // get selected user equipment
  const handleSet = (inputUser: OrgUserStorage | null) => {
    swapUser.current = inputUser;
    setResetValue(false);
    setEquipment();
  };

  return (
    <SwapGestures
      listOne={listOne}
      listTwo={listTwo}
      handleSet={handleSet}
      resetValue={resetValue}
      swapUser={swapUser}
      reassignEquipment={reassignEquipment}
    />
  );
}
