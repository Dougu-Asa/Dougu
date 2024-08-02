import React, { useState, useRef, useEffect, useCallback } from "react";
import { Alert } from "react-native";
import { DataStore } from "aws-amplify";

// project imports
import { Equipment, OrgUserStorage } from "../../models";
import { useLoad } from "../../helper/LoadingContext";
import { useUser } from "../../helper/UserContext";
import { handleError } from "../../helper/Utils";
import { EquipmentObj } from "../../types/ModelTypes";
import SwapGestures from "../../components/member/SwapGestures";
import { useEquipment } from "../../helper/EquipmentContext";

/*
  Screen for swapping equipment between the current user and another user.
  This section mainly focuses on getting and passing down the equipment info
*/
const SwapEquipmentScreen = () => {
  const { setIsLoading } = useLoad();
  const { orgUserStorage } = useUser();
  const { equipmentData } = useEquipment();
  let swapUser = useRef<OrgUserStorage | null>(null);
  const [resetValue, setResetValue] = useState(false);
  let [listOne, setListOne] = useState<EquipmentObj[]>([]);
  let [listTwo, setListTwo] = useState<EquipmentObj[]>([]);

  // gets and sets the equipment for the current user and the swap user
  const setEquipment = useCallback(async () => {
    const userEquipmentOne = equipmentData.get(orgUserStorage!.id);
    const equipmentOne = userEquipmentOne?.equipment;
    setListOne(equipmentOne ? equipmentOne : []);
    if (swapUser.current != null) {
      const userEquipmentTwo = equipmentData.get(swapUser.current.id);
      const equipmentTwo = userEquipmentTwo?.equipment;
      setListTwo(equipmentTwo ? equipmentTwo : []);
    } else {
      setListTwo([]);
    }
  }, [equipmentData, orgUserStorage]);

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
  async function reassignEquipment(item: EquipmentObj, assignedTo: string) {
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
  }

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
};

export default SwapEquipmentScreen;
