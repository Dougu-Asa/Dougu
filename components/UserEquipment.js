import React, { useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Dimensions } from 'react-native';

function UserEquipment({list, name}) {

    return (
        <View style={styles.userContainer}>
            <Text style={styles.scrollText}>{name.name}</Text>
            <ScrollView horizontal={true}
            decelerationRate={'normal'}
            showsHorizontalScrollIndicator={false}>
                <View style={styles.scrollRow}>
                <View style={styles.scrollTop}>
                    {list.map((item) => (
                        <Equipment key={item.label} item={item} />
                    ))}
                </View>
                </View>
            </ScrollView>
        </View>
    );
}

export default UserEquipment;

function Equipment({item}) {

    return (
        <View style={equipment.equipment}>
            <Text>{item.label}</Text>
            <View style={equipment.circle}>
                <Text style={equipment.count}>{item.count}</Text>
            </View>
        </View>
    )
}

/* <View style={equipment.equipment}>
            <Text>{item.label}</Text>
            <View style={equipment.circle}>
                <Text style={equipment.count}>{item.count}</Text>
            </View>
        </View> */

const styles = StyleSheet.create({
    userContainer: {
        height: 200,
        backgroundColor: 'white',
    },
    info: {
        height: 80,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoTxt: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    scrollRow: {
        flex: 1,
        flexDirection: 'column',
        marginHorizontal: 20,
        minWidth: Dimensions.get('window').width, 
        borderWidthTop: 1,
    },
    scrollText: {
        height: 40,
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 20,
        borderTopColor: 'grey',
        borderTopWidth: 0.5,
    },
    scrollTop: {
        flex: 1,
        flexDirection: 'row',
    },
});

const equipment = StyleSheet.create({
    equipment: {
      backgroundColor: 'skyblue',
      margin: 8,
      width: 140,
      height: 140,
      borderRadius: 70,
      justifyContent: 'center',
      alignItems: 'center',
    },
    circle: {
      backgroundColor: 'white',
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      right: 5,
      bottom: 5,
      borderWidth: 1,
    },
    count: {
      fontSize: 10,
      fontWeight: 'bold',
    }
  });
