import { useEffect, useState } from "react";
import { Dimensions } from "react-native";

export default function useConstants() {
  const [windowWidth, setWindowWidth] = useState(
    Dimensions.get("window").width,
  );
  const [windowHeight, setWindowHeight] = useState(
    Dimensions.get("window").height,
  );

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setWindowWidth(window.width);
      setWindowHeight(window.height);
    });
    return () => subscription?.remove();
  });

  return {
    windowHeight,
    windowWidth,
  };
}
