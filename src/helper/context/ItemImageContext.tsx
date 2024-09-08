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
  const [image, setImage] = useState<string>("default");
  const [equipmentColor, setEquipmentColor] = useState<Hex>("#87ceeb");
  const [containerColor, setContainerColor] = useState<Hex>("#dedede");

  return (
    <ItemImageContext.Provider
      value={{
        image,
        setImage,
        equipmentColor,
        setEquipmentColor,
        containerColor,
        setContainerColor,
      }}
    >
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
