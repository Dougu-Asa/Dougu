import React, { useState, useRef, useEffect, useCallback } from "react";
import { Alert } from "react-native";
import { DataStore } from "aws-amplify";

// project imports
import { Equipment, OrgUserStorage } from "../../models";
import { useLoad } from "../../helper/LoadingContext";
import { useUser } from "../../helper/UserContext";
import { getEquipment } from "../../helper/DataStoreUtils";
import { handleError } from "../../helper/Utils";
import { EquipmentObj } from "../../types/ModelTypes";
import SwapGestures from "../../components/member/SwapGestures";

/*
  Screen for swapping equipment between the current user and another user.
  This section mainly focuses on getting and passing down the equipment info
*/
const SwapEquipmentScreen = () => {
  const { setIsLoading } = useLoad();
  const { user, orgUserStorage } = useUser();
  let swapUser = useRef<OrgUserStorage | null>(null);
  const [resetValue, setResetValue] = useState(false);
  let [listOne, setListOne] = useState<EquipmentObj[]>([]);
  let [listTwo, setListTwo] = useState<EquipmentObj[]>([]);

  // gets and sets the equipment for the current user and the swap user
  const setEquipment = useCallback(async () => {
    const equipmentOne = await getEquipment(orgUserStorage!);
    setListOne(equipmentOne ? equipmentOne : []);
    if (swapUser.current != null) {
      const equipmentTwo = await getEquipment(swapUser.current);
      setListTwo(equipmentTwo ? equipmentTwo : []);
    } else {
      setListTwo([]);
    }
  }, [orgUserStorage]);

  // subscribe to changes in equipment
  useEffect(() => {
    const subscription = DataStore.observeQuery(Equipment).subscribe(() => {
      console.log("Equipment updated");
      setEquipment();
    });

    // on unmount clear the subscription, and clear the swap user and dropdown
    return () => {
      subscription.unsubscribe();
      swapUser.current = null;
      setResetValue(true);
    };
  }, [user, orgUserStorage, setEquipment]);

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
