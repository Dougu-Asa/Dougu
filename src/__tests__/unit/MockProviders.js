import React from "react";
import { LoadingProvider } from "../../helper/LoadingContext";
import { UserProvider } from "../../helper/UserContext";
/* eslint-disable no-undef */

const MockLoadingProvider = ({ children, isLoading }) => {
  const setIsLoading = jest.fn();
  return (
    <LoadingProvider value={{ isLoading, setIsLoading }}>
      {children}
    </LoadingProvider>
  );
};

const MockUserProvider = ({
  children,
  user,
  org,
  orgUserStorage,
  contextLoading,
}) => {
  const setUser = jest.fn();
  const setOrg = jest.fn();
  const resetContext = jest.fn();
  return (
    <UserProvider
      value={{
        user,
        setUser,
        org,
        setOrg,
        orgUserStorage,
        contextLoading,
        resetContext,
      }}
    >
      {children}
    </UserProvider>
  );
};

export { MockLoadingProvider, MockUserProvider };
