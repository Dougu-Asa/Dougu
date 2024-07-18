import { View } from "react-native";
import React, { useEffect } from "react";
import { useState } from "react";
import { DataStore } from "@aws-amplify/datastore";
import { ScrollView } from "react-native-gesture-handler";

// project imports
import { OrgUserStorage, Equipment } from "../../models";
import UserEquipment from "../../components/member/UserEquipment";
import { useUser } from "../../helper/UserContext";
import { processEquipmentData } from "../../helper/ProcessEquipment";
import type { EquipmentObj } from "../../types/ModelTypes";

function TeamEquipmentScreen() {
  const [orgEquipment, setOrgEquipment] = useState<EquipmentObj[][]>([]);
  const [orgUserStorages, setOrgUserStorages] = useState<
    { id: string; name: string }[]
  >([]);
  const { org } = useUser();

  useEffect(() => {
    async function getOrgEquipment() {
      const orgUserStorages = await DataStore.query(OrgUserStorage, (c) =>
        c.organization.id.eq(org!.id),
      );
      // get the names of each orgUserStorage
      const orgUserStorageNames = orgUserStorages.map((orgUserStorage) => ({
        id: orgUserStorage.id,
        name: orgUserStorage.name,
      }));
      setOrgUserStorages(orgUserStorageNames);
      let equipment = [];
      for (let i = 0; i < orgUserStorages.length; i++) {
        const userEquipment = await DataStore.query(Equipment, (c) =>
          c.assignedTo.id.eq(orgUserStorages[i].id),
        );
        const processedEquipment = processEquipmentData(userEquipment);
        equipment.push(processedEquipment);
      }
      setOrgEquipment(equipment);
    }

    const subscription = DataStore.observeQuery(Equipment).subscribe(
      (snapshot) => {
        const { items, isSynced } = snapshot;
        console.log(
          `teamEquipment [Snapshot] item count: ${items.length}, isSynced: ${isSynced}`,
        );
        getOrgEquipment();
      },
    );

    return () => subscription.unsubscribe();
  }, [org]);

  return (
    <View style={{ backgroundColor: "white", minHeight: "100%" }}>
      <ScrollView>
        {orgEquipment.map((equipmentRow, index) => (
          <UserEquipment
            key={index}
            list={equipmentRow}
            name={orgUserStorages[index] ? orgUserStorages[index].name : null}
          />
        ))}
      </ScrollView>
    </View>
  );
}

export default TeamEquipmentScreen;
