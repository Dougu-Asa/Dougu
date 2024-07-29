import { Dispatch, SetStateAction } from "react";
import { OrgUserStorage, Organization } from "../models";

/*
    Defines the types for the context objects used in the app.
    Specifically for UserContext and LoadingContext
*/

export type UserType = {
  attributes: {
    sub: string;
    name: string;
    [key: string]: any;
  };
  [key: string]: any;
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

// loadingContext types
export type LoadingContextType = {
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
};
