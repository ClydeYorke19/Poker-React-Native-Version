import { SafeAreaView, Button, StyleSheet, Text, View, TextInput, Pressable } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native'

const GoHomeButton = () => {
    const navigation = useNavigation();

    return (
        <View style={{backgroundColor:'lightgrey', position: 'absolute', top: 55, borderWidth: 1, borderRadius: 3, borderColor: 'black'}}>
            <Button 
                title='Home'
                onPress={() => navigation.navigate('Home')}
                color='black'
            />
        </View>
    )
}

export default GoHomeButton

// const styles = StyleSheet.create({
//     buttonStyle: {
//         position: 'absolute',
//         top: 10
        
//     }
// })