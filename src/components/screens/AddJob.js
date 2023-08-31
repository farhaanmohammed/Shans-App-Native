import React, { useEffect } from "react";
import { Text,View,StyleSheet,ScrollView,TextInput,Modal,Button,FlatList,TouchableOpacity } from "react-native"
import { Picker } from "@react-native-community/picker";
import { Formik } from "formik";
import { baseUrl } from "../../api/const";
import axios, { all } from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Complaints from "./Complaints";
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { Dropdown ,MultiSelect } from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as DocumentPicker from 'expo-document-picker';
import { Feather } from '@expo/vector-icons';
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










export default function AddJob(){

    const brandUrl=`${baseUrl}/viewJobBrand/job_brand_model/dropdown`;
    const deviceUrl=`${baseUrl}/viewJobDevice/job_devices/dropdown`;
    const employeeUrl=`${baseUrl}/viewEmployees/employee_list/employee_dropdown`;
    const accessoriesUrl= `${baseUrl}/viewJobAccessory/accessory_list/accessory_dropdown`;
    const contacturl = `${baseUrl}/viewCustomers`;
    const jobbookingUrl= `${baseUrl}/viewJobBooking`;
    const imageUploadUrl= `${baseUrl}/fileUploadMultiple`;
    const consumerModelUrl=`${baseUrl}/viewJobConsumerModel`;


    const[device,setDevice]= React.useState([]);
    const[brand,setBrand]=React.useState([]);
    const[jobItem,setJobItem]=React.useState([]) ;   
    const[employee,setEmployee]=React.useState([]);
    const[modal,setModal]=React.useState(false);
    const[complaints,setComplaints]=React.useState([]);
    const[accessories,setAccesories]=React.useState([]);
    // const[selectedaccessories,setSelectedAccessories]=React.useState([]);
    const[customers,setCustomers]=React.useState([])
    const[jobs,setJobs]=React.useState([]);
    const[openDate,setOpenDate]=React.useState(false)
    const[uris,setUris]=React.useState([])
    const [selectedDocument, setSelectedDocument] = React.useState([]);
    const [scannedData, setScannedData] = React.useState('');
    const[consumermodel,setConsumerModel]=React.useState([]);



    const navigation=useNavigation();
    

    const [value, setValue] = React.useState(null);
    const [isFocus, setIsFocus] = React.useState(false);

    const renderItem = item => {
        return (
            <View style={styles.item}>
                {/* <CheckBox checked={isSelected} color="black" style={styles.checkbox} /> */}
                <Text style={styles.selectedTextStyle}>{item.accessories_name}</Text>
                <AntDesign style={styles.icon} color="black" name="Safety" size={20} />
            </View>
            );
        };
    
    

    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 to month since it's zero-based
    const day = currentDate.getDate().toString().padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;

    const[date,setDate]=React.useState(new Date());

    const[warehouse ,setWarehouse]=React.useState('');

    useEffect(()=>{
            const fetchData = async()=>{
    
            try {
                const StoredData=await AsyncStorage.getItem('userData')
    
                // console.log("storedData:",StoredData);
    
                if (StoredData!==null){
                const userData=JSON.parse(StoredData)
                setWarehouse(userData.warehouse);
                }else{
                setWarehouse('No data Found')
                }
            } catch(error){
                console.log('error fetching data',error)
            }
            }
    
            fetchData();
    
        },[])

        

        

        const handleScan = () => {
            navigation.navigate('Scanner', {
                onScan: (data) => {
                    setScannedData(data); // Store the scanned data in component state
                },
            });
        };


        console.log("scanned data in jobsscreen",scannedData);


        

        

        

    
    const warehouse_name1=warehouse.warehouse_name;
    console.log("the amen of the ware house",warehouse_name1)
    // const warehouse_name=user.warehouse.warehouse_name
    // console.log("+++++++++++++==================",warehouse_name)

    useEffect(()=>{
        axios.get(brandUrl).then((res)=>{
            const brandArray=res.data.data.map((item)=>({
                brand_id:item._id,
                brand_name:item.brand_name,
                models:item.job_devices.map((device)=>({model_id:device._id,model_name:device.model_name})),
            
                
                
                
            }))

            const allJobItems = brandArray.flatMap((brand) => brand.models);
            setJobItem(allJobItems);
            setBrand(brandArray)
            // console.log(allJobItems)
            // console.log(brandArray)
            

        }).catch(err=>console.log(err))

        axios.get(deviceUrl).then((res)=>{
            // console.log(res.data.data)
            const deviceArray=res.data.data.map((item)=>({
                id:item._id,
                model_name:item.model_name
            }))

            setDevice(deviceArray);

            // console.log("the device array ????????????",deviceArray)
        }).catch(err=>console.log(err))

        axios.get(employeeUrl).then((res)=>{

            const employeeArray=res.data.data.map((item)=>({
                id:item._id,
                name:item.name
            }))

            setEmployee(employeeArray)
        })

        axios.get(accessoriesUrl).then(res=>{

            const accessoriesArray=res.data.data.map((item)=>({
                id:item._id,
                accessories_name:item.accessories_name,
            }))

            // console.log("acceessArray..............",accessoriesArray)

            setAccesories(accessoriesArray);
        })

        axios.get(contacturl).then(res=>{
            const contactArray=res.data.data.map((item)=>({
                id:item._id,
                name:item.name,
                customer_mobile:item.customer_mobile,
                customer_email:item.customer_email,
            }))
            setCustomers(contactArray);
        })

        axios.get(jobbookingUrl).then(res=>{
            const jobArray=res.data.data.map((item)=>({
                id:item._id,
                sequence_no:item.sequence_no,
                device_id:item.device_id,
                brand_id:item.brand_id,
                consumer_model_id:item.consumer_model_id,
                serial_no:item.serial_no,
                customer_id:item.customer_id,
                create_date:item.create_date,

            }))
            setJobs(jobArray);
        })

        axios.get(consumerModelUrl).then(res=>{
            const modelArray=res.data.data.map((item)=>({
                id:item._id,
                model_name:item.model_name,
                job_device_id:item.job_device_id,
                job_brand_id:item.job_brand_id
            }))
            setConsumerModel(modelArray);
        })

    },[])
    // console.log("Employee Details++_________________________",employee)
    // console.log("the device array ????????????",device)
    // console.log("outside effet++++++++++",jobItem)
    // console.log("outside effet-------------",brand)

    // console.log("date",date)
    // console.log("accedsss============================",accessories);

    // console.log("JObbooking++++++++++++++++++++",jobs)
    // console.log("consumer mOdel+++++++++++++++++++++++++++++++",brand);
    // console.log("scanned data--------------------",scannedData);

    function handleComplaintSubmit(values){
        setComplaints([...complaints,values]);

    }

    // console.log("complaint in addjob +++++++++++",complaints);

    function handleclose(value){
        setModal(value);
    }

    function handleRemoveComplaint(index){
        const updatedComplaints = complaints.filter((item, i) => i !== index);
        setComplaints(updatedComplaints);
    }

    // console.log("customers=======================",customers)

    // console.log("accessories==================",accessories);

    
    const contentType = 'image/png';
    

    const selectDoc = async () => {
        try {
            const doc = await DocumentPicker.getDocumentAsync({ multiple: true, type: 'image/*' });
    
            if (!doc.canceled) {  // Use "cancelled" instead of "canceled"
                setSelectedDocument(doc.assets);
    
                const fileDataArray = doc.assets.map((document, index) => {
                    const fileUri = document.uri;
                    const fileName = fileUri.split('/').pop();
    
                    return {
                        uri: fileUri,
                        type: contentType,  // Replace with the appropriate content type
                        name: fileName,
                    };
                });

                
    
                const formData = new FormData();
                fileDataArray.forEach((fileData) => {
                    formData.append('files[]', fileData);
                });
    
                const config = {  // Define your axios config here
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                };

                console.log("foemdata++++++++++++++",formData)
    
                const response = await axios.post(imageUploadUrl, formData, config);
    
                if (response.data && response.data.data) {
                    const uploadUrl = response.data.data;
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
            console.log("error",error)
        }
    };
    

        const removeImage = (index) => {
            const updatedDocuments = selectedDocument.filter((_, i) => i !== index);
            setSelectedDocument(updatedDocuments);
        };
        

        console.log("document selectwd=====================",selectedDocument)
        // console.log("urisss++++++++++++++++++++++++++",uris)





    return(
        <View style={{flex:1,}}>
            
            <ScrollView style={styles.container}>
                <Formik
                    initialValues={{ customer:'',customer_id:'',mobile:'',email:'',warehouse_name:'',consumer_model_id:'',consumer_model_name:'',device_id:'',device_name:'',
                    brand_id:'',brand_name:'',
                    estimation:'',assignedOn: '',assignedto:'',remarks:'',accessories:[], jobbooking_id:'',serial_no:scannedData,
                }}
                    onSubmit={(values)=> {console.log("values:",values)
                    console.log("Selected customer:");
                
                }}
                
                >
                {(props)=>(
                    <View style={styles.form}>
                        <View style={styles.heading}>
                            <Text style={styles.headingtext}>Customer Information</Text>
                        </View>
                        <View>
                            <Text style={styles.fieldtext}>
                                Search by Mobile/Customer:
                            </Text>

                            {/* {renderLabel()} */}
                            <Dropdown
                                style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
                                data={customers}
                                search
                                maxHeight={300}
                                labelField="name"
                                valueField="_id"
                                placeholder={props.values.customer ?props.values.customer : "Select Customer"     }
                                searchPlaceholder="Search Customers"
                                value={props.values?.customer}
                                onFocus={() => setIsFocus(true)}
                                onBlur={() => setIsFocus(false)}
                                onChange={item=>{
                                    // props.setFieldValue('customer',item)
                                    props.setFieldValue('customer', item.name);
                                    props.setFieldValue('customer_id', item.id); // Set the customer ID
                                    props.setFieldValue('mobile', item.customer_mobile); // Set other fields like mobile if available
                                    props.setFieldValue('email', item.customer_email);
                                
                                }}
                            />


                        </View>
                        <View style={styles.fieldmargin}>
                            <Text style={styles.fieldtext}>Mobile:</Text>

                            <TextInput
                                style={styles.input}
                                placeholder="Mobile number"
                                onChangeText={props.handleChange('mobile')}
                                value={props.values.mobile}
                            />
                        </View>
                        <View style={styles.fieldmargin}>
                            <Text style={styles.fieldtext}>Email:</Text>

                            <TextInput
                                style={styles.input}
                                placeholder="Email"
                                onChangeText={props.handleChange('email')}
                                value={props.values.email}
                            />
                        </View>
                        <View style={styles.fieldmargin}>
                            <Text style={styles.fieldtext}>
                                Return Job Number:
                            </Text>

                            {/* <Picker
                                style={styles.input}
                                enabled={true}
                                mode="dropdown"
                                
                                onValueChange={(item)=>{

                                    console.log("itemssssssssssssssss=+=========",item)
                                    
                                    props.handleChange('jobbooking_id')
                                    props.setFieldValue('assignedOn',item.create_date)
                                    props.setFieldValue('serial_no',item.serial_no)
                                    props.setFieldValue('brand_id',item.brand_id)
                                    props.setFieldValue('device_id',item.device_id)
                                    props.setFieldValue('consumer_model_id',item.consumer_model_id)
                                    
                                    
                                    

                                    
                                }}
                                selectedValue={props.values.jobbooking_id}
                            
                            >
                                <Picker.Item label="Select Job Number" value="" />
                                {jobs.map((item)=>{
                                    console.log("job item in picker============",item)
                                    console.log("customer in jobs",props.values.customer_id)
                                    if(item.customer_id===props.values.customer_id)
                                        {
                                            return(
                                                <Picker.Item
                                                    label={item.sequence_no.toString()}
                                                    value={item.id}
                                                    key={item.id}
                                                />
                                            )
                                        }
                                })}
                            </Picker> */}
                            
                            <Dropdown
                                style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
                                data={filteredJobs = jobs.filter(job => job.customer_id === props.values.customer_id)}
                                maxHeight={300}
                                labelField="sequence_no"
                                valueField="id"
                                placeholder={props.values.jobbooking_id==props.values.customer_id ?props.values.jobbooking_id : "Select Job Number"     }
                                value={props.values?.jobbooking_id}
                                onFocus={() => setIsFocus(true)}
                                onBlur={() => setIsFocus(false)}
                                onChange={item=>{
                                    console.log("job details",item);
                                    props.setFieldValue('jobbooking_id',item.id)
                                    props.setFieldValue('brand_id', item.brand_id);
                                    props.setFieldValue('device_id', item.device_id); // Set the customer ID
                                    props.setFieldValue('consumer_model_id', item.consumer_model_id); // Set other fields like mobile if available
                                    // props.setFieldValue('serial_no', item.serial_no);
                                    setScannedData(item.serial_no);
                                
                                }}
                            />


                        </View>
                        <View style={styles.heading}>
                            <Text style={styles.headingtext}>
                                Job Sheet Data
                            </Text>
                        </View>
                        <View style={styles.fieldmargin}>
                            <Text style={styles.fieldtext}>
                                Warehouse/Shop:
                            </Text>
                            {/* <TextInput
                                style={styles.input}
                                placeholder="Warehouse"
                                onChangeText={props.handleChange('warehouse_name')}
                                value={props.values.warehouse_name}
                            /> */}
                            <View style={styles.input}>
                                <Text style={{fontSize:16,}}>{warehouse_name1}</Text>
                            
                            </View>
                            
                        </View>
                        <View style={styles.fieldmargin}>
                            <Text style={styles.fieldtext}>
                                Incoming date:
                            </Text>

                        </View>
                        <View>
                            <Text style={styles.headingtext}>
                                Product Attribute
                            </Text>
                        </View>
                        <View>
                            <Text style={styles.fieldtext}>
                                Device :
                            </Text>
                            <Picker
                                style={styles.input}
                                enabled={true}
                                mode="dropdown"
                                placeholder="Select Device"
                                onValueChange={(value)=>{console.log("selected value in device:",value)
                                                props.setFieldValue('device_id',value.model_id)
                                                props.setFieldValue('device_name',value.model_name)
                                                }}
                                selectedValue={props.values.device_id}
                            
                            >
                                <Picker.Item label="Select Device" value="" />
                                {device.map((item)=>(
                                    <Picker.Item
                                        label={item.model_name.toString()}
                                        value={{model_id:item.id,model_name:item.model_name}}
                                        key={item.id}
                                    />
                                ))}

                            </Picker>


                        </View>
                        <View style={styles.fieldmargin}>
                            <Text style={styles.fieldtext}>Brand:</Text>

                            <Picker
                                style={styles.input}
                                enabled={true}
                                mode="dropdown"
                                placeholder="Select Brand"
                                onValueChange={(value)=>{console.log("selected value in brand:",value)
                                                props.setFieldValue('brand_id',value.brand_id)
                                                props.setFieldValue('brand_name',value.brand_name)
                            
                                                    }}
                                selectedValue={props.values.brand_id}
                            
                            >
                                <Picker.Item label="Select Brand" value="" />
                                {brand.map((item)=>(

                                    
                                    
                                    <Picker.Item
                                        label={item.brand_name.toString()}
                                        value={{brand_id:item.brand_id,brand_name:item.brand_name}}
                                        key={item.brand_id}
                                    />
                                ))}

                            </Picker>
                            

                        </View>
                        <View style={styles.fieldmargin}>
                            <Text style={styles.fieldtext}>Consumer Model:</Text>

                            <Picker
                                style={styles.input}
                                enabled={true}
                                mode="dropdown"
                                // placeholder="Select Model"
                                onValueChange={(value)=>{console.log("selected value in consumer_model:",value)
                                                props.setFieldValue('consumer_model_id',value.consumer_model_id)
                                                props.setFieldValue('consumer_model_name',value.consumer_model_name)
                            
                                                    }}
                                selectedValue={props.values.consumer_model_id}
                            
                            >
                                <Picker.Item label="Select Consumer Model" value="" />
                                {consumermodel.map((item)=>{
                                    if(item.job_brand_id==props.values.brand_id && item.job_device_id==props.values.device_id){
                                        return(
                                            <Picker.Item
                                                label={item.model_name.toString()}
                                                value={{consumer_model_id:item.id,consumer_model_name:item.model_name}}
                                                key={item.id}
                                            />
                                        )
                                    }
                                } 
                                )}

                            </Picker>
                            

                        </View>
                                

                        <View style={styles.fieldmargin}>
                        
                            <Text style={styles.fieldtext}>
                                Serial Number:
                            </Text>
                            <View style={[styles.input,{flexDirection:'row', justifyContent:'space-between'}]}>
                                <TextInput
                                    
                                    placeholder="Serial Number"
                                    onChangeText={(value)=>{setScannedData(value)}}
                                    value={scannedData}
                                />
                                <AntDesign name="scan1" size={24} color="black"  onPress={handleScan} />
                            </View>
                            
                            

                        </View>

                        <View style={styles.heading}>
                            <Text style={styles.headingtext}>
                                Accessories
                            </Text>
                            <MultiSelect 
                                style={styles.dropdown}
                                // placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                inputSearchStyle={styles.inputSearchStyle}
                                data={accessories}
                                labelField="accessories_name"
                                valueField="id"
                                placeholder="select item"
                                value={props.values?.accessories}
                                search
                                searchPlaceholder="Select Accessories"
                                onChange={item=>{
                                    console.log("item========================",item)
                                    props.setFieldValue('accessories',item)
                                }}
                                renderItem={renderItem}
                                renderSelectedItem={(item,unSelect)=>(
                                    <TouchableOpacity onPress={()=>unSelect && unSelect(item)}>
                                        <View style={styles.selectedStyle}>
                                            <Text style={styles.textSelectedStyle}>{item.accessories_name}</Text>
                                            <AntDesign color="black" name="delete" size={17} />
                                        </View>
                                    </TouchableOpacity>
                                )}
                            />
                            
                        </View>


                        <View style={styles.heading}>
                            <Text style={styles.headingtext}>
                                Complaints/Service Requests:
                            </Text>
                            <Modal visible={modal} animationType="slide">
                                <View style={styles.modalHeader}>
                                    <AntDesign name="close" size={24} color="black" onPress={() => setModal(false)} />
                                    <Text style={styles.modalHeaderText}>ADD COMPLAINT OR REQUEST</Text>
                                    
                                    
                                </View>
                                <View style={styles.modalContent}>
                                    {/* The rest of your modal content */}
                                    <Complaints onSubmitted={handleComplaintSubmit} Closebutton={handleclose}/>
                                </View>
                            </Modal>
                            <TouchableOpacity style={styles.complaintbutton} onPress={()=>setModal(true)}>

                                <Text style={styles.complaintboxtext}>ADD COMPLAINT OR REQUEST</Text>
                                <Ionicons name="ios-add-circle" size={24} color="green"  />

                            </TouchableOpacity>
                            {/* <Button title="open model" onPress={()=>setModal(true)}/> */}

                            {complaints.length > 0 && complaints.map((item,index)=>(
                                <View key={index} style={styles.contentborder}>
                                    <View style={styles.complaintfield_margin}>
                                        
                                            <View style={styles.complaintfield}>
                                                <Text >Complaint/Service:</Text>
                                                <Text style={styles.complaintfieldval}>{item.complaint_type_name}</Text>
                                            </View>

                                            <View style={{flexDirection:'row',flex:1,justifyContent:'space-between'}}>

                                                <View style={styles.complaintfield}>
                                                    <Text>Complaint/Service Request:</Text>
                                                    <Text style={styles.complaintfieldval}>{item.complaint_request_name}</Text>
                                                </View>

                                                <View>
                                                    <TouchableOpacity onPress={()=>{handleRemoveComplaint(index)}}>
                                                        <Text style={styles.removeButtonText}>REMOVE</Text>
                                                    </TouchableOpacity>
                                                </View>


                                            </View>
                                            
                                            <View style={styles.complaintfield}>
                                                <Text>Remarks:</Text>
                                                <Text style={styles.complaintfieldval}>{item.remarks}</Text>
                                            </View>
                                        
                                        
                                        

                                    </View>
                                    
                                </View>
                            ))
                                    


                            }
                        </View>

                        <View style={styles.heading}>
                            <Text style={styles.headingtext}>
                                Jobs Creation Remarks:
                            </Text>
                        </View>
                        <View style={styles.fieldmargin}>
                            <Text style={styles.fieldtext}>
                                    Assigned To:
                            </Text>
                            

                            <Picker
                                style={styles.input}
                                enabled={true}
                                mode="dropdown"
                                placeholder="Select Device"
                                onValueChange={props.handleChange('assignedto')}
                                selectedValue={props.values.assignedto}
                            
                            >
                                <Picker.Item label="Select Employee" value="" />
                                {employee.map((item)=>(
                                    <Picker.Item
                                        label={item.name.toString()}
                                        value={item.id}
                                        key={item.id}
                                    />
                                ))}

                            </Picker>


                        </View>
                        <View style={styles.fieldmargin}>
                            <Text style={styles.fieldtext}>
                                    Assigned On:
                            </Text>

                            <View style={[styles.input,{flexDirection:'row',justifyContent:'space-between'}]}> 
                                <Text> {props.values.assignedOn}</Text>
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
                                            props.setFieldValue('assignedOn', selectedDate.toISOString().split('T')[0]);
                                            console.log("Selected Date:", selectedDate);
                                        }
                                    }}
                                    display="default" 


                                />
                            )}
                            
                            
                        </View>
                        <View style={styles.fieldmargin}>
                            <Text style={styles.fieldtext}>
                                    Estimation:
                            </Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Please enter Estimation"
                                onChangeText={props.handleChange('estimation')}
                                value={props.values.estimation}
                            />
                        </View>
                        <View  style={styles.fieldmargin}>
                            <Text  style={styles.fieldtext}>Remarks</Text>

                            <View style={styles.remarkinput}>

                                <TextInput
                                    
                                    multiline={true}
                                    numberOfLines={4}
                                    onChangeText={props.handleChange('remarks')}
                                    value={props.values.remarks}
                                    placeholder="Enter remarks"
                                    textAlignVertical="top"
                                
                                />

                            </View>

                            <View style={styles.fieldmargin}>
                                <Text style={styles.fieldtext}> Images</Text>
                                {selectedDocument.length > 0 ? (
                                        selectedDocument.map((document, index) => (
                                            // console.log("documents==============",document)
                                                <View key={index} style={{flexDirection:'row'}}>
                                                    <Text style={{fontSize:15,fontWeight:'700',}}>{document.name}</Text>
                                                    <Feather name="trash" size={24} color="black" onPress={() => removeImage(index)}/>

                                                </View>
                                                
                                            
                                            
                                        ))
                                    ) : (
                                        <Text>No documents selected</Text>
                                    )}
                                <CustomButton title="Select Images" onPress={selectDoc} />
                            </View>

                            <Button title="submit" onPress={props.handleSubmit}/>

                        </View>

                        
                        

                    </View>
                )}
                </Formik>
            </ScrollView>
        </View>
    )

}

const styles=StyleSheet.create({

    item: {
        padding: 17,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    selectedTextStyle: {
        fontSize: 14,
        color:"black",
    },

    dropdown: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
    },
    textSelectedStyle: {
        marginRight: 5,
        fontSize: 16,
    },

    selectedStyle: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 14,
        backgroundColor: 'white',
        shadowColor: '#000',
        marginTop: 8,
        marginRight: 12,
        paddingHorizontal: 12,
        paddingVertical: 8,
        shadowOffset: {
        width: 0,
        height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },

    dropdown_access: {
        height: 50,
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 12,
        shadowColor: '#000',
        shadowOffset: {
        width: 0,
        height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,

        elevation: 2,
    },

    container: {
        flexGrow: 1,
        paddingHorizontal: 10,
        
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

    form:{
        marginVertical:5,
        marginHorizontal:25,
        
        
    },

    headingtext:{
        fontSize:20,
        fontWeight:'600',
        marginVertical:18,
    },

    fieldmargin:{
        marginVertical:2,
        justifyContent:'center',

    },
    fieldtext:{
        color:"#ffa600",
        fontWeight:"800",
        fontSize:16,
    },

    modalHeader: {
        flexDirection: 'row',
        // justifyContent:'space-around',
        alignItems: 'center',
        padding: 15,
        backgroundColor: "#ffa600",
    },
    modalHeaderText: {
        flex: 1, 
        textAlign: 'center', 
        fontSize: 18,
        fontWeight: 'bold',
        color:"white",
        
    },
    modalContent: {
        padding: 20,
    },

    remarkinput:{
        borderWidth:0.5,
        borderColor:"black",
        paddingHorizontal: 10,
        paddingTop:5,
        // fontSize:12,
        borderRadius:6,
        maxWidth:350,
        
    },
    contentborder:{
        borderWidth:0.5,
        borderColor:"#ffa600",
        borderRadius:6,
        marginVertical:5,

    },
    complaintfield_margin:{
        marginLeft:8,
        
        


    },

    complaintfield:{
        marginVertical:3,
        flexDirection:'row',
    },

    complaintfieldval:{
        fontWeight:'800',
        marginLeft:3,
    },

    removeButtonText: {
        color: 'red',
        fontWeight: '600',
        fontSize: 16,
        
    },

    complaintbutton:{
        flexDirection:'row',
        justifyContent:'space-between',
        borderWidth:0,
        // borderColor:"white",
        borderRadius:6,
        marginVertical:5,
        padding:20,
        backgroundColor:'#ebebeb',

    },

    complaintboxtext:{
        color:'#ffa600',
        fontWeight:'700',
    },

    remarkinput:{
        borderWidth:0.5,
        borderColor:"black",
        paddingHorizontal: 10,
        paddingTop:5,
        borderRadius:6,
        maxWidth:350,
        
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



});