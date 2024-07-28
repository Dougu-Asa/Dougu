import React, { useState, useContext, useEffect } from "react";
import { LoadingContextType } from "../types/ContextTypes";
import { Hub } from "aws-amplify";

const LoadingContext = React.createContext<LoadingContextType | undefined>(
  undefined,
);

/* 
    Context that distributes the loading state to the app
    if loading, the app will display a loading indicator
    if !dataStoreReady, a loading page will be displayed
*/
export const LoadingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [dataStoreReady, setDataStoreReady] = useState(false);

  // start DataStore and listen for DataStore ready event
  useEffect(() => {
    const listener = Hub.listen("datastore", async (hubData) => {
      const { event } = hubData.payload;
      if (event === "ready") {
        setDataStoreReady(true);
      }
    });
    // listen for signout because datastore.clear() is called
    const authListener = Hub.listen("auth", (data) => {
      if (data.payload.event === "signOut") {
        setDataStoreReady(false);
      }
    });

    return () => {
      listener();
      authListener();
    };
  }, []);

  return (
    <LoadingContext.Provider
      value={{ isLoading, setIsLoading, dataStoreReady, setDataStoreReady }}
    >
      {children}
    </LoadingContext.Provider>
  );
};

// ensure that LoadingContext isn't undefined in useLoad
export const useLoad = (): LoadingContextType => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoad must be used within a LoadingProvider");
  }
  return context;
};
