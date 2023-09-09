import { SafeAreaView, Button, StyleSheet, Text, View, TextInput, FlatList } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native'

import GoBackButton from '../Components/GoBackButton';

const FriendsPage = ({route}) => {
    const navigation = useNavigation();
    let user = route.params.paramKey
    const socket = route.params.socketKey

    return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <GoBackButton sentU={user} sentS={socket} />
            <Text style={{position: 'absolute', top: 75, fontSize: 20}}>Friends</Text>
            <View style={{backgroundColor:'lightgrey', position: 'absolute', top: 130, borderWidth: 1, borderRadius: 3, borderColor: 'black'}}>
                <Button 
                    title='Add Friends'
                    color='black'
                    onPress={() => navigation.navigate('AddingFriendsPage', {
                        paramKey: user,
                        socketKey: socket
                    })}
                />
            </View>
            <View style={{borderWidth: 1, borderColor: 'black', position: 'absolute', top: 180, width: '95%', height: 450}}>
                <FlatList />
            </View>
        </View>
    )

}

export default FriendsPage