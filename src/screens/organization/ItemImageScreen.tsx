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
  const {
    icon,
    equipmentColor,
    containerColor,
    setIcon,
    setEquipmentColor,
    setContainerColor,
  } = useItemImage();

  return (
    <View style={styles.screen}>
      <View style={styles.topRow}>
        <View style={styles.display}>
          {index === 0 ? (
            <EquipmentDisplay
              image={icon}
              isMini={false}
              color={equipmentColor}
            />
          ) : (
            <ContainerDisplay color={containerColor} />
          )}
        </View>
      </View>
      <View style={styles.table}>
        <View style={styles.header}>
          <Tab
            value={selected}
            onChange={setSelected}
            iconPosition="left"
            indicatorStyle={[
              index === 0 ? { width: "50%" } : { width: "100%" },
              { backgroundColor: "black" },
            ]}
            titleStyle={{ color: "black" }}
            containerStyle={{
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            }}
          >
            <Tab.Item icon={{ name: "brush", type: "ionicon", color: "black" }}>
              Color
            </Tab.Item>
            {index === 0 && (
              <Tab.Item
                icon={{ name: "camera", type: "font-awesome", color: "black" }}
              >
                Icon
              </Tab.Item>
            )}
          </Tab>
        </View>
        <View style={styles.body}>
          {selected === 0 ? (
            <ColorSelect
              color={index === 0 ? equipmentColor : containerColor}
              setColor={index === 0 ? setEquipmentColor : setContainerColor}
            />
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
    backgroundColor: "#e9e9e9",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  display: {
    marginTop: 30,
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
  screen: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
  },
  table: {
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
