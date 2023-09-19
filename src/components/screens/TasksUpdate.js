import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Modal, Button } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import GoBack from '../NavGoBack/GoBack';
import { format } from 'date-fns';
import { baseUrl } from '../../api/const';
import axios from 'axios';
import { BottomSubmitButton } from '../CustomButton/BottomSubmitButton';
import * as DocumentPicker from 'expo-document-picker';
import { ActivityIndicator } from "react-native-paper";

const dropDownState = [
    { label: 'Closed', value: 'Closed' },
    { label: 'Resolved', value: 'Resolved' },
    { label: 'In Progress', value: 'In Progress' },
    { label: 'Hold', value: 'Hold' },
    { label: 'New', value: 'New' }, // hold resolved closed
];

const dropDownPriority = [
    { label: 'HIGH', value: 'HIGH' },
    { label: 'MEDIUM', value: 'MEDIUM' },
    { label: 'LOW', value: 'LOW' },
];


const employeeUrl = `${baseUrl}/viewEmployees/employee_list/employee_dropdown`;
const imageUploadUrl = `${baseUrl}/fileUpload?folder_name=products`;

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
    const [employee, setEmployee] = useState([]);
    const [formData, setFormData] = useState({ assignee: null, })

    console.log("Task Updating Details ......:", task);


    // Add state variables for other fields
    const [status, setStatus] = useState('');
    const [taskTitle, setTaskTitle] = useState('');
    const [priority, setPriority] = useState('');
    const [remarks, setRemarks] = useState('');
    const [description, setDescription] = useState('')
    const [taskStartDateAndTime, setTaskDateAndTime] = useState();
    const [taskDueDateAndTime, setTaskDueDateAndTime] = useState();

    //modal
    const [isModalVisible, setIsModalVisible] = useState(false);

    // loadingIndicator
    const [isLoading, setIsLoading] = useState(false)


    // const [isModalVisible, setModalVisible] = useState(false);
    const [updates, setUpdates] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);

    // const toggleModal = () => {
    //   setModalVisible(!isModalVisible);
    // };

    const handleSave = () => {
        // Save your data here (updates, selectedImage)
        // You can use this information to update your state or send it to a server.
        // Remember to implement validation and handling for selectedImage.
        console.log('Updates:', updates);
        console.log('Selected Image:', selectedImage);

        // Close the modal
        toggleModal();
    };

    // Step 3: Function to open and close the modal
    const toggleModal = () => {
        setIsModalVisible(!isModalVisible);
    };


    const selectDoc = async () => {
        try {
            setIsLoading(true); // Set loading to true when fetching starts

            const doc = await DocumentPicker.getDocumentAsync({ multiple: false, type: 'image/*' });

            if (!doc.canceled) {
                const fileUri = doc.assets[0].uri;
                const fileName = fileUri.split('/').pop();
                const contentType = `image/${fileName.split('.').pop()}`;

                const fileData = {
                    uri: fileUri,
                    type: contentType,
                    name: fileName,
                };

                const formData = new FormData();
                formData.append('file', fileData);

                const config = {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                };

                const response = await axios.post(imageUploadUrl, formData, config);

                if (response.data && response.data.data) {
                    const uploadUrl = response.data.data;
                    setSelectedImage(uploadUrl);
                    console.log('Upload successful. API response:', uploadUrl);
                } else {
                    console.log('Upload failed. Unexpected API response:', response.data);
                }
            }
        } catch (error) {
            console.log("Error:", error);
        } finally {
            setIsLoading(false); // Set loading to false when fetching is done
        }
    };





    // Set initial state values based on the task details
    useEffect(() => {
        // Parse create_date string into a Date object
        const createDate = new Date(task.create_date);
        const dueDate = new Date(task.due_date)

        // Format the date as yyyy-MM-dd HH:mm
        const formattedCreateDate = format(createDate, 'yyyy-MM-dd HH:mm');

        //format the due date as yyyy-MM-dd HH:mm
        const formattedDueDate = format(dueDate, 'yyyy-MM-dd HH:mm');

        // Set the formatted date as the initial value of Start Date
        setTaskDateAndTime(formattedCreateDate);
        setTaskDueDateAndTime(formattedDueDate)

        //setStatus(task.status); // Set Status based on task.status
        setTaskTitle(task.title); // Set Task Title based on task.title
        setPriority(task.priority); // Set Priority based on task.priority
        //   setRemarks(task.description); // Set Remarks based on task.description
        setDescription(task.description)

    }, [task]);
    //fetching employee details
    useEffect(() => {
        axios.get(employeeUrl).then((res) => {

            const employeeArray = res.data.data.map((item) => ({
                id: item._id,
                name: item.name
            }))
            setEmployee(employeeArray)
        })
    }, [])

    // Memoize the onFocus and onBlur event handlers
    const handleFocus = useCallback(() => {
        setIsFocus(true);
    }, []);

    const handleBlur = useCallback(() => {
        setIsFocus(false);
    }, []);


    //handling submit 
    const handleSubmit = () => {
        try {
            console.log('Loading.....')
            const updateData = {

            }
        } catch (error) {

        }
    }

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
                            onChange={(item) => setStatus(item.value)}
                        />
                    </View>
                    <View style={styles.addButtonContainer}>
                        <TouchableOpacity
                            style={styles.addButton}
                            onPress={toggleModal}
                        >
                            <Text style={styles.addButtonLabel}>Add{'  '}+</Text>
                        </TouchableOpacity>
                    </View>
                    <Modal visible={isModalVisible} transparent animationType="slide">
                        <View style={styles.modalContainer}>

                            <View style={styles.modalContent}>
                                <Text style={styles.modalLabel}>Add Updates</Text>

                                <TextInput
                                    placeholder="Enter your updates"
                                    value={updates}
                                    onChangeText={(text) => setUpdates(text)}
                                    multiline
                                    style={[styles.input, styles.textArea]}
                                />
                                <TouchableOpacity onPress={selectDoc}>
                                    {isLoading ? ( // Check if isLoading is true
                                        <ActivityIndicator size="medium" color="#ffa600" />
                                    ) : (
                                        <Image
                                            source={
                                                selectedImage
                                                    ? { uri: selectedImage }
                                                    : require('../../../assets/updateTask/image.png')
                                            }
                                            style={{
                                                width: 100,
                                                height: 100,
                                                marginTop: 5,
                                                marginBottom: 10
                                            }}
                                        />
                                    )}
                                </TouchableOpacity>


                                {/* Add image selection here */}
                                {/* Example: <ImagePicker setSelectedImage={setSelectedImage} /> */}
                                {/* ... (image selection code) */}

                                <View style={styles.buttonContainer}>
                                    <View style={styles.roundedButton}>
                                        <Button
                                            title="Cancel"
                                            onPress={toggleModal}
                                            color="#FF5733" // Change button color
                                            // style={{ width: 100, height: 40 }} // Change button width and height
                                            titleStyle={{ fontSize: 16 }} // Change button title style
                                        />
                                    </View>
                                    <View style={styles.roundedButton}>
                                        <Button
                                            title="Save"
                                            onPress={handleSave}
                                            color="#4CAF50" // Change button color
                                            // style={{ width: 100, height: 40 }} // Change button width and height
                                            titleStyle={{ fontSize: 16 }} // Change button title style
                                        />
                                    </View>
                                </View>
                            </View>
                        </View>
                    </Modal>
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

                <Text style={styles.label}>Assignee:</Text>
                <Dropdown
                    style={[styles.dropdown, isFocus && { borderColor: '#ffa600' }]}
                    data={employee}
                    search
                    maxHeight={300}
                    labelField="name"
                    valueField="id"
                    placeholder="Select Assignee"
                    searchPlaceholder="Search Customers"
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    onChange={(item) => {
                        const { name, id } = item; // Destructure the selected item
                        setFormData({ ...formData, assignee: { name, id } }); // Store the name and id in the assignee property
                    }}
                />
                <Text style={styles.label}>Start Date:</Text>
                <View style={[styles.input, { flexDirection: 'row', justifyContent: 'space-between' }]}>
                    <Text>
                        {selectedStartDate ? selectedStartDate.toDateString() : taskStartDateAndTime}
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
                        {selectedDueDate ? selectedDueDate.toDateString() : taskDueDateAndTime}
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
            <BottomSubmitButton title="Update" onPress={() => console.log("pressed")} />
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
        width: "20%", // Add some space between Status and Add button
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
    modalContainer: {
        // padding: 50,
        marginVertical: 100,
        marginHorizontal: 25,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "white"
    },
    modalHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    textArea: {
        height: 100,
    },

    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Add a semi-transparent background
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '90%',
        // height: "40%"
    },
    // modalContent: {
    //     backgroundColor: 'white',
    //     padding: 20,
    //     borderRadius: 10,
    //     alignSelf: 'center', // Center horizontally
    //     justifyContent: 'center', // Center vertically
    //     width: '90%', // Adjust the width as needed
    //   },
    modalLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        borderRadius: 30,
        justifyContent: 'space-between',
        marginTop: 10
    },
    roundedButton: {
        flex: 1,
        borderRadius: 10, // Adjust this value to control border radius
        overflow: 'hidden', // This is important to clip the button's content
        marginHorizontal: 5, // Adjust this for spacing between buttons
    },
});

export default TasksUpdate;
