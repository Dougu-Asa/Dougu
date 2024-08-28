import React from "react";
import { StyleSheet, Button, View } from "react-native";

import EquipmentDisplay from "../member/EquipmentDisplay";
import ContainerDisplay from "../member/ContainerDisplay";
import { Hex } from "../../types/ModelTypes";
import { Overlay, Tab } from "@rneui/themed";
import IconMenu from "./IconMenu";
import ColorSelect from "./ColorSelect";

/*
    This overlay is what is shown when the user taps
    on an equipment item. It displays the equipment item's 
    stats, counts, and grouped equipment items.
*/
export default function ItemImageOverlay({
  visible,
  setVisible,
  index,
  color,
  setColor,
  icon,
  setIcon,
}: {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  index: number;
  color: Hex;
  setColor: React.Dispatch<React.SetStateAction<Hex>>;
  icon: string;
  setIcon: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [selected, setSelected] = React.useState(0);

  return (
    <Overlay
      isVisible={visible}
      fullScreen={true}
      animationType="fade"
      overlayStyle={styles.overlayStyles}
    >
      <View style={styles.topRow}>
        {index === 0 ? (
          <EquipmentDisplay image={icon} isMini={false} color={color} />
        ) : (
          <ContainerDisplay />
        )}
      </View>
      <View style={styles.table}>
        <View style={styles.header}>
          <Tab value={selected} onChange={setSelected} dense>
            <Tab.Item>Icon</Tab.Item>
            <Tab.Item>Background</Tab.Item>
          </Tab>
        </View>
        <View style={styles.body}>
          {selected === 0 ? (
            <IconMenu />
          ) : (
            <ColorSelect color={color} setColor={setColor} />
          )}
        </View>
      </View>
      <Button onPress={() => setVisible(false)} title="close" />
    </Overlay>
  );
}

const styles = StyleSheet.create({
  body: {
    borderWidth: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  overlayStyles: {
    flex: 1,
    width: "100%",
    height: "100%",
    alignItems: "center",
  },
  table: {
    width: "90%",
    height: "60%",
    backgroundColor: "lightgrey",
    display: "flex",
    flexDirection: "column",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "center",
  },
});
