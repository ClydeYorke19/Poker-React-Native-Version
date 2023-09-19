import { SafeAreaView, Button, StyleSheet, Text, View, LogBox, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native'

import InvitingFriendsToGroup from './InvitingFriendsToGroup';

const SpecificGroupView = ({user, currentView, setDisplayOpen, groupName, groupInfo}) => {

    let membersArr = [];

    let [invitingMember, setInvitingMember] = useState(false)

    if (currentView) {
        for (var key in user.groups) {
            if (key === groupName) {
                for (let i = 0; i < user.groups[key].members.length; i++) {
                    membersArr.push(
                        <View key={i} style={{ borderWidth: 2, borderRadius: 5, backgroundColor: 'lightgrey', minWidth: '25%', maxHeight: '15%', justifyContent: 'center', marginTop: 10}}>
                            <Text style={{textAlign: 'center', fontSize: 14}}>{user.groups[key].members[i]}</Text>
                        </View>
                    )
                }
            }
        }
    }

    const initGroupInvite = () => {
        setInvitingMember(true)
    }

    return (
        <View style={{borderWidth: 3, borderRadius: 5, backgroundColor: 'papayawhip', height: '85%'}}>
            <View style={{display: invitingMember === false ? 'flex' : 'none'}}>
                <View style={{borderBottomWidth: 2, backgroundColor: 'lightgrey'}}>
                        <Button 
                            title='x'
                            color='black'
                            onPress={() => setDisplayOpen(false)}
                        />
                    </View>
                <Text style={{fontSize: 35, textAlign: 'center', marginBottom: 20, marginTop: 10, borderBottomWidth: 2}}>{groupName}</Text>
                <Text style={{textAlign: 'center', marginBottom: 15, fontSize: 20}}>Members</Text>
                <View style={{borderWidth: 3, borderRadius: 5, backgroundColor: 'lightgrey', alignSelf: 'center', justifyContent: 'center', marginBottom: 20}}>
                    <Button 
                        title='Invite Members'
                        color='black'
                        onPress={() => initGroupInvite()}
                    />
                </View> 
                <View style={{borderWidth: 3, borderRadius: 5, width: '90%', height: '50%', alignSelf: 'center', flexDirection: 'row', justifyContent: 'center'}}>
                    {membersArr}
                </View>
            </View>
            <View style={{display: invitingMember === true ? 'flex' : 'none', height: '70%', width: '80%', alignSelf: 'center', marginTop: 80}}>
                <InvitingFriendsToGroup user={user} setCurrentView={setInvitingMember} groupName={groupName}   />
            </View>
        </View>
    )
}

export default SpecificGroupView