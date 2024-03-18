import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import MainStyle from '../styles/MainStyle';

function CreateOrgScreen({navigation}) {
    return(
      <View style={MainStyle.container}>
        <Text>Create an Org!</Text>
        <StatusBar style="auto" />
      </View>
    );
}

export default CreateOrgScreen;