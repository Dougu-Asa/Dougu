import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { taiko } from "../../helper/ImageMapping";
import { Dispatch, SetStateAction } from "react";
import { chunkArray } from "../../helper/EquipmentUtils";

/*
  IconMenu displays a grid of icons that the user can choose from
  to represent their equipment. It is shown in the ItemImageScreen
  component.
*/
export default function IconMenu({
  setIcon,
}: {
  setIcon: Dispatch<SetStateAction<string>>;
}) {
  // show the icons in a grid of 4 columns
  const chunkedKeys = chunkArray(Object.keys(taiko), 4);

  return (
    <View style={styles.container}>
      <FlatList
        data={chunkedKeys}
        renderItem={({ item }) => (
          <View style={styles.row}>
            {item.map((key) => (
              <TouchableOpacity
                key={key}
                style={styles.iconContainer}
                onPress={() => setIcon(key)}
              >
                <Image
                  source={taiko[key]}
                  style={styles.icon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            ))}
          </View>
        )}
        keyExtractor={(item) => item[0]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
  },
  iconContainer: {
    flexBasis: "25%",
    justifyContent: "center",
  },
  icon: {
    margin: "auto",
    width: "90%",
    marginHorizontal: "auto",
  },
});
