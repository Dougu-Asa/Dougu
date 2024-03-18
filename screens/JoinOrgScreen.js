import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import MainStyle from '../styles/MainStyle';

function JoinOrgScreen({navigation}) {
    return(
      <View style={MainStyle.container}>
        <Text>Join an Org</Text>
        <StatusBar style="auto" />
      </View>
    );
}

export default JoinOrgScreen;