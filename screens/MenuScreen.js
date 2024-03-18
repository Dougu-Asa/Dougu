import { StatusBar } from 'expo-status-bar';
import { Text, View, Button } from 'react-native';
import MainStyle from '../styles/MainStyle';

function MenuScreen({navigation}) {
    return(
        <View style={MainStyle.container}>
        <Text>Menu</Text>
        <Button
            title="Current Orgs"
            onPress={() => navigation.navigate('MyOrgs')}
        />
        <Button
            title="Join an Org"
            onPress={() => navigation.navigate('JoinOrg')}
        />
        <Button
            title="Create An Org"
            onPress={() => navigation.navigate('CreateOrg')}
        />
        <StatusBar style="auto" />
        </View>
    );
}

export default MenuScreen;
  