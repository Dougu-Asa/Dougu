import { StatusBar } from 'expo-status-bar';
import { Text, View, Button } from 'react-native';
import MainStyle from '../styles/MainStyle';

function CreateAccountScreen({navigation}) {
    return(
      <View style={MainStyle.container}>
        <Text>Create Account</Text>
        <Button title="Create Account!" onPress={() => navigation.goBack()} />
        <StatusBar style="auto" />
      </View>
    );
}

export default CreateAccountScreen;