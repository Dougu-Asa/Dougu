import React, { useState, useEffect, useContext } from "react";
import { DataStore } from "@aws-amplify/datastore";

import { OrgUserStorage } from "../models";
import { OrgType, UserType, UserContextType } from "../types/ContextTypes";

/* Context that distributes the user object, organization object, and the user's organization object
    so that amplify datastore calls won't need to query for it */
const UserContext = React.createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [org, setOrg] = useState<OrgType | null>(null);
  const [orgUserStorage, setOrgUserStorage] = useState<OrgUserStorage | null>(
    null,
  );

  // When the user and org are set, get the user's organization object
  useEffect(() => {
    // uses datastore to query the orgUserStorage from org and user
    const getOrgUserStorage = async () => {
      if (!org || !user) return;
      const orgUser = await DataStore.query(OrgUserStorage, (c) =>
        c.and((c) => [
          c.organization.name.eq(org.name),
          c.user.userId.eq(user.attributes.sub),
        ]),
      );
      setOrgUserStorage(orgUser[0]);
    };

    getOrgUserStorage();
  }, [user, org]);

  // cleans up the context upon signing out
  const resetContext = () => {
    setUser(null);
    setOrg(null);
    setOrgUserStorage(null);
  };

  return (
    <UserContext.Provider
      value={{ user, setUser, org, setOrg, orgUserStorage, resetContext }}
    >
      {children}
    </UserContext.Provider>
  );
};

// ensure that UserContext isn't undefined in useUser
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
