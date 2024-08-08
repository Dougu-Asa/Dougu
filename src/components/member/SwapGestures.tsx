import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, Dimensions } from "react-native";
import {
  GestureDetector,
  GestureHandlerRootView,
  Gesture,
} from "react-native-gesture-handler";

import { useEquipment } from "../../helper/context/EquipmentContext";
import { ContainerObj, EquipmentObj, ItemObj } from "../../types/ModelTypes";
import { OrgUserStorage } from "../../models";
import EquipmentItem from "./EquipmentItem";
import ContainerItem from "./ContainerItem";

export default function SwapGestures({
  listOne,
  listTwo,
  handleSet,
  swapUser,
}: {
  listOne: ItemObj[];
  listTwo: ItemObj[];
  handleSet: (user: OrgUserStorage | null) => void;
  swapUser: React.MutableRefObject<OrgUserStorage | null>;
}) {
  const { setSwapContainerVisible } = useEquipment();
  const [listOneCounts, setListOneCounts] = useState<number[]>([]);
  const [listTwoCounts, setListTwoCounts] = useState<number[]>([]);

  const decrementCountAtIndex = (
    index: number,
    setList: React.Dispatch<React.SetStateAction<number[]>>,
  ) => {
    if (!listOneCounts) return;
    setListOneCounts((prevCounts) => {
      const newCounts = [...prevCounts];
      if (newCounts[index] > 0) {
        newCounts[index] -= 1;
      }
      return newCounts;
    });
  };

  const incrementCountAtIndex = (
    index: number,
    setList: React.Dispatch<React.SetStateAction<number[]>>,
  ) => {
    if (!listOneCounts) return;
    setListOneCounts((prevCounts) => {
      const newCounts = [...prevCounts];
      newCounts[index] += 1;
      return newCounts;
    });
  };

  useEffect(() => {
    const counts = listOne.map((item) => {
      if (item.type === "equipment") {
        return (item as EquipmentObj).count;
      } else {
        return 0;
      }
    });
    setListOneCounts(counts);
  }, [listOne]);

  const panPressGesture = Gesture.Pan()
    .onStart((e) => {
      decrementCountAtIndex(4, setListOneCounts);
    })
    .onChange((e) => {
      console.log(e);
    })
    .onFinalize(() => {
      incrementCountAtIndex(4, setListOneCounts);
    })
    .activateAfterLongPress(600)
    .runOnJS(true);

  return (
    <GestureHandlerRootView>
      <GestureDetector gesture={panPressGesture}>
        <View style={styles.container}>
          {listOne.map((item, index) =>
            item.type === "equipment" ? (
              <EquipmentItem
                item={item as EquipmentObj}
                count={listOneCounts[index]}
                key={index}
              />
            ) : (
              <ContainerItem
                item={item as ContainerObj}
                swapable={false}
                key={index}
              />
            ),
          )}
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}

/*<View style={styles.infoContainer}>
            <Text style={styles.infoTxt}>
              To swap equipment, drag-and-drop your equipment with a team
              member!
            </Text>
          </View>
          <Text style={styles.userText}>My Equipment</Text> */

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    borderWidth: 1,
    backgroundColor: "#fff",
    height: Dimensions.get("window").height / 2,
  },
  infoContainer: {
    height: 80,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    borderBottomColor: "grey",
    borderBottomWidth: 0.5,
  },
  infoTxt: {
    fontSize: 16,
    fontWeight: "bold",
  },
  userText: {
    height: 40,
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 20,
  },
});
