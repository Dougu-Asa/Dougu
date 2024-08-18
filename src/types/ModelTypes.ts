import { OrgUserStorage } from "../models";

export type EquipmentOrContainer = "equipment" | "container";

export interface ItemObj {
  id: string;
  label: string;
  assignedTo: string;
  assignedToName: string;
  type: EquipmentOrContainer;
}

// how equipment data is stored in the app
export interface EquipmentObj extends ItemObj {
  count: number;
  data: string[];
  detailData: string[];
  container: string | null;
}

export interface ContainerObj extends ItemObj {
  equipment: EquipmentObj[];
}

export interface OrgItem {
  assignedToName: string;
  data: ItemObj[];
}

// for current members dropdown
export type UserNames = {
  label: string;
  value: string;
  data: OrgUserStorage;
};

// SwapEquipment stuff
export type Position = {
  x: number;
  y: number;
};

// either listOne, listTwo, or container for the swapEquipment screen
export type ListCounts = "one" | "two" | "container";

export type csvSheet = {
  header: string[];
  identityCol: string[];
  values: string[][];
};
