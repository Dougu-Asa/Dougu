import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import MainStyle from '../styles/MainStyle';

function MyOrgsScreen({navigation}) {
    return(
      <View style={MainStyle.container}>
        <Text>My Orgs</Text>
        <StatusBar style="auto" />
      </View>
    );
}

export default MyOrgsScreen;