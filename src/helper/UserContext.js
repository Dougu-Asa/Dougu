import React, { useState, useEffect} from 'react';
import { DataStore } from '@aws-amplify/datastore';

import { OrgUserStorage } from '../models';

/* Context that distributes the user object, organization object, and the user's organization object
    so that amplify datastore calls won't need to query for it */

const UserContext = React.createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [org, setOrg] = useState(null);
    const [orgUserStorage, setOrgUserStorage] = useState(null);

    // When the user and org are set, get the user's organization object
    useEffect(() => {
        if (user && org) {
            getOrgUserStorage();
        }
    }, [user, org]);

    // uses datastore to query the orgUserStorage from org and user
    const getOrgUserStorage = async () => {
        const orgUser = await DataStore.query(OrgUserStorage, (c) => c.and(c => [
            c.organization.name.eq(org.name),
            c.user.userId.eq(user.attributes.sub),
        ]));
        setOrgUserStorage(orgUser[0]);
    }

    // cleans up the context upon signing out
    const resetContext = () => {
        setUser(null);
        setOrg(null);
        setOrgUserStorage(null);
    };

    return (
        <UserContext.Provider value={{ user, setUser, org, setOrg, orgUserStorage, resetContext}}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => React.useContext(UserContext);