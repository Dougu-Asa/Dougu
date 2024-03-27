import {Text, View, Button, SafeAreaView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import React, {useEffect} from 'react';
import LoginScreen from '../components/Login';
import CreateAccScreen from '../components/CreateAcc';

function HomeScreen({navigation}) {
  const [login, setLogin] = React.useState(true);

  return(
    <View style={styles.container}>
      <Text style={styles.title}>Dougu</Text>
      <View style={styles.loginCreateContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setLogin(true)}>
            <Text>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setLogin(false)}>
            <Text>Create</Text>
          </TouchableOpacity>
        </View>
        {login ? <LoginScreen navigation={navigation}/> : <CreateAccScreen navigation={navigation}/>}
      </View>
    </View>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#791111'
  },
  loginCreateContainer: {
    width: '80%',
    height: '50%',
    borderWidth: 1,
  },
  header: {
    height: '10%',
    width: '100%',
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  }
});