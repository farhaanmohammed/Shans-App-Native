import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Modal, Button, ScrollView } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import GoBack from '../NavGoBack/GoBack';
import { format } from 'date-fns';
import { baseUrl } from '../../api/const';
import axios from 'axios';
import { BottomSubmitButton } from '../CustomButton/BottomSubmitButton';
import * as DocumentPicker from 'expo-document-picker';
import { ActivityIndicator } from "react-native-paper";
import { Audio } from 'expo-av';
import { AntDesign } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

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
const imageUploadUrl = `${baseUrl}/fileUpload?folder_name=addTaskUpdates`;
const addTaskUpdatesUrl = `${baseUrl}/updateTaskManagment`;



const TasksUpdate = ({ navigation, route }) => {

    const { task } = route.params;
    const id = task?._id
    const detailTaskurl = `${baseUrl}/viewTaskManagment/${id}`

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


    //update container data
    const [taskAddUpdates, setTaskAddUpdates] = useState([]);



    // const toggleModal = () => {
    //   setModalVisible(!isModalVisible);
    // };


    // Define a state variable to hold the audio object
    const [audio, setAudio] = useState(null);

    console.log("Status", status)
    console.log("TaskTitle", taskTitle)
    // console.log("Assignee", formData.assignee._id)
    console.log("FormData: ", formData)
console.log("Remarks", remarks)
    // Function to play the audio from the provided URI
    const playAudio = async () => {
        if (audio) {
            // If audio is already playing, stop it
            await audio.stopAsync();
        }

        const { sound } = await Audio.Sound.createAsync(
            { uri: task.audio_url } // Use the audio URL from your task
        );

        setAudio(sound);
        await sound.playAsync(); // Play the audio
    };


    const fetchAddUpdatesData = async () => {
        try {
            const response = await axios.get(detailTaskurl);
            const taskAddUpdates = response.data.data[0].task_add_update;
            setTaskAddUpdates(taskAddUpdates);
        } catch (error) {
            console.error('Task Details API Error:', error);
        }
    };

    //fetching data to use update container 
    // Call the fetchDetailTaskData function when the component mounts
    useEffect(() => {
        fetchAddUpdatesData();
    }, []);
    const handleSave = async () => {
        // Save your data here (updates, selectedImage)
        // You can use this information to update your state or send it to a server.
        // Remember to implement validation and handling for selectedImage.
        console.log('Updates:', updates);
        console.log('Selected Image:', selectedImage);
        try {
            const addTaskUpdatesData = {
                "task_managment_id": id,
                "create_task_add_update": [
                    {
                        "requested_by": task?.Assignee?.employees_id,
                        "updates": updates || null,
                        "image_url": selectedImage || null,
                    }
                ]
            }
            try {
                const response = await axios.put(addTaskUpdatesUrl, addTaskUpdatesData);
                console.log("API Response:", response.data);
                if (response.data.status === 'true') {
                    Toast.show({
                        type: 'success', // Set the type to 'successToast' for success
                        text1: 'Success',
                        text2: 'Add Updates Created',
                        position: 'top',
                    });
                } else {
                    Toast.show({
                        type: 'error', // Set the type to 'errorToast' for failure
                        text1: 'Error',
                        text2: 'Failed to create task',
                        position: 'bottom',
                    });
                    console.log(response);
                }


            } catch (error) {
                console.log("Axios Error:", error);
                // Handle the error, e.g., display an error message to the user
            } finally {
                fetchAddUpdatesData();
            }
            // Clear the input fields
            setUpdates('');
            setSelectedImage(null);


        } catch (error) {
            console.log(error)

        }


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
        setPriority(task.priority); // Set Priority based on task.priority you can also use this line on placeholder other wise you can set priority in this useEffect 
        //   setRemarks(task.description); // Set Remarks based on task.description
        setDescription(task.description) //
        setStatus(task?.status || "Select Status")
        setRemarks(task?.remarks || "Enter Remarks")
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
    const handleTaskUpdateSubmit = async () => {
        try {
            console.log('Loading.....')
            const updateData = {
                "task_managment_id": id,
                "title": taskTitle,
                "description": description,
                "start_date": selectedStartDate,
                "due_date": selectedDueDate,
                "estimated_time": selectedDueTime,
                "status": status,
                "priority": priority,
                "assignee_id": formData?.assignee?.id || null,
                "assignee": formData?.assignee?.id || null,
                "remarks":remarks,
                "is_scheduled": true,
                "daily_scheduler": true,
                "weakly_scheduler": [],
                "monthly_scheduler": [],
            }
            console.log("Update Task Data:", updateData)
            const response = await axios.put(addTaskUpdatesUrl, updateData)
            if (response.data.status === 'true') {
                Toast.show({
                    type: 'success', // Set the type to 'successToast' for success
                    text1: 'Success',
                    text2: 'Task Updated Successfully',
                    position: 'bottom',
                });
            } else {
                Toast.show({
                    type: 'error', // Set the type to 'errorToast' for failure
                    text1: 'Error',
                    text2: 'Failed to create task',
                    position: 'bottom',
                });
                console.log(response);
            }
            console.log(response.data)
            console.log("API Response: ", response.data)
        } catch (error) {
            console.log(error)

        }
    }

    return (
        <View style={styles.container}>
            <GoBack title="Task Updates" onPress={() => navigation.goBack()} />
            <ScrollView contentContainerStyle={styles.scrollViewContent}>


                <View style={styles.taskUpdatesContainer}>
                    <View style={styles.statusAndAddContainer}>
                        <View style={styles.statusContainer}>
                            <Text style={styles.label}>Status:</Text>
                            <Dropdown
                                style={[styles.dropdown, isFocus && { borderColor: '#ffa600' }]}
                                data={dropDownState}
                                maxHeight={300}
                                placeholder={status}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                                labelField="label"
                                valueField="value"
                                value={status}
                                onChange={(item) => {
                                    setStatus(item.value);
                                    // validateStatus(item.value); // Validate the selected status
                                }}
                            />

                        </View>
                        <View style={styles.addButtonContainer}>
                            <TouchableOpacity
                                style={styles.addButton}
                                onPress={toggleModal}
                            >
                                <Text style={styles.addButtonLabel}>Add{'  '}Updates</Text>
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
                                        <View style={{ position: 'relative', width: 100, height: 100 }}>
                                            {isLoading && (
                                                <ActivityIndicator
                                                    size="medium"
                                                    color="#0000ff"
                                                    style={{
                                                        position: 'absolute',
                                                        top: '50%',
                                                        left: '50%',
                                                        transform: [{ translateX: -25 }, { translateY: -25 }],
                                                        zIndex: 1,
                                                    }}
                                                />
                                            )}
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
                                                    marginBottom: 10,
                                                    borderWidth: 1,
                                                    borderColor: "black"
                                                }}
                                            />
                                        </View>
                                    </TouchableOpacity>



                                    {/* Add image selection here */}
                                    {/* Example: <ImagePicker setSelectedImage={setSelectedImage} /> */}
                                    {/* ... (image selection code) */}

                                    <View style={styles.buttonContainer}>
                                        <View style={[styles.roundedButton, { marginRight: 10 }]}>
                                            <Button
                                                title="Cancel"
                                                onPress={toggleModal}
                                                color="#FF5733" // Change button color
                                                // style={{ width: 100, height: 40 }} // Change button width and height
                                                titleStyle={{ fontSize: 16 }} // Change button title style
                                            />
                                        </View>
                                        <View style={[styles.roundedButton]}>
                                            <Button
                                                title="Save"
                                                onPress={handleSave}
                                                color="#4CAF50" // Change button color
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

                        onChangeText={setTaskTitle}

                    />

                    <Text style={styles.label}>Assignee:</Text>
                    <Dropdown
                        style={[styles.dropdown, isFocus && { borderColor: '#ffa600' }]}
                        data={employee}
                        search
                        maxHeight={300}
                        labelField="name"
                        valueField="id"
                        // value={task.assignee.employees_name}
                        placeholder={task?.Assignee?.employees_name}
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

                        onChangeText={(text) => setDescription(text)}

                    />
                    <Text style={styles.label}>Audio Play Back</Text>
                    <TouchableOpacity onPress={playAudio}>
                        <AntDesign name="play" size={24} color="green" />
                    </TouchableOpacity>
                    <View style={styles.updateContainer}>
                        <Text style={styles.updateLabel}>Updates:</Text>
                        {taskAddUpdates.map((update, index) => (
                            <View key={index} style={[styles.updateCard, { flexDirection: 'row' }]}>
                                {update.image_url ? (
                                    <Image source={{ uri: update.image_url }} style={{ width: 100, height: 100, marginLeft: 3 }} />
                                ) : (
                                    <Image source={require("../../../assets/updateTask/image.png")} style={{ width: 100, height: 100, marginLeft: 3 }} />
                                )}
                                <View style={styles.cardContent}>
                                    <Text style={{ color: "black", fontSize: 18, maxWidth: "80%" }}>
                                        {update.updates || "No updates available"}
                                    </Text>
                                    <Text style={{ color: "gray", fontWeight: 600, marginTop: 10 }}>{task?.Assignee?.employees_name}</Text>
                                    <Text style={{ color: "gray", fontWeight: 600, marginTop: 5 }}> {format(new Date(update.create_date), 'dd MMM yyyy h:mm a')}</Text>
                                </View>
                            </View>
                        ))}
                    </View>

                </View>
            </ScrollView>
            <BottomSubmitButton
                title="Update"
                onPress={handleTaskUpdateSubmit}

            />

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
    scrollViewContent: {
        flexGrow: 1,
    },
    input: {
        borderWidth: 0.9,
        paddingHorizontal: 10,
        paddingVertical: 5,
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
        width: "30%", // Add some space between Status and Add button
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
        marginTop: 15
    },
    roundedButton: {
        flex: 1,
        borderRadius: 10, // Adjust this value to control border radius
        overflow: 'hidden', // This is important to clip the button's content
        // marginHorizontal: 5, // Adjust this for spacing between buttons
    },
    updateContainer: {
        borderWidth: 0.9,
        marginVertical: 10,
        paddingHorizontal: 10,
        // paddingVertical: 65,
        paddingBottom: 15,
        borderRadius: 6,
        fontSize: 13,
        color: "black",
        // alignItems:"flex-start"           
    },
    updateLabel: {
        marginTop: 10,
        color: "#343230",
        fontWeight: "bold",
        fontSize: 16,
        paddingBottom: 15
    },
    updateCard: {
        paddingHorizontal: 10,
        padding: 20, // Adjust padding as needed
        backgroundColor: 'white',
        borderWidth: 0.5,
        borderColor: 'lightgray',
        borderRadius: 8,
        marginBottom: 10,
        ...Platform.select({
            android: {
                elevation: 1,
            },
            ios: {
                shadowColor: 'black',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
            },
        }),
    }, cardContent: {
        marginHorizontal: 20
    }
});

export default TasksUpdate;
