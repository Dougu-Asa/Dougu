import { OrgUserStorage } from "../models";

export type EquipmentOrContainer = "equipment" | "container";

export interface ItemType {
  id: string;
  label: string;
  assignedTo: string;
  assignedToName: string;
  type: EquipmentOrContainer;
}

// how equipment data is stored in the app
export interface EquipmentObj extends ItemType {
  count: number;
  data: string[];
  detailData: string[];
}

export interface ContainerObj extends ItemType {
  id: string;
  label: string;
  assignedTo: string;
  assignedToName: string;
  equipment: EquipmentObj[];
}

export type OrgEquipmentObj = {
  assignedToName: string;
  equipment: EquipmentObj[];
};

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

export type TopOrBottom = "top" | "bottom";
