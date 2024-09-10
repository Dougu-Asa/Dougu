import {
  FlatList,
  Image,
  ImageSourcePropType,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { chunkArray } from "../helper/EquipmentUtils";
import { useItemImage } from "../helper/context/ItemImageContext";

/*
  IconMenu displays a grid of icons that the user can choose from
  to represent their equipment. It is shown in the ItemImageScreen
  component.
*/
export default function IconMenu({
  data,
}: {
  data: {
    [key: string]: ImageSourcePropType;
  };
}) {
  // show the icons in a grid of 4 columns
  const chunkedKeys = chunkArray(Object.keys(data), 4);
  const { setImageSource, setImageKey } = useItemImage();

  const handleSet = (imageKey: string) => {
    // key isn't always the same as the image source
    setImageSource(data[imageKey]);
    setImageKey(imageKey);
  };

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
                onPress={() => handleSet(key)}
              >
                <Image
                  source={data[key]}
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
    aspectRatio: 1,
  },
  icon: {
    margin: "auto",
    width: "90%",
    marginHorizontal: "auto",
  },
});
