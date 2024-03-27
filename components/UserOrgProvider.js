import React, { useState} from 'react';

const UserOrgContext = React.createContext();

export const UserOrgProvider = ({ children }) => {
    const [currOrg, setCurrOrg] = useState({});
    return (
    <UserOrgContext.Provider value={{ currOrg, setCurrOrg}}>
        {children}
    </UserOrgContext.Provider>
    );
}

export const useUserOrg = () => React.useContext(UserOrgContext);