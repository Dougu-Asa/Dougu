import { OrgUserStorage } from "../models";

// how equipment data is stored in the app
export type EquipmentObj = {
  id: string;
  label: string;
  count: number;
  data: string[];
  assignedTo: string;
  assignedToName: string;
};

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

export type DimensionsType = {
  width: number;
  height: number;
};

export type DraggingOffset = {
  dx: number;
  dy: number;
};

export type StartPosition = {
  left: number;
  top: number;
};

export interface DraggingOverlayHandle {
  setDraggingItem: React.Dispatch<React.SetStateAction<EquipmentObj | null>>;
  setDraggingOffset: React.Dispatch<React.SetStateAction<DraggingOffset>>;
  setStartPosition: React.Dispatch<React.SetStateAction<StartPosition>>;
}

export type TopOrBottom = "top" | "bottom";
