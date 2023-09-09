import { View, Text, StyleSheet, TouchableWithoutFeedback, TouchableOpacity, TextInput, Image } from 'react-native'
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from "@expo/vector-icons"
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import Voice from '@react-native-voice/voice';
import { Dropdown } from 'react-native-element-dropdown';
import { baseUrl } from '../../api/const';
import axios from 'axios';
import Toast from 'react-native-toast-message';

const dropDownData = [
  { label: 'HIGH', value: 'HIGH' },
  { label: 'MEDIUM', value: 'MEDIUM' },
  { label: 'LOW', value: 'LOW' },
];

const employeeUrl = `${baseUrl}/viewEmployees/employee_list/employee_dropdown`;
const addTaskUrl = `${baseUrl}/createTaskManagment`



const CustomButton = ({ title, onPress }) => {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.buttonContainer}>
        <View style={styles.buttonContent}>
          <AntDesign name="left" size={20} color="black" />
          <Text style={styles.buttonText}>{title}</Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};


const CustomSubmitButton = ({ title, onPress }) => {
  return (
    <View style={styles.submitButtonContainer}>
      <TouchableOpacity onPress={onPress}>
        <View style={styles.submitButtonContent}>
          <Text style={styles.submitButtonTitle}>{title}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};


const AddTask = () => {
  let [started, setStarted] = useState(false);
  let [results, setResults] = useState([]);
  const [taskDetails, setTaskDetails] = useState('');
  const [value, setValue] = useState(null);
  const [openDate, setOpenDate] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [openTime, setOpenTime] = useState(false);
  const [employee, setEmployee] = useState([]);
  const [isFocus, setIsFocus] = useState(false);
  const [formData, setFormData] = useState({
    assignee: null, // Initialize with null or a default value
    priority: null, // Initialize with null or a default value
  });

  const navigation = useNavigation()

  useEffect(() => {
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners)
    }
  }, [])

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
  console.log("Employeee details ", employee)


  const startSpeechToText = async () => {
    try {
      await Voice.start("ml-IN");
      setStarted(true);
    } catch (error) {
      console.log(error);
    }
  };
  const stopSpeechToText = async () => {
    await Voice.stop()
    setStarted(false)
  }

  const onSpeechResults = (result) => {
    const recognizedText = result.value.join(' ');

    // Split the recognized text into words
    const words = recognizedText.split(' ');

    // Create a Set to store unique words
    const uniqueWordsSet = new Set(words);

    // Convert the Set back to an array of unique words
    const uniqueWordsArray = Array.from(uniqueWordsSet);

    // Set taskDetails to the unique words
    setResults(uniqueWordsArray);
    // Update the task details with the speech results
    setTaskDetails((prevTaskDetails) => prevTaskDetails + ' ' + uniqueWordsArray.join(' '));
  };

  const onSpeechError = (error) => {
    console.log(error)
  }


  console.log("FormData: ", formData)
  console.log("taskDetails: ", taskDetails)


  //handle submiting
  const handleSubmit = async () => {
    try {
      console.log("Loading......")
      let addTaskData = {

        "title": "task",
        "description": "test",
        "project": "test",
        "start_date": "20-10-2023",
        "due_date": "21-10-2023",
        "estimated_time": "2:00",
        "task_duration": "2:30",
        "status": "test",
        "priority": "high",
        "parent_task_id": "63c914f880b82443459d6581",
        "assignee_id": "63c914f880b82443459d6581",
        "created_by_id": "63c914f880b82443459d6581",
        "warehouse_id": "63c914f880b82443459d6581",
        "task_type_id": "649146140916c0050a5b4bb2",
        "is_scheduled": true,
        "daily_scheduler": true,
        "document": [],
        "audio_url": "wert.jpg",
        "machinery_availability_list_ids": [
          "640712d697229ce1ddd349a6",
          "6454e6aa2c6ad4b0958051f1"
        ],
        "weakly_scheduler": [
          1,
          2,
          3,
          4,
          5,
          6,
          7
        ],
        "monthly_scheduler": [
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12,
          13,
          14,
          15,
          16,
          17,
          18,
          19,
          20,
          21,
          22,
          23,
          24,
          25,
          26,
          27,
          28,
          29,
          30,
          31
        ],
        "participants": [
          {
            "employee_id": "648409287565a7b87d766bc1",
            "employee_name": "tyler"
          },
          {
            "employee_id": "648418d9ad5a111df8499aca",
            "employee_name": "nop"
          }
        ],
        "watchers": [
          {
            "employee_id": "648418d9ad5a111df8499aca",
            "employee_name": "nop"
          },
          {
            "employee_id": "648409287565a7b87d766bc1",
            "employee_name": "tyler"
          }
        ],
        "check_list": [
          {
            "field_name": "test",
            "boolean": true,
            "is_image_mandatory": true,
            "image_url": "image.png"
          }
        ],
        "assignee": [
          "648409287565a7b87d766bc1",
          "648418d9ad5a111df8499aca"
        ]

      }
      const response = await axios.post(addTaskUrl, addTaskData)
      if (response.data.success === 'true') {
        Toast.show({
          type: 'invoiceSuccessToast',
          text1: 'Success',
          text2: 'Task Created Successfully',
          position: 'bottom',
        })
      } else {
        console.log(response)
      }
    } catch (error) {
      console.log(error)
    }
  }


  return (
    <View style={styles.container}>
      <View>
        <CustomButton title="Add Task" onPress={() => navigation.goBack()} />
      </View>
      <View style={styles.taskContainer}>
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
        <Text style={styles.label}>Enter Task:</Text>
        <TextInput
          multiline
          numberOfLines={4}
          style={styles.taskInput}
          placeholder='Enter Task Details'
          value={taskDetails}
          onChangeText={(text) => setTaskDetails(text)}
        />
        <View style={styles.alignRight}>
          {!started ? <TouchableOpacity onPress={startSpeechToText} >
            <MaterialIcons name="keyboard-voice" size={30} color="black" />
          </TouchableOpacity> : undefined}
          {started ? <TouchableOpacity onPress={stopSpeechToText}>
            <FontAwesome name="stop-circle" size={30} color="black" />
          </TouchableOpacity> : undefined}
        </View>


        <Text style={styles.label}>Due Date & Time:</Text>
        <View style={[styles.input, { flexDirection: 'row', justifyContent: 'space-between' }]}>
          <Text>
            {selectedDate ? selectedDate.toDateString() : 'Select a date'}
            {selectedTime ? ` - ${selectedTime.toLocaleTimeString()}` : ''}{' '}
          </Text>
          <View style={{ flexDirection: 'row', alignSelf: "flex-end" }}>
            <TouchableOpacity onPress={() => setOpenDate(true)}>
              <Image source={require("../../../assets/addTask/calendar.png")} style={{ width: 25, height: 25 }} />
            </TouchableOpacity>
            {/* <AntDesign name="calendar" size={24} color="black" onPress={() => setOpenDate(true)} /> */}
            {/* <AntDesign name="clockcircleo" size={24} color="black" onPress={() => setOpenTime(true)} style={{ marginLeft: 15 }} /> */}
            <TouchableOpacity onPress={() => setOpenTime(true)} >
              <Image source={require("../../../assets/addTask/time.png")} style={{ width: 25, height: 25, marginLeft: 15 }} />
            </TouchableOpacity>
          </View>
        </View>

        {/* open calendar when icon is press */}

        {openDate && (
          <DateTimePicker
            testID="Assigned on date"
            value={new Date()}
            mode="date"
            onChange={(event, selectedDate) => {
              if (selectedDate !== undefined) {
                setOpenDate(false);
                setSelectedDate(selectedDate);
                console.log("Selected Date:", selectedDate);
              }
            }}
            display="default"
          />
        )}

        {/* open time when icon is press */}

        {openTime && (
          <DateTimePicker
            testID="Assigned on time"
            value={selectedTime || new Date()}
            mode="time"
            is24Hour={true}
            onChange={(event, selectedTime) => {
              if (selectedTime !== undefined) {
                setOpenTime(false);
                setSelectedTime(selectedTime);
                console.log("Selected Time:", selectedTime);
              }
            }}
            display="default"
          />
        )}
        <Text style={styles.label}>Priority:</Text>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          data={dropDownData}
          maxHeight={250}
          labelField="label"
          valueField="value"
          placeholder="Select Priority"
          value={value}
          onChange={(item) => {
            const { label, value } = item; // Destructure the selected item
            setFormData({ ...formData, priority: { label, value } }); // Store the label and value in the priority property
          }}

        />
      </View>
      {/* {results.map((result, index) => <Text key={index}>{result}</Text>)} */}
      <CustomSubmitButton title="Submit" onPress={handleSubmit} />
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    backgroundColor: "#ffa600",
  },
  buttonContent: {
    flexDirection: "row",
    marginLeft: 10,
    marginBottom: 12,
    alignItems: "center"
  },
  buttonText: {
    marginLeft: 34,
    fontSize: 17,
    color: "white"
  },
  label: {
    color: "#ffa600",
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 2,
    marginVertical: 15
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
    borderLeftWidth: 1.5,
    borderLeftColor: "#ffa600",
  },
  taskContainer: {
    padding: 15
  },
  taskInput: {
    borderWidth: 0.9,
    paddingHorizontal: 10,
    // paddingVertical: 15,
    paddingTop: 0,
    padding: 30,
    fontSize: 18,
    borderRadius: 6,
    fontSize: 13,
    color: "black",
    fontWeight: "600",
    borderRightWidth: 2.5,
    borderRightColor: "#ffa600",
    // marginVertical: 20
  },
  alignRight: {
    paddingVertical: 5,
    alignSelf: "flex-end"
  },
  datePicker: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    flex: 1,
    alignItems: "center"
  },
  dropdown: {
    borderRadius: 5,
    borderWidth: 0.9,
    paddingHorizontal: 10,
    borderRightWidth: 2.5,
    borderRightColor: "#ffa600",
  },
  submitButtonContent: {
    padding: 10,
    alignItems: "center",
    backgroundColor: "#ffa600",
    borderRadius: 13,
  },
  submitButtonTitle: {
    fontSize: 15,
    color: "white"
  },
  submitButtonContainer: {
    position: 'absolute',
    bottom: 50,
    left: 10,
    right: 10,
  },
})

export default AddTask