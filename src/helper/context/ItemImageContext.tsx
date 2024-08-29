import React, { useState, useContext } from "react";
import { Hex } from "../../types/ModelTypes";
import { ItemImageContextType } from "../../types/ContextTypes";

const ItemImageContext = React.createContext<ItemImageContextType | undefined>(
  undefined,
);

/* 
    Context that distributes the loading state to the app
    if loading, the app will display a loading indicator
    if !dataStoreReady, a loading page will be displayed
*/
export default function ItemImageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [icon, setIcon] = useState("default");
  const [color, setColor] = useState<Hex>("#87ceeb");

  return (
    <ItemImageContext.Provider value={{ icon, setIcon, color, setColor }}>
      {children}
    </ItemImageContext.Provider>
  );
}

// ensure that LoadingContext isn't undefined in useLoad
export const useItemImage = (): ItemImageContextType => {
  const context = useContext(ItemImageContext);
  if (!context) {
    throw new Error("useItemImage must be used within an IteMImageProvider");
  }
  return context;
};
