import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import GoBack from '../NavGoBack/GoBack';

const dropDownState = [
    { label: 'Closed', value: 'Closed' },
    { label: 'Resolved', value: 'Resolved' },
    { label: 'In Progress..', value: 'In Progress' },
    { label: 'Hold', value: 'Hold' },
    { label: 'New', value: 'New' }, // hold resolved closed
];

const dropDownPriority = [
    { label: 'HIGH', value: 'HIGH' },
    { label: 'MEDIUM', value: 'MEDIUM' },
    { label: 'LOW', value: 'LOW' },
];

const TasksUpdate = ({ navigation, route }) => {
    const { task } = route.params;

    const [isFocus, setIsFocus] = useState(false);
    const [openStartDate, setOpenStartDate] = useState(false);
    const [selectedStartDate, setSelectedStartDate] = useState(null);
    const [selectedStartTime, setSelectedStartTime] = useState(null);
    const [openDueDate, setOpenDueDate] = useState(false);
    const [selectedDueDate, setSelectedDueDate] = useState(null);
    const [selectedDueTime, setSelectedDueTime] = useState(null);
    const [openTime, setOpenTime] = useState(false);

    console.log("Task Updating Details ......:", task);


    // Add state variables for other fields
    const [status, setStatus] = useState('');
    const [taskTitle, setTaskTitle] = useState('');
    const [priority, setPriority] = useState('');
    const [remarks, setRemarks] = useState('');
    const [description, setDescription] = useState('')
    // Set initial state values based on the task details
    useEffect(() => {
        //   setStatus(task.status); // Set Status based on task.status
        setTaskTitle(task.title); // Set Task Title based on task.title
        setPriority(task.priority); // Set Priority based on task.priority
        //   setRemarks(task.description); // Set Remarks based on task.description
        setDescription(task.description)

    }, [task]);

    // Memoize the onFocus and onBlur event handlers
    const handleFocus = useCallback(() => {
        setIsFocus(true);
    }, []);

    const handleBlur = useCallback(() => {
        setIsFocus(false);
    }, []);

    return (
        <View style={styles.container}>
            <GoBack title="Task Updates" onPress={() => navigation.goBack()} />
            <View style={styles.taskUpdatesContainer}>
                <View style={styles.statusAndAddContainer}>
                    <View style={styles.statusContainer}>
                        <Text style={styles.label}>Status:</Text>
                        <Dropdown
                            style={[styles.dropdown, isFocus && { borderColor: '#ffa600' }]}
                            data={dropDownState}
                            maxHeight={300}
                            placeholder="Select State"
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            labelField="label"
                            valueField="value"
                        />
                    </View>
                    <View style={styles.addButtonContainer}>
                        <TouchableOpacity
                            style={styles.addButton}
                        >
                            <Text style={styles.addButtonLabel}>Add{'  '}+</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <Text style={styles.label}>Task Title:</Text>
                <TextInput
                    multiline
                    numberOfLines={2}
                    style={[styles.input]}
                    placeholder='Enter Task Title'
                    value={taskTitle}
                    onChange={setTaskTitle}
                />
                <Text style={styles.label}>Start Date:</Text>
                <View style={[styles.input, { flexDirection: 'row', justifyContent: 'space-between' }]}>
                    <Text>
                        {selectedStartDate ? selectedStartDate.toDateString() : 'Select Start date'}
                        {selectedStartTime ? ` - ${selectedStartTime.toLocaleTimeString()}` : ''}{' '}
                    </Text>
                    <View style={{ flexDirection: 'row', alignSelf: "flex-end" }}>
                        <TouchableOpacity onPress={() => setOpenStartDate(true)}>
                            <Image source={require("../../../assets/addTask/calendar.png")} style={{ width: 25, height: 25 }} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setOpenTime(true)} >
                            <Image source={require("../../../assets/addTask/time.png")} style={{ width: 25, height: 25, marginLeft: 15 }} />
                        </TouchableOpacity>
                    </View>
                </View>
                {/* Start Date */}
                {/* Open calendar when icon is pressed */}
                {openStartDate && (
                    <DateTimePicker
                        testID="Start Date"
                        value={new Date()}
                        mode="date"
                        onChange={(event, selectedDate) => {
                            if (selectedDate !== undefined) {
                                setOpenStartDate(false);
                                setSelectedStartDate(selectedDate);
                                console.log("Selected Start Date:", selectedDate);
                            }
                        }}
                        display="default"
                    />
                )}
                {/* Open time when icon is pressed */}
                {openTime && (
                    <DateTimePicker
                        testID="Start Time"
                        value={selectedStartTime || new Date()}
                        mode="time"
                        is24Hour={true}
                        onChange={(event, selectedTime) => {
                            if (selectedTime !== undefined) {
                                setOpenTime(false);
                                setSelectedStartTime(selectedTime);
                                console.log("Selected Start Time:", selectedTime);
                            }
                        }}
                        display="default"
                    />
                )}

                {/* Due Date */}
                <Text style={styles.label}>Due Date:</Text>
                <View style={[styles.input, { flexDirection: 'row', justifyContent: 'space-between' }]}>
                    <Text>
                        {selectedDueDate ? selectedDueDate.toDateString() : 'Select Due date'}
                        {selectedDueTime ? ` - ${selectedDueTime.toLocaleTimeString()}` : ''}{' '}
                    </Text>
                    <View style={{ flexDirection: 'row', alignSelf: "flex-end" }}>
                        <TouchableOpacity onPress={() => setOpenDueDate(true)}>
                            <Image source={require("../../../assets/addTask/calendar.png")} style={{ width: 25, height: 25 }} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setOpenTime(true)} >
                            <Image source={require("../../../assets/addTask/time.png")} style={{ width: 25, height: 25, marginLeft: 15 }} />
                        </TouchableOpacity>
                    </View>
                </View>
                {/* Due Date */}
                {/* Open calendar when icon is pressed */}
                {openDueDate && (
                    <DateTimePicker
                        testID="Due Date"
                        value={new Date()}
                        mode="date"
                        onChange={(event, dueSelectedDate) => {
                            if (dueSelectedDate !== undefined) {
                                setOpenDueDate(false);
                                setSelectedDueDate(dueSelectedDate);
                                console.log("Selected Due Date:", dueSelectedDate);
                            }
                        }}
                        display="default"
                    />
                )}
                {/* Open time when icon is pressed */}
                {openTime && (
                    <DateTimePicker
                        testID="Due Time"
                        value={selectedDueTime || new Date()}
                        mode="time"
                        is24Hour={true}
                        onChange={(event, dueSelectedTime) => {
                            if (dueSelectedTime !== undefined) {
                                setOpenTime(false);
                                setSelectedDueTime(dueSelectedTime);
                                console.log("Due Selected Time:", dueSelectedTime);
                            }
                        }}
                        display="default"
                    />
                )}
                <Text style={styles.label}>Priority:</Text>
                <Dropdown
                    style={[styles.dropdown, isFocus && { borderColor: '#ffa600' }]}
                    data={dropDownPriority}
                    maxHeight={300}
                    placeholder="Select Priority"
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    labelField="label"
                    valueField="value"
                    value={priority}
                    onChange={(value) => setPriority(value)}
                />
                <Text style={styles.label}>Remarks:</Text>
                <TextInput
                    multiline
                    numberOfLines={4}
                    style={[styles.longText]}
                    placeholder='Enter Remarks'
                value={remarks}
                onChangeText={(text) => setRemarks(text)}
                />
                <Text style={styles.label}>Description:</Text>
                <TextInput
                    multiline
                    numberOfLines={4}
                    style={[styles.longText]}
                    placeholder='Enter Task Title'
                    value={description}
                    onChange={(e) => setDescription(e)}
                />

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    taskUpdatesContainer: {
        padding: 15,
    },
    input: {
        borderWidth: 0.9,
        paddingHorizontal: 10,
        paddingVertical: 5,
        fontSize: 18,
        borderRadius: 6,
        fontSize: 13,
        color: "black",
        fontWeight: "600",
        marginBottom: 8,
    },
    label: {
        color: "#343230",
        fontWeight: "bold",
        fontSize: 16,
        marginBottom: 2,
        marginVertical: 3,
    },
    addButton: {
        backgroundColor: '#07d7c7',
        padding: 10,
        borderRadius: 6,
    },
    addButtonLabel: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    statusAndAddContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        // justifyContent: "center",
        marginBottom: 10, // Add space between Status and Task Title
    },
    statusContainer: {
        // flex: 1, // Take 50% of the available space for Status,
        width: "65%",
    },
    addButtonContainer: {
        width: "25%", // Add some space between Status and Add button
        marginTop: 20,
    },
    dropdown: {
        borderRadius: 5,
        borderWidth: 0.9,
        paddingHorizontal: 10,
    },
    longText: {
        borderWidth: 0.9,
        paddingHorizontal: 10,
        paddingTop: 0,
        padding: 30,
        fontSize: 18,
        borderRadius: 6,
        fontSize: 13,
        color: "black",
        fontWeight: "600",
    },
});

export default TasksUpdate;
