import { Dispatch, SetStateAction } from "react";
import { OrgUserStorage, Organization } from "../models";
import { EquipmentObj, OrgItem, ContainerObj, Hex } from "./ModelTypes";
import { ImageSourcePropType } from "react-native";

/*
    Defines the types for the context objects used in the app.
    Specifically for UserContext and LoadingContext
*/
export type UserType = {
  name: string;
  email: string;
  id: string;
  profile: string;
};

export type UserContextType = {
  user: UserType | null;
  setUser: Dispatch<SetStateAction<UserType | null>>;
  org: Organization | null;
  setOrg: Dispatch<SetStateAction<Organization | null>>;
  orgUserStorage: OrgUserStorage | null;
  contextLoading: boolean;
  resetContext: () => void; // doesn't take a param, doesn't return anything
};

export type LoadingContextType = {
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
};

export type HeaderContextType = {
  infoFocus: boolean;
  setInfoFocus: Dispatch<SetStateAction<boolean>>;
  orgStackFocus: boolean;
  setOrgStackFocus: Dispatch<SetStateAction<boolean>>;
};

export type EquipmentContextType = {
  itemData: Map<string, OrgItem>;
  equipmentItem: EquipmentObj | null;
  setEquipmentItem: Dispatch<SetStateAction<EquipmentObj | null>>;
  containerItem: ContainerObj | null;
  setContainerItem: Dispatch<SetStateAction<ContainerObj | null>>;
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  containerVisible: boolean;
  setContainerVisible: Dispatch<SetStateAction<boolean>>;
  swapContainerVisible: boolean;
  setSwapContainerVisible: Dispatch<SetStateAction<boolean>>;
  modifyEquipmentItem: (item: EquipmentObj, newId: string) => void;
};

export type ItemImageContextType = {
  imageSource: ImageSourcePropType | null;
  setImageSource: Dispatch<SetStateAction<ImageSourcePropType | null>>;
  imageKey: string;
  setImageKey: Dispatch<SetStateAction<string>>;
  equipmentColor: Hex;
  setEquipmentColor: Dispatch<SetStateAction<Hex>>;
  containerColor: Hex;
  setContainerColor: Dispatch<SetStateAction<Hex>>;
};
