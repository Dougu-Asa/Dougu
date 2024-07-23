import { View } from "react-native";
import React, { useEffect } from "react";
import { useState } from "react";
import { DataStore } from "@aws-amplify/datastore";
import { ScrollView } from "react-native-gesture-handler";

// project imports
import { Equipment } from "../../models";
import UserEquipment from "../../components/member/UserEquipment";
import { useUser } from "../../helper/UserContext";
import { getOrgEquipment } from "../../helper/DataStoreUtils";
import type { OrgEquipmentObj } from "../../types/ModelTypes";

/*
  Screen for viewing all equipment in the organization
  Groups equipment by the orgUserStorage it is assigned to
*/
function TeamEquipmentScreen() {
  const [orgEquipment, setOrgEquipment] = useState<OrgEquipmentObj[]>([]);
  const { org } = useUser();

  useEffect(() => {
    async function handleGetEquipment() {
      const equipment = await getOrgEquipment(org!.id);
      setOrgEquipment(equipment);
    }

    const subscription = DataStore.observeQuery(Equipment).subscribe(() => {
      handleGetEquipment();
    });

    return () => subscription.unsubscribe();
  }, [org]);

  return (
    <View style={{ backgroundColor: "white", minHeight: "100%" }}>
      <ScrollView>
        {orgEquipment.map((orgEquipment, index) => (
          <UserEquipment
            key={index}
            list={orgEquipment.equipment}
            name={orgEquipment.assignedToName}
          />
        ))}
      </ScrollView>
    </View>
  );
}

export default TeamEquipmentScreen;
