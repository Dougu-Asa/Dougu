import { useContext, createContext, ReactNode, useRef } from "react";
import { ImageSourcePropType } from "react-native";
import { ImageContextType } from "../../types/ContextTypes";

const ImageContext = createContext<ImageContextType | undefined>(undefined);

/* 
    Context that stores a map of string: ImageSourcePropType
    to be used throughout the app. This allows for a single
    source of truth for all images, and to prevent multiple
    fetches of the same image
*/
export default function ImageProvider({ children }: { children: ReactNode }) {
  const imageMap = useRef<Map<string, ImageSourcePropType>>(new Map());

  return (
    <ImageContext.Provider
      value={{
        imageMap: imageMap.current,
      }}
    >
      {children}
    </ImageContext.Provider>
  );
}

// ensure that LoadingContext isn't undefined in useLoad
export const useImage = (): ImageContextType => {
  const context = useContext(ImageContext);
  if (!context) {
    throw new Error("useLoad must be used within a LoadingProvider");
  }
  return context;
};
