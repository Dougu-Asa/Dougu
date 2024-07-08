import React, { useState} from 'react';

/* Context that distributes the user object, organization object, and the user's organization object
    so that amplify datastore calls won't need to query for it */

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