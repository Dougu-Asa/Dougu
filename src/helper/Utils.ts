import * as Sentry from "@sentry/react-native";
import { Alert } from "react-native";
import { Dispatch, SetStateAction } from "react";
import { Auth, DataStore } from "aws-amplify";

/* this function handles errors in the app by stopping the loading indicator, logging the error, and alerting the user */
export const handleError = (
  methodName: string,
  error: Error,
  setIsLoading: Dispatch<SetStateAction<boolean>> | null,
) => {
  if (!methodName || !error) {
    console.log("Error in handleError: Missing parameters");
    return;
  }
  if (setIsLoading) setIsLoading(false);
  console.log(`Error in ${methodName}: ${error}`);
  Sentry.setTag("methodName", methodName);
  Sentry.captureException(error);
  Alert.alert(`Error in ${methodName}`, error.message, [{ text: "OK" }]);
  return error;
};

export const signOut = async (
  setIsLoading: Dispatch<SetStateAction<boolean>>,
  // use any type because multiple navigation types are used
  navigation: any,
  resetContext: () => void,
) => {
  try {
    setIsLoading(true);
    await Auth.signOut();
    setIsLoading(false);
    navigation.navigate("Home");
    resetContext();
    DataStore.clear();
  } catch (error) {
    handleError("handleSignOut", error as Error, setIsLoading);
  }
};
