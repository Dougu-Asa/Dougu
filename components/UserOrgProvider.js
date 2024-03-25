// React context that provides the current organization to all components that need it
// as well as current OrgUserStorage object
import React, { createContext, useState } from 'react';

// Create the context
const UserOrgContext = React.createContext();

// Create a provider component
export const UserOrgProvider = ({ children }) => {
    const [currOrg, setCurrOrg] = useState(null);
    const [currOrgUserStorage, setCurrOrgUserStorage] = useState(null);

    return (
        <UserOrgContext.Provider value={{currOrg, setCurrOrg,
        currOrgUserStorage, setCurrOrgUserStorage}}>
            {children}
        </UserOrgContext.Provider>
    );
};

export const useUserOrg = () => React.useContext(UserOrgContext);