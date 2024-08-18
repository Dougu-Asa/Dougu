import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

import { useEquipment } from "../../helper/context/EquipmentContext";
import { getCsvData } from "../../helper/EquipmentUtils";
import { ScrollView } from "react-native-gesture-handler";
import Animated, {
  ScrollHandlerProcessed,
  scrollTo,
  SharedValue,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import { csvSheet } from "../../types/ModelTypes";

function Cell({ data }: { data: string }) {
  return (
    <View style={styles.cell}>
      <Text>{data}</Text>
    </View>
  );
}

function Col({ data }: { data: string[] }) {
  return (
    <View>
      {data.map((d, index) => (
        <Cell data={d} key={index} />
      ))}
    </View>
  );
}

function HeaderView({
  equipmentLabels,
  offsetX,
}: {
  equipmentLabels: string[];
  offsetX: SharedValue<number>;
}) {
  const scrollRef = useAnimatedRef<Animated.ScrollView>();

  useDerivedValue(() => {
    scrollTo(scrollRef, offsetX.value, 0, true);
  });

  return (
    <View style={styles.row}>
      <Cell data={"Assigned To"} key={-1} />
      <Animated.ScrollView
        horizontal={true}
        ref={scrollRef}
        showsHorizontalScrollIndicator={false}
      >
        {equipmentLabels.map((label, index) => (
          <Cell data={label} key={index} />
        ))}
      </Animated.ScrollView>
    </View>
  );
}

function BodyView({
  identityCol,
  values,
  scrollHandler,
}: {
  identityCol: string[];
  values: string[][];
  scrollHandler: ScrollHandlerProcessed<Record<string, unknown>>;
}) {
  return (
    <View style={styles.body}>
      <Col data={identityCol} />
      <Animated.FlatList
        data={values}
        renderItem={({ item, index }) => <Col data={item} />}
        keyExtractor={(item, index) => index.toString()}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
      />
    </View>
  );
}

export default function SheetScreen() {
  const { itemData } = useEquipment();
  const [data, setData] = React.useState<csvSheet | null>(null);
  const offsetX = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler((event) => {
    offsetX.value = event.contentOffset.x;
  });

  // keep the data up to date
  useEffect(() => {
    setData(getCsvData(itemData));
  }, [itemData]);

  return (
    <View style={styles.container}>
      <HeaderView equipmentLabels={data ? data.header : []} offsetX={offsetX} />
      <ScrollView>
        <BodyView
          identityCol={data ? data.identityCol : []}
          values={data ? data.values : []}
          scrollHandler={scrollHandler}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    flexDirection: "row",
  },
  cell: {
    borderWidth: 1,
    borderColor: "black",
    width: 100,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "#fff",
    flex: 1,
    flexDirection: "column",
  },
  row: {
    flexDirection: "row",
    height: 80,
  },
});
