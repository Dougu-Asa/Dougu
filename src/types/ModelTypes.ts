import { OrgUserStorage } from "../models";

export type EquipmentObj = {
  id: string;
  label: string;
  count: number;
  data: string[];
};

export type UserNames = {
  label: string;
  value: string;
  data: OrgUserStorage;
};
