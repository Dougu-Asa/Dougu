import React, { useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Dimensions } from 'react-native';
import EquipmentItem from './EquipmentItem';

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
                        <EquipmentItem key={item.label} item={item} />
                    ))}
                </View>
                </View>
            </ScrollView>
        </View>
    );
}

export default UserEquipment;

const styles = StyleSheet.create({
    userContainer: {
        minHeight: 200,
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