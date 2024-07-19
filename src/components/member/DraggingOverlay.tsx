import React, { useState, forwardRef, useImperativeHandle } from "react";
import { Animated, StyleSheet } from "react-native";

import EquipmentItem from "./EquipmentItem";

const DraggingOverlay = forwardRef((props, ref) => {
  DraggingOverlay.displayName = "DraggingOverlay";
  const [draggingItem, setDraggingItem] = useState(null);
  const [draggingOffset, setDraggingOffset] = useState({ x: 0, y: 0 });
  const [floatingPosition, setFloatingPosition] = useState({ top: 0, left: 0 });

  useImperativeHandle(ref, () => ({
    setDraggingItem,
    setDraggingOffset,
    setFloatingPosition,
  }));

  return (
    <>
      {draggingItem && (
        <Animated.View
          style={[
            styles.floatingItem,
            {
              transform: [
                { translateX: draggingOffset.x },
                { translateY: draggingOffset.y },
              ],
            },
            { top: floatingPosition.top, left: floatingPosition.left },
          ]}
        >
          <EquipmentItem item={draggingItem} count={1} />
        </Animated.View>
      )}
      {draggingItem != null && draggingItem.count > 1 ? (
        <Animated.View
          style={[
            styles.floatingItem,
            { top: floatingPosition.top, left: floatingPosition.left },
          ]}
        >
          <EquipmentItem item={draggingItem} count={draggingItem.count - 1} />
        </Animated.View>
      ) : null}
    </>
  );
});

export default DraggingOverlay;

const styles = StyleSheet.create({
  floatingItem: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
});
