import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import EquipmentDisplay from "../../components/member/EquipmentDisplay";
import ContainerDisplay from "../../components/member/ContainerDisplay";
import { useItemImage } from "../../helper/context/ItemImageContext";
import { Tab } from "@rneui/themed";
import IconMenu from "../../components/organization/IconMenu";
import ColorSelect from "../../components/organization/ColorSelect";
import { ItemImageScreenProps } from "../../types/ScreenTypes";

export default function ItemImageScreen({ route }: ItemImageScreenProps) {
  const { index } = route.params;
  const [selected, setSelected] = useState(0);
  const { icon, color, setIcon, setColor } = useItemImage();

  return (
    <View>
      <View style={styles.topRow}>
        {index === 0 ? (
          <EquipmentDisplay image={icon} isMini={false} color={color} />
        ) : (
          <ContainerDisplay />
        )}
      </View>
      <View style={styles.table}>
        <View style={styles.header}>
          <Tab
            value={selected}
            onChange={setSelected}
            disableIndicator
            containerStyle={styles.tabContainer}
          >
            <Tab.Item>Icon</Tab.Item>
            <Tab.Item>Background</Tab.Item>
          </Tab>
        </View>
        <View style={styles.body}>
          {selected === 0 ? (
            <IconMenu setIcon={setIcon} />
          ) : (
            <ColorSelect color={color} setColor={setColor} />
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 7,
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  overlayStyles: {
    flex: 1,
    width: "100%",
    height: "100%",
    alignItems: "center",
  },
  tabContainer: {
    borderBottomWidth: 1,
  },
  table: {
    marginTop: "5%",
    width: "90%",
    height: "60%",
    backgroundColor: "lightgrey",
    display: "flex",
    flexDirection: "column",
    borderRadius: 20,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: "15%",
  },
});
