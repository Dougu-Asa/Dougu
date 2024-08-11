import { Alert } from "react-native";
import { DataStore } from "@aws-amplify/datastore";
import {
  GestureStateChangeEvent,
  PanGestureHandlerEventPayload,
} from "react-native-gesture-handler";

import { useUser } from "../../helper/context/UserContext";
import { handleError } from "../../helper/Utils";
import { useLoad } from "../../helper/context/LoadingContext";
import {
  EquipmentObj,
  ContainerObj,
  ItemObj,
  ListCounts,
} from "../../types/ModelTypes";
import { useEquipment } from "../../helper/context/EquipmentContext";
import { OrgUserStorage, Equipment, Container } from "../../models";

export default function useSwap({
  draggingItem,
  startIdx,
  startSide,
  hoverContainer,
  halfLine,
  swapUser,
  incrementCountAtIndex,
}: {
  draggingItem: ItemObj | null;
  startIdx: React.MutableRefObject<number | null>;
  startSide: React.MutableRefObject<string | null>;
  hoverContainer: React.MutableRefObject<ContainerObj | null>;
  halfLine: React.MutableRefObject<number>;
  swapUser: React.MutableRefObject<OrgUserStorage | null>;
  incrementCountAtIndex: (index: number, type: ListCounts) => void;
}) {
  const { orgUserStorage } = useUser();
  const { setIsLoading } = useLoad();
  const { swapContainerVisible } = useEquipment();

  // reassign the equipment to the new OrgUserStorage by the id passed in
  // Equipment -> UserStorage
  const reassignEquipment = async (
    item: EquipmentObj,
    assignedTo: OrgUserStorage,
  ) => {
    try {
      if (item.assignedTo === assignedTo.id) return;
      setIsLoading(true);
      // ensure equipment and user exist
      const swapOrgUserStorage = await DataStore.query(
        OrgUserStorage,
        assignedTo.id,
      );
      const equip = await DataStore.query(Equipment, item.id);
      if (!swapOrgUserStorage)
        throw new Error("OrgUserStorage does not exist!");
      if (!equip) throw new Error("Equipment does not exist!");
      // reassign
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
  // Container -> UserStorage
  const reassignContainer = async (
    item: ContainerObj,
    assignedTo: OrgUserStorage,
  ) => {
    try {
      if (item.assignedTo === assignedTo.id) return;
      setIsLoading(true);
      // ensure container and user exist
      const swapOrgUserStorage = await DataStore.query(
        OrgUserStorage,
        assignedTo.id,
      );
      const container = await DataStore.query(Container, item.id);
      if (!swapOrgUserStorage)
        throw new Error("OrgUserStorage does not exist!");
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
      setIsLoading(false);
      Alert.alert("Swap Successful!");
    } catch (e) {
      handleError("Swap Container", e as Error, setIsLoading);
    }
  };

  // reassign the equipment to the container by the id passed in
  // Equipment -> Container
  const addEquipmentToContainer = async (
    item: EquipmentObj,
    containerItem: ContainerObj,
  ) => {
    try {
      if (item.container === containerItem.id) return;
      setIsLoading(true);
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
      setIsLoading(false);
      Alert.alert("Added Equipment to Container!");
    } catch (e) {
      handleError("addEquipmentToContainer", e as Error, setIsLoading);
    }
  };

  // reassign the equipment out of the container
  // Equipment -> Out of Container
  const moveOutOfContainer = async (
    item: EquipmentObj,
    assignedTo: OrgUserStorage,
  ) => {
    try {
      setIsLoading(true);
      // ensure equipment and user exist
      const equip = await DataStore.query(Equipment, item.id);
      const assignedToUser = await DataStore.query(
        OrgUserStorage,
        assignedTo.id,
      );
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
      setIsLoading(false);
      Alert.alert("Equipment Moved Out of Container!");
    } catch (e) {
      handleError("Move Out of Container", e as Error, setIsLoading);
    }
  };

  // decide where to reassign the equipment
  const handleReassign = async (
    gestureEvent: GestureStateChangeEvent<PanGestureHandlerEventPayload>,
  ) => {
    if (!draggingItem || startIdx.current == null) return;
    let countType: ListCounts;
    if (startSide.current === "top") {
      countType = "one";
    } else if (startSide.current === "bottom") {
      countType = "two";
    } else {
      countType = "container";
    }
    incrementCountAtIndex(startIdx.current, countType);
    if (swapContainerVisible) return;
    // equipment -> container
    if (draggingItem.type === "equipment" && hoverContainer.current) {
      console.log("reassigning equipment to container");
      addEquipmentToContainer(
        draggingItem as EquipmentObj,
        hoverContainer.current,
      );
      return;
    }
    if (!orgUserStorage || !swapUser.current) return;
    const assignTo =
      gestureEvent.y < halfLine.current ? orgUserStorage : swapUser.current;
    // dragging a container
    if (draggingItem.type === "container") {
      reassignContainer(draggingItem as ContainerObj, assignTo);
    } else {
      // dragging equipment
      // check if we are moving equipment out of a container
      if ((draggingItem as EquipmentObj).container != null) {
        moveOutOfContainer(draggingItem as EquipmentObj, assignTo);
      } else {
        reassignEquipment(draggingItem as EquipmentObj, assignTo);
      }
    }
  };

  return { handleReassign };
}
