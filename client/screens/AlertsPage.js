import { SafeAreaView, Button, StyleSheet, Text, View, TextInput, FlatList } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native'

import GoBackButton from '../Components/GoBackButton';

const AlertsPage = ({route}) => {

    const navigation = useNavigation();
    let user = route.params.paramKey
    const socket = route.params.socketKey

    const DisplayingAlerts = () => {
        for (let i = 0; i < user.friendRequests.length; i++) {
            return (
                <View style={{borderWidth: 1, borderColor: 'black', width: '100%', backgroundColor: 'lightgrey', alignItems: 'center', justifyContent: 'center', paddingTop: 20}}>
                    <li>{user.friendRequests[i]}</li>
                    {/* <View style={{borderWidth: 1, borderColor: 'black'}}>
                        <Button 
                            title='Accept'
                            color='black'
                            onPress={() => socket.emit('userAcceptsFriendRequest', el)}
                        />
                    </View>
                    <View style={{borderWidth: 1, borderColor: 'black'}}>
                        <Button 
                            title='Decline'
                            color='black'
                        />
                    </View> */}
                </View>
            )
        }

        // return user.friendRequests.map((el) => {
        //     return (
        //         <View style={{borderWidth: 1, borderColor: 'black', width: '100%', backgroundColor: 'lightgrey', alignItems: 'center', justifyContent: 'center', paddingTop: 20}}>
        //             <Text>{el} has sent a friend request</Text>
        //             <View style={{borderWidth: 1, borderColor: 'black'}}>
        //                 <Button 
        //                     title='Accept'
        //                     color='black'
        //                     onPress={() => socket.emit('userAcceptsFriendRequest', el)}
        //                 />
        //             </View>
        //             <View style={{borderWidth: 1, borderColor: 'black'}}>
        //                 <Button 
        //                     title='Decline'
        //                     color='black'
        //                 />
        //             </View>
        //         </View>
        //     )
        // })
    }

    // console.log(pendingAlertsHolder)

    return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <GoBackButton sentU={user} sentS={socket} />
            <Text>Alerts</Text>
            <View style={{borderWidth: 1, borderColor: 'black', width: '95%', height: 450}}>
                {user.friendRequests[0] ? (
                    <DisplayingAlerts />
                ) : (
                    <Text>No Alerts</Text>
                )}
            </View>

        </View>
    )

}

export default AlertsPage