import { StatusBar } from 'expo-status-bar';
import { Text, View, Button } from 'react-native';
import MainStyle from '../styles/MainStyle';

function JoinOrgScreen({navigation}) {
    return(
      <View style={MainStyle.container}>
        <Text>Join an Org</Text>
        <Button
            title="Join My Org"
            onPress={() => navigation.navigate('MemberTabs', {screen: 'My Equipment'})}
        />
        <StatusBar style="auto" />
      </View>
    );
}

export default JoinOrgScreen;