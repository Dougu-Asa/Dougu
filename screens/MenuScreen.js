import { StatusBar } from 'expo-status-bar';
import { Text, View, Button } from 'react-native';
import MainStyle from '../styles/MainStyle';
import CurrOrgsDropdown from '../components/CurrOrgsDropown';

function MenuScreen({navigation}) {
    return(
        <View style={MainStyle.container}>
        <Text>Menu</Text>
        <CurrOrgsDropdown />
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
  