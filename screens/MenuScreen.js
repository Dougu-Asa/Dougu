import { StatusBar } from 'expo-status-bar';
import { Text, View, Button, StyleSheet, TouchableOpacity } from 'react-native';
import CurrOrgsDropdown from '../components/CurrOrgsDropown';

function MenuScreen({navigation}) {
    return(
        <View style={MenuStyle.container}>
            <View style={MenuStyle.button}>
                <CurrOrgsDropdown />
            </View>
            <TouchableOpacity style={MenuStyle.button} onPress={() => navigation.navigate('JoinOrg')}>
                <Text style={MenuStyle.textStyle}>Join an Org</Text>
            </TouchableOpacity>
            <TouchableOpacity style={MenuStyle.button} onPress={() => navigation.navigate('CreateOrg')}>
                <Text style={MenuStyle.textStyle}>Create An Org</Text>
            </TouchableOpacity>
            <StatusBar style="auto" />
        </View>
    );
}

const MenuStyle = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'space-evenly', 
    },
    button: {
      width: '80%', 
      height: '25%', 
      justifyContent: 'center', 
      alignItems: 'center', 
      backgroundColor: '#eee'
    },
    textStyle: {
        fontSize: 16,
    }
  });

export default MenuScreen;
  