import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import ContainerDisplay from "../../components/member/ContainerDisplay";
import { useItemImage } from "../../helper/context/ItemImageContext";
import { Tab } from "@rneui/themed";
import IconMenu from "../../components/IconMenu";
import ColorSelect from "../../components/organization/ColorSelect";
import UploadImage from "../../components/organization/UploadImage";
import { ItemImageScreenProps } from "../../types/ScreenTypes";
import { iconMapping } from "../../helper/ImageMapping";
import ItemImageDisplay from "../../components/organization/ItemImageDisplay";

/*
  ItemImageScreen is a screen that allows the user to select an icon and color
  for an equipment or container object.
*/
export default function ItemImageScreen({ route }: ItemImageScreenProps) {
  const { index } = route.params;
  const [selected, setSelected] = useState(0);
  // use a context to share state with CreateEquipmentScreen
  const {
    imageSource,
    equipmentColor,
    containerColor,
    setEquipmentColor,
    setContainerColor,
  } = useItemImage();

  return (
    <View style={styles.screen}>
      <View style={styles.topRow}>
        <View style={styles.display}>
          {index === 0 ? (
            <ItemImageDisplay
              imageSource={imageSource}
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
              index === 0 ? { width: "33%" } : { width: "100%" },
              { backgroundColor: "black" },
            ]}
            titleStyle={{ color: "black" }}
            containerStyle={{
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            }}
          >
            <Tab.Item
              icon={{ name: "brush", type: "ionicon", color: "black" }}
            ></Tab.Item>
            {index === 0 && (
              <Tab.Item
                icon={{
                  name: "camera",
                  type: "font-awesome",
                  color: "black",
                }}
              ></Tab.Item>
            )}
            {index === 0 && (
              <Tab.Item
                icon={{
                  name: "file",
                  type: "font-awesome",
                  color: "black",
                }}
              ></Tab.Item>
            )}
          </Tab>
        </View>
        <View style={styles.body}>
          {selected === 0 ? (
            <ColorSelect
              color={index === 0 ? equipmentColor : containerColor}
              setColor={index === 0 ? setEquipmentColor : setContainerColor}
            />
          ) : selected === 1 ? (
            <IconMenu data={iconMapping} />
          ) : selected === 2 ? (
            <UploadImage />
          ) : null}
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
