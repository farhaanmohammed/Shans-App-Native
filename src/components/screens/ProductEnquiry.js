import React from "react";
import { Text,View,StyleSheet,ScrollView,TextInput,TouchableOpacity,Image,TouchableWithoutFeedback } from "react-native";
import { Formik } from "formik";
import { AntDesign } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as DocumentPicker from 'expo-document-picker';
import { baseUrl } from "../../api/const";
import axios, { all } from "axios";
import { Feather } from '@expo/vector-icons';
import WritingPad from "../../WritingPad/WritingPad";
import { useNavigation, useRoute } from '@react-navigation/native';


const CustomButton = ({ title, onPress }) => {

    return (
        <TouchableOpacity style={[styles.buttonContainer]} onPress={onPress}>
            <View style={styles.buttonContent}>
                <Text style={styles.buttonText}>{title}</Text>
            </View>
        </TouchableOpacity>
    );
};

const CustomAddButton = ({ title, onPress }) => {
        return (
        <TouchableWithoutFeedback onPress={onPress}>
            <View style={styles.addbutton}>
            <Text style={styles.title}>{title}</Text>
            </View>
        </TouchableWithoutFeedback>
        );
    };


export default function Enquiry(){

    const imageUploadUrl=`${baseUrl}/fileUpload?folder_name=products`;

    const[openDate,setOpenDate]=React.useState(false)
    const[selectedDocument,setSelectedDocument]=React.useState('')
    const[image,setImage]=React.useState('');
    const route = useRoute();
    const WritePadUrl = route.params?.uploadUrl;



    const contentType = 'image/png';
    

    const selectDoc = async () => {
        try {
            const doc = await DocumentPicker.getDocumentAsync({ multiple: false, type: 'image/*' });

            console.log("doccc",doc);
    
            
                if (!doc.canceled) {
                    const fileUri = doc.assets[0].uri;
                    const fileName = fileUri.split('/').pop();
                
    
                    const fileData = {
                        uri: fileUri,
                        type: contentType,  // You can specify the exact content type for images
                        name: fileName,
                    };

                    console.log("filedata",fileData);

                    const formData = new FormData();
                    formData.append('file', fileData);

                const config = {  // Define your axios config here
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                };

                console.log("foemdata++++++++++++++",formData)
    
                const response = await axios.post(imageUploadUrl, formData, config);

                // console.log("res+++++++++++++++++++",response)
    
                if (response.data && response.data.data) {
                    const uploadUrl = response.data.data;
                    setImage(uploadUrl);
                    setSelectedDocument(fileData);
                    console.log('Upload successful. API response:', uploadUrl);  // Fixed log message
                } else {
                    console.log('Upload failed. Unexpected API response:', response.data);
                }
            }

    
        } catch (error) {
            // if (DocumentPicker.isCancel(error)) {
            //     console.log('User cancelled the document picker');
            // } else {
            //     console.error('Error picking document:', error);
            // }
            console.log("Error:", error);
        }
    };

    const removeImage = () => {
        setSelectedDocument(null); // Clear the selected image
    };

    console.log("selected document",selectedDocument)

    console.log("writePad+++++",WritePadUrl)


    return(
        <View style={styles.container}>
            <ScrollView>
                <Formik 
                    initialValues={{ date:'',details:'',customer:'',}}

                    onSubmit={(values)=>{
                        console.log(values)
                        
                    }}
                
                >
                    {(props)=>(

                        <View style={styles.form}>
                            <View style={styles.fieldmargin}>
                                <Text style={styles.fieldtext}>Date:</Text>
                            

                            <View style={[styles.input,{flexDirection:'row',justifyContent:'space-between'}]}> 
                                <Text> {props.values.date}</Text>
                                <AntDesign name="calendar" size={24} color="black" onPress={()=>setOpenDate(true)} />
                            </View>

                            {openDate && (

                                <DateTimePicker 

                                    testID="Assigned on date"
                                    value={new Date()}
                                    mode="date"
                                    onChange={(event, selectedDate) => {
                                        if (selectedDate !== undefined) {
                                            setOpenDate(false);
                                            // setDate(selectedDate);
                                            props.setFieldValue('date', selectedDate.toISOString().split('T')[0]);
                                            console.log("Selected Date:", selectedDate);
                                        }
                                    }}
                                    display="default" 


                                />
                            )}
                            </View>

                            <View style={styles.fieldmargin}>
                                <Text style={styles.fieldtext}>
                                    Product name & Details:
                                </Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter Product name & Details"
                                    onChangeText={props.handleChange('details')}
                                    value={props.values.details}
                                
                                />
                            </View>

                            <View style={styles.fieldmargin}>
                                <Text style={styles.fieldtext}>
                                    Customer Name & Number:
                                </Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Please enter Customer Name & Number"
                                    onChangeText={props.handleChange('customer')}
                                    value={props.values.customer}
                                
                                />
                            </View >

                            <View style={styles.fieldmargin}>
                                <Text style={[{margin:10,},styles.fieldtext]}>(You can directly write here)</Text>
                                <View style={{borderWidth:0.7,borderRadius:10,}}>
                                    <WritingPad/>
                                </View>
                                

                            </View>

                            <View style={styles.fieldmargin}>
                                <Text style={styles.fieldtext}> Images:</Text>
                                {selectedDocument ? (
                                    <View style={{ flexDirection: 'row' }}>
                                        <Image style={styles.tinyLogo} source={{uri:image}}/>
                                        {/* <Text style={{ fontSize: 15, fontWeight: '700' }}>{selectedDocument.name}</Text> */}
                                        <Feather name="trash" size={24} color="black" onPress={removeImage} />
                                    </View>
                            ) : (
                                    <Text>No document selected</Text>
                                )}
                                <CustomButton title="Select Images" onPress={selectDoc} />
                            </View>

                            <View style={{marginTop:100,}}>
                                <CustomAddButton title="Submit" onPress={props.handleSubmit}/>
                            </View>
                            
                            


                        </View>
                    )}

                </Formik>
            </ScrollView>
            
        </View>
    )
}

const styles=StyleSheet.create({

    container:{flex:1,
        backgroundColor:'white',
    },

    headingtext:{
        fontSize:20,
        fontWeight:'600',
        marginVertical:18,
    },

    form:{
        marginVertical:5,
        marginHorizontal:25,
        
        
    },
    fieldmargin:{
        marginVertical:2,
        justifyContent:'center',

    },
    fieldtext:{
        // color:"#ffa600",
        fontWeight:"400",
        fontSize:16,
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

    buttonContent: {
        maxWidth: 120,
        backgroundColor: '#ffa600',
        borderRadius: 6,
        paddingVertical: 7,
        paddingHorizontal:3,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
        marginHorizontal:20,
    },
    buttonText: {
        color: 'white',
        fontSize: 15,
        fontWeight: 'bold',
    },
    tinyLogo: {
        width: 100,
        height: 100,
    },

    addbutton: {
        
        padding: 10,
        alignItems: "center",
        backgroundColor: "#ffa600",
        borderRadius: 13,
    },
    title: {
        marginLeft: 34,
        fontSize: 15,
        color: "white"
    },
});