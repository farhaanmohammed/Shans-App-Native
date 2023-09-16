import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import GoBack from '../NavGoBack/GoBack'

const TasksUpdate = () => {
    return (
        <View style={styles.container}>
            <GoBack title="Task Manager" onPress={() => navigation.goBack()} />
            <View>
                
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1
    }

    
})

export default TasksUpdate