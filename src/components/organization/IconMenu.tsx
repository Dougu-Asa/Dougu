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

export default function IconMenu({
  setIcon,
}: {
  setIcon: Dispatch<SetStateAction<string>>;
}) {
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
