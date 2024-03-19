import { StatusBar } from 'expo-status-bar';
import { Text, View, Button } from 'react-native';
import MainStyle from '../styles/MainStyle';

function AccessCodeScreen({navigation}) {
    return(
      <View style={MainStyle.container}>
        <Text>Access Code!</Text>
        <Button
            title="Start Managing!"
            onPress={() => navigation.navigate('MemberTabs', {screen: 'My Equipment'})}
        />
        <StatusBar style="auto" />
      </View>
    );
}

export default AccessCodeScreen;