import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function EquipmentItem({item}) {
    return (
        <View style={equipment.equipment}>
            <Text>{item.label}</Text>
            <View style={equipment.circle}>
                <Text style={equipment.count}>{item.count}</Text>
            </View>
        </View>
    )
}

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
