import { SafeAreaView, Button, StyleSheet, Text, View, TextInput, FlatList } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native'

import GoBackButton from '../Components/GoBackButton';

const AddingFriendsPage = ({route}) => {
    const navigation = useNavigation();
    let user = route.params.paramKey
    const socket = route.params.socketKey

    let friendUsernameHolder;
    let submittedFriendUsername = null;

    socket.on('friendRequestCleared', () => {
        navigation.navigate('Profile', {
            paramKey: user,
            socketKey: socket
        })
    })

    return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <GoBackButton sentS={socket} sentU={user} />
            <Text>Enter Username Of Friend You Want To Add</Text>
            <TextInput 
                value={friendUsernameHolder}
                onChangeText={(friend) => submittedFriendUsername = friend}
                style={styles.inputStyle}
            />
            <View>
                <Button 
                    title='Submit Friend Request'
                    onPress={() => socket.emit('userSendsFriendRequest', submittedFriendUsername)}
                />
            </View>
        </View>
    )

}

export default AddingFriendsPage

const styles = StyleSheet.create({
    inputStyle: {
        width: '80%',
        height: 40,
        padding: 10,
        marginVertical: 10,
        backgroundColor: '#DBDBD6'
    }
})