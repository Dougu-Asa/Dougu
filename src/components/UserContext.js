import React, { useState} from 'react';

const UserContext = React.createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [org, setOrg] = useState(null);
    const [userOrg, setUserOrg] = useState(null);

    return (
        <UserContext.Provider value={{ user, setUser, org, setOrg, userOrg, setUserOrg}}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => React.useContext(UserContext);