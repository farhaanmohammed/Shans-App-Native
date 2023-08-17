import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import React, { useEffect } from 'react'
import axios from 'axios'
import { baseUrl } from '../../api/const'


const CashCollection = () => {

    // useEffect(()=> {
    //     axios.get()

    // }, [])

    const navigation = useNavigation()
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.navigate('NewCollection')} style={styles.fab}>
                <Text style={styles.fabIcon}>+</Text>
            </TouchableOpacity>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    fab: {
        position: 'absolute',
        width: 56,
        height: 56,
        alignItems: 'center',
        justifyContent: 'center',
        right: 20,
        bottom: 20,
        backgroundColor: '#07d7c7',
        borderRadius: 30,
        elevation: 8
    },
    fabIcon: {
        fontSize: 40,
        color: 'white'
    }
})

export default CashCollection