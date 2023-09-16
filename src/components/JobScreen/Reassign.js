import React from "react";
import { Text,View,StyleSheet,TextInput,TouchableWithoutFeedback,Button } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import * as Yup from 'yup';
import { Formik } from "formik";
import DateTimePicker from '@react-native-community/datetimepicker';


const CustomButton = ({ title, onPress }) => {
    return (
        <TouchableWithoutFeedback onPress={onPress}>
            <View style={styles.button}>
                <AntDesign name="left" size={14} color="black" />
                <Text style={styles.title}>{title}</Text>
            </View>
        </TouchableWithoutFeedback>
        );
    };



export default function ReAssign({navigation,route}){

    const[openDate,setOpenDate]=React.useState(false)

    return (
            <View style={styles.container}>
                <CustomButton title="Re-Assign" onPress={() => navigation.goBack()} />
                <Formik
                    initialValues={{ assigned_on: '', assigned_to: '' }}
                    onSubmit={(values) => {
                    // Handle form submission here
                    console.log('Form values:', values);
                    }}
                >
                    {(props) => (
                    <View style={styles.form}>
                        <View style={styles.fieldmargin}>
                            <Text style={styles.fieldtext}> Assigned On:</Text>
                            <View
                            style={[
                                styles.input,
                                { flexDirection: 'row', justifyContent: 'space-between' },
                            ]}
                            >
                            <TextInput
                                
                                placeholder="Select Date"
                                onChangeText={props.handleChange('assigned_on')} // Change 'date' to 'assigned_on'
                                value={props.values.assigned_on} // Change 'date' to 'assigned_on'
                                onBlur={props.handleBlur('assigned_on')} // Change 'date' to 'assigned_on'
                            />
                            <AntDesign
                                name="calendar"
                                size={24}
                                color="black"
                                onPress={() => setOpenDate(true)}
                            />
                            </View>
                
                            {openDate && (
                            <DateTimePicker
                                testID="Assigned on date"
                                value={new Date()}
                                mode="date"
                                onChange={(event, selectedDate) => {
                                if (selectedDate !== undefined) {
                                    setOpenDate(false);
                                    // Set the 'assigned_on' field in Formik
                                    props.setFieldValue(
                                    'assigned_on',
                                    selectedDate.toISOString().split('T')[0]
                                    );
                                    console.log('Selected Date:', selectedDate);
                                }
                                }}
                                display="default"
                            />
                            )}


                        </View>
                        <View style={styles.fieldmargin}>
                                <Text style={styles.fieldtext}>
                                    Customer Name & Number:
                                </Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Please Select Employee"
                                    onChangeText={props.handleChange('assigned_to')}
                                    value={props.values.customer}
                                    onBlur={props.handleBlur('assigned_to')}
                                
                                />
                                {/* { props.touched.customer && props.errors.customer &&
                                <Text style={styles.errorText}>{props.errors.customer}</Text>
                                } */}
                            </View >
                        
            
                        {/* Add a submit button to submit the form */}
                        <Button title="Submit" onPress={props.handleSubmit} />
                    </View>
                    )}
                </Formik>
            </View>
        );




}

const styles=StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'white'
    },
    button: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        backgroundColor: "#ffa600",
        },
    title: {
        marginLeft: 34,
        fontSize: 15,
        color: "white"
        },
    
    form:{
        marginVertical:5,
        marginHorizontal:25,
            
            
    },
    input:{
        borderWidth:0.5,
        borderColor:"black",
        paddingHorizontal: 10,
        paddingVertical:7,
        fontSize:18,
        borderRadius:6,
        maxWidth:390,
        marginTop:5,
    },
    fieldtext:{
        // color:"#ffa600",
        fontWeight:"400",
        fontSize:14,
    },
    fieldmargin:{
        marginVertical:2,
        justifyContent:'center',

    },
})