import { useState, useRef } from "react";
import { Dimensions } from "react-native";
import {
  GestureStateChangeEvent,
  PanGestureHandlerEventPayload,
  GestureUpdateEvent,
  PanGestureChangeEventPayload,
} from "react-native-gesture-handler";

import { useEquipment } from "../../helper/context/EquipmentContext";
import { ItemObj, ListCounts } from "../../types/ModelTypes";

/*
  Hook that handles all the logic for dragging equipment
  when the container overlay is visible
*/
export default function useContainer({
  decrementCountAtIndex,
  draggingItem,
  setDraggingItem,
  startIdx,
  startSide,
}: {
  decrementCountAtIndex: (index: number, type: ListCounts) => void;
  draggingItem: ItemObj | null;
  setDraggingItem: (item: any) => void;
  startIdx: React.MutableRefObject<number | null>;
  startSide: React.MutableRefObject<string | null>;
}) {
  const [containerPage, setContainerPage] = useState(0);
  const overlayTimeout = useRef<NodeJS.Timeout | null>(null);
  const { containerItem, setContainerItem, setSwapContainerVisible } =
    useEquipment();

  // calculate the range of the container overlay
  const windowHeight = Dimensions.get("window").height;
  const windowWidth = Dimensions.get("window").width;
  const containerYRange = {
    start: 0.2 * windowHeight,
    end: 0.7 * windowHeight + 30,
  };
  const containerXRange = {
    start: 0.075 * windowWidth,
    end: 0.925 * windowWidth,
  };

  const containerSetItem = (
    gesture: GestureStateChangeEvent<PanGestureHandlerEventPayload>,
  ) => {
    if (!containerItem) return;
    const x = gesture.x;
    const y = gesture.y;
    // ensure the user is within the container overlay
    if (x < containerXRange.start || x > containerXRange.end) return;
    if (y < containerYRange.start || y > containerYRange.end) return;
    const row = Math.floor((y - containerYRange.start) / (0.18 * windowHeight));
    const col = Math.floor(
      (x - containerXRange.start) / ((windowWidth * 0.85) / 3),
    );
    const idx = containerPage * 9 + row * 3 + col;
    if (idx < 0 || idx > containerItem.equipment.length - 1) return;
    const item = containerItem.equipment[idx];
    decrementCountAtIndex(idx, "container");
    startIdx.current = idx;
    startSide.current = "container";
    setDraggingItem(item);
  };

  // when dragging an equipment while the container overlay is visible
  const containerHover = (
    gestureState: GestureUpdateEvent<
      PanGestureChangeEventPayload & PanGestureHandlerEventPayload
    >,
  ) => {
    if (!draggingItem) return;
    const x = gestureState.x;
    const y = gestureState.y;
    if (
      x < containerXRange.start ||
      x > containerXRange.end ||
      y < containerYRange.start ||
      y > containerYRange.end
    ) {
      if (overlayTimeout.current) {
        return;
      } else {
        overlayTimeout.current = setTimeout(() => {
          setSwapContainerVisible(false);
          setContainerItem(null);
          overlayTimeout.current = null;
        }, 500);
      }
    }
  };

  return {
    containerSetItem,
    containerHover,
    overlayTimeout,
    setContainerPage,
  };
}
