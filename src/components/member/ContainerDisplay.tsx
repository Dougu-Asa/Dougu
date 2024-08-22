import { Pressable, View } from "react-native";
import { itemStyles } from "../../styles/ItemStyles";

export default function ContainerDisplay() {
  return (
    <View style={itemStyles.backDrop}>
      <Pressable
        style={({ pressed }) => [
          {
            opacity: pressed ? 0.7 : 1,
          },
          itemStyles.containerItem,
        ]}
      ></Pressable>
    </View>
  );
}
