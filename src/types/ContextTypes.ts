import { Dispatch, SetStateAction } from 'react';
import { OrgUserStorage } from '../models';

/*
    Defines the types for the context objects used in the app.
    Specifically for UserContext and LoadingContext
*/

// userContext types
export type OrgType = {
    name: string;
    id: string;
    [key: string]: any; // Allows any other properties
};

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
    org: OrgType | null;
    setOrg: Dispatch<SetStateAction<OrgType | null>>;
    orgUserStorage: OrgUserStorage | null;
    resetContext: () => void;       // doesn't take a param, doesn't return anything
};


// loadingContext types
export type LoadingContextType = {
    isLoading: boolean;
    setIsLoading: Dispatch<SetStateAction<boolean>>;
};