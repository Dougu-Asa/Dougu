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
    <View style={styles.screen}>
      <View style={styles.topRow}>
        <View style={styles.display}>
          {index === 0 ? (
            <EquipmentDisplay image={icon} isMini={false} color={color} />
          ) : (
            <ContainerDisplay color={color} />
          )}
        </View>
      </View>
      <View style={styles.table}>
        <View style={styles.header}>
          <Tab
            value={selected}
            onChange={setSelected}
            disableIndicator
            containerStyle={styles.tabContainer}
          >
            <Tab.Item>Background</Tab.Item>
            {index === 0 && <Tab.Item>Icon</Tab.Item>}
          </Tab>
        </View>
        <View style={styles.body}>
          {selected === 0 ? (
            <ColorSelect color={color} setColor={setColor} />
          ) : (
            <IconMenu setIcon={setIcon} />
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
  display: {
    marginTop: 30,
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
  screen: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
  },
  tabContainer: {
    borderBottomWidth: 1,
  },
  table: {
    flex: 8,
    marginBottom: "10%",
    width: "90%",
    height: "70%",
    backgroundColor: "lightgrey",
    display: "flex",
    flexDirection: "column",
    borderRadius: 20,
  },
  topRow: {
    flex: 2.5,
  },
});
