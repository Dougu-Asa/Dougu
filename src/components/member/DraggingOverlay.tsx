import React, { useState, forwardRef, useImperativeHandle } from "react";
import { Animated, StyleSheet } from "react-native";

import EquipmentItem from "./EquipmentItem";
import {
  DraggingOffset,
  DraggingOverlayHandle,
  EquipmentObj,
  StartPosition,
} from "../../types/ModelTypes";

/*
  DraggingOverlay is a component that displays the equipment object being dragged
  around the screen. It uses the Animated API to move the equipment object.
  It is used in the SwapEquipment screen to overlay the dragged equipment, since
  the equipment object gets clipped when dragged outside the ScrollView.
*/
const DraggingOverlay = forwardRef<DraggingOverlayHandle>((props, ref) => {
  DraggingOverlay.displayName = "DraggingOverlay";
  const [draggingItem, setDraggingItem] = useState<EquipmentObj | null>(null);
  const [draggingOffset, setDraggingOffset] = useState<DraggingOffset>({
    dx: 0,
    dy: 0,
  });
  const [startPosition, setStartPosition] = useState<StartPosition>({
    top: 0,
    left: 0,
  });

  useImperativeHandle(ref, () => ({
    setDraggingItem,
    setDraggingOffset,
    setStartPosition,
  }));

  return (
    <>
      {draggingItem && (
        <Animated.View
          style={[
            styles.floatingItem,
            {
              transform: [
                { translateX: draggingOffset.dx },
                { translateY: draggingOffset.dy },
              ],
            },
            { top: startPosition.top, left: startPosition.left },
          ]}
        >
          <EquipmentItem item={draggingItem} count={1} />
        </Animated.View>
      )}
      {draggingItem != null && draggingItem.count > 1 ? (
        <Animated.View
          style={[
            styles.floatingItem,
            { top: startPosition.top, left: startPosition.left },
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
