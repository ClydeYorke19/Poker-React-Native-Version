import { SafeAreaView, Button, StyleSheet, Text, View, LogBox } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native'

import GoHomeButton from '../Components/GoHomeButton';

const ProfilePage = ({route}) => {

    LogBox.ignoreLogs([
        'Non-serializable values were found in the navigation state',
    ]);

    const navigation = useNavigation();
    let user = route.params.paramKey

    user.socket.on('sendingFriendRequestToReciever', (sender) => {
        if (!user.friendRequests.includes(sender)) {
            user.friendRequests.push(sender);
        }
    })

    user.socket.on('requestAcceptedConfirmed', (username, index) => {
        user.friendRequests.splice(index, 1);
    })

    user.socket.on('userAcceptedFriendRequest', (username) => {
        user.addFriendToList(username)
    })

    return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'mistyrose', borderWidth: 8, borderRadius: 10, borderColor: 'lightgrey'}}>
            <GoHomeButton />
            {user.loggedIn ? (
                <View style={{width: '85%', height: '70%', borderWidth: 3, backgroundColor: 'papayawhip', borderRadius: 5}}>
                    <Text style={{fontSize: 25, textAlign: 'center', marginTop: 10, marginBottom: 50}}>Welcome {user.accountInfo.username}</Text>
                    <View style={{borderWidth: 3, borderRadius: 5, backgroundColor: 'lightgrey', width: '40%', alignSelf: 'center', marginBottom: 50}}>
                        <Button 
                            title='Proflie Info'
                            color='black'
                            onPress={() => navigation.navigate('ProfileInfoPage', {
                                paramKey: user
                            })}
                        />
                    </View>
                    <View style={{borderWidth: 3, borderRadius: 5, backgroundColor: 'lightgrey', width: '40%', alignSelf: 'center', marginBottom: 50}}>
                        <Button 
                            title='Friends'
                            color='black'
                            onPress={() => navigation.navigate('FriendsPage', {
                                paramKey: user
                            })}
                        />
                    </View>
                    <View style={{borderWidth: 3, borderRadius: 5, backgroundColor: 'lightgrey', width: '40%', alignSelf: 'center', marginBottom: 50}}>
                        <Button 
                            title='Groups'
                            color='black'
                            onPress={() => navigation.navigate('GroupsPage', {
                                paramKey: user
                            })}
                        />
                    </View>
                    <View style={{borderWidth: 3, borderRadius: 5, backgroundColor: 'lightgrey', width: '40%', alignSelf: 'center', marginBottom: 50}}>
                        <Button 
                            title='Alerts'
                            color='black'
                            onPress={() => navigation.navigate('AlertsPage', {
                                paramKey: user
                            })}
                        />
                    </View>
                    <View style={{borderWidth: 3, borderRadius: 5, backgroundColor: 'lightgrey', width: '40%', alignSelf: 'center', marginBottom: 50}}>
                        <Button 
                            title='Sign Out'
                            color='black'
                        />
                    </View>
                </View>
            ) : (
                <View style={{position: 'absolute', top: 200, width: '100%'}}>
                    <View style={{borderWidth: 2, backgroundColor: 'papayawhip', borderRadius: 5, width: '100%'}}>
                        <Text style={{fontSize: 30, textAlign: 'center', marginBottom: 50, marginTop: 40}}>You Are Not Logged In!</Text>
                        <View style={{borderWidth: 2, borderRadius: 5, backgroundColor: 'lightgrey', width: '40%', alignSelf: 'center', marginBottom: 30}}>
                            <Button 
                                title = 'Create Account'
                                color='black'
                                onPress={() => navigation.navigate('CreateAccount', {
                                    paramKey: user,
                                })}
                            />
                        </View>
                        <View style={{borderWidth: 2, borderRadius: 5, backgroundColor: 'lightgrey', width: '30%', alignSelf: 'center', marginBottom: 50}}>
                            <Button 
                                title = 'Log In'
                                color='black'
                                onPress={() => navigation.navigate('LogIn', {
                                    paramKey: user,
                                })}
                            />
                        </View>

                    </View>
                </View>
            )}


        </View>
    )
}

export default ProfilePage