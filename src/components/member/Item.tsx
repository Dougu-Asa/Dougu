import { ContainerObj, EquipmentObj, ItemObj } from "../../types/ModelTypes";
import ContainerItem from "./ContainerItem";
import EquipmentItem from "./EquipmentItem";

// Item is a component that displays either an equipment or container object
export default function Item({
  data,
  countData,
  swapable,
}: {
  data: ItemObj;
  countData?: number;
  swapable: boolean;
}) {
  return (
    <>
      {data.type === "equipment" ? (
        <EquipmentItem
          item={data as EquipmentObj}
          count={countData != null ? countData : (data as EquipmentObj).count}
        />
      ) : (
        <ContainerItem
          item={data as ContainerObj}
          swapable={swapable}
          count={countData != null ? countData : 1}
        />
      )}
    </>
  );
}
