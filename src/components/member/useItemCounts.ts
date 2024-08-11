import { useEffect, useState } from "react";
import { EquipmentObj, ItemObj, ListCounts } from "../../types/ModelTypes";
import { useEquipment } from "../../helper/context/EquipmentContext";

/* 
  hook to keep track of the counts of equipment in each list so we can modify them
  without modifying the item itself when the item is dragged in swapGestures.tsx.
*/
export default function useItemCounts({
  listOne,
  listTwo,
}: {
  listOne: ItemObj[];
  listTwo: ItemObj[];
}) {
  const [listOneCounts, setListOneCounts] = useState<number[]>([]);
  const [listTwoCounts, setListTwoCounts] = useState<number[]>([]);
  const [containerCounts, setContainerCounts] = useState<number[]>([]);
  const { containerItem } = useEquipment();

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

  return {
    listOneCounts,
    listTwoCounts,
    containerCounts,
    decrementCountAtIndex,
    incrementCountAtIndex,
  };
}
