import React, { useState, useRef, useEffect, useCallback } from "react";

// project imports
import { OrgUserStorage } from "../../models";
import { useUser } from "../../helper/context/UserContext";
import { EquipmentObj, ItemObj, ListCounts } from "../../types/ModelTypes";
import SwapGestures from "../../components/member/SwapGestures";
import { useEquipment } from "../../helper/context/EquipmentContext";

/*
  Screen for swapping equipment between the current user and another user.
  This section mainly focuses on getting and passing down the equipment info
*/
export default function SwapEquipment() {
  const { orgUserStorage } = useUser();
  const { itemData, containerItem } = useEquipment();
  let swapUser = useRef<OrgUserStorage | null>(null);
  let [listOne, setListOne] = useState<ItemObj[]>([]);
  let [listTwo, setListTwo] = useState<ItemObj[]>([]);
  // keep track of the counts of equipment in each list so we can modify them
  // when an item is dragged in swapGestures.tsx
  const [listOneCounts, setListOneCounts] = useState<number[]>([]);
  const [listTwoCounts, setListTwoCounts] = useState<number[]>([]);
  const [containerCounts, setContainerCounts] = useState<number[]>([]);

  // gets and sets the equipment for the current user and the swap user
  // as well as the equipment counts
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
      setListTwoCounts([]);
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
    };
  }, []);

  // set the equipment counts for each list
  useEffect(() => {
    setListOneCounts(
      listOne.map((item) => {
        if (item.type === "equipment") {
          return (item as EquipmentObj).count;
        } else {
          return 1;
        }
      }),
    );
    setListTwoCounts(
      listTwo.map((item) => {
        if (item.type === "equipment") {
          return (item as EquipmentObj).count;
        } else {
          return 1;
        }
      }),
    );
  }, [listOne, listTwo]);

  // everytime a container is selected, set the container counts
  useEffect(() => {
    if (containerItem) {
      setContainerCounts(
        containerItem.equipment.map((item) => (item as EquipmentObj).count),
      );
    }
  }, [containerItem]);

  // determine which list to modify based on the type
  const determineSetList = (
    type: ListCounts,
  ): React.Dispatch<React.SetStateAction<number[]>> => {
    let setList;
    if (type === "one") {
      setList = setListOneCounts;
    } else if (type === "two") {
      setList = setListTwoCounts;
    } else {
      setList = setContainerCounts;
    }
    return setList;
  };

  // when a user drags an item, the remaining item count is decremented
  const decrementCountAtIndex = (index: number, type: ListCounts) => {
    const setList = determineSetList(type);
    setList((prevCounts) => {
      const newCounts = [...prevCounts];
      if (newCounts[index] > 0) {
        newCounts[index] -= 1;
      }
      return newCounts;
    });
  };

  // when a user stops dragging an item, the remaining item count is incremented
  const incrementCountAtIndex = (index: number, type: ListCounts) => {
    const setList = determineSetList(type);
    setList((prevCounts) => {
      const newCounts = [...prevCounts];
      newCounts[index] += 1;
      return newCounts;
    });
  };

  // get selected user equipment
  const handleSet = (inputUser: OrgUserStorage | null) => {
    swapUser.current = inputUser;
    setEquipment();
  };

  return (
    <SwapGestures
      listOne={listOne}
      listTwo={listTwo}
      handleSet={handleSet}
      swapUser={swapUser}
      listOneCounts={listOneCounts}
      listTwoCounts={listTwoCounts}
      containerCounts={containerCounts}
      decrementCountAtIndex={decrementCountAtIndex}
      incrementCountAtIndex={incrementCountAtIndex}
    />
  );
}
