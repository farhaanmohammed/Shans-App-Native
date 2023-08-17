import React, { useEffect } from "react";
import { Text,View,StyleSheet,ScrollView,TextInput,Modal,Button,FlatList,TouchableOpacity } from "react-native"
import { Picker } from "@react-native-community/picker";
import { Formik } from "formik";
import { baseUrl } from "../../api/const";
import axios from "axios";
import DateTimePicker from '@react-native-community/datetimepicker'
import SearchableDropDown from "react-native-searchable-dropdown";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Complaints from "./Complaints";


export default function AddJob(){

    const brandUrl=`${baseUrl}/viewJobBrand/job_brand_model/dropdown`;
    const deviceUrl=`${baseUrl}/viewJobDevice/job_devices/dropdown`;
    const employeeUrl=`${baseUrl}/viewEmployees/employee_list/employee_dropdown`;

    const[device,setDevice]= React.useState([]);
    const[brand,setBrand]=React.useState([]);
    const[jobItem,setJobItem]=React.useState([]) ;   
    const[employee,setEmployee]=React.useState([]);
    const[modal,setModal]=React.useState(false);
    const[complaints,setComplaints]=React.useState([]);
    
    

    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 to month since it's zero-based
    const day = currentDate.getDate().toString().padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;

    const[date,setDate]=React.useState(formattedDate);

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

    },[])
    // console.log("Employee Details++_________________________",employee)
    // console.log("the device array ????????????",device)
    // console.log("outside effet++++++++++",jobItem)
    // console.log("outside effet-------------",brand)

    // console.log("date",date)

    function handleComplaintSubmit(values){
        setComplaints([...complaints,values]);

    }

    console.log("complaint in addjob +++++++++++",complaints);

    function handleclose(value){
        setModal(value);
    }

    function handleRemoveComplaint(index){
        const updatedComplaints = complaints.filter((item, i) => i !== index);
        setComplaints(updatedComplaints);
    }






    return(
        <View style={{flex:1,}}>
            
            <ScrollView style={styles.container}>
                <Formik
                    initialValues={{customer:'',mobile:'',email:'',warehouse_name:warehouse_name1,consumer_model_id:'',device_id:'',brand_id:'',estimation:'',assignedOn: new Date().toISOString().split('T')[0],assignedto:'',}}
                    onSubmit={(values)=> {console.log("values:",values)}}
                
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
                            <TextInput
                                style={styles.input}
                                placeholder="Warehouse"
                                onChangeText={(value)=>{props.handleChange('warehouse_name')}}
                                value={props.values.warehouse_name}
                            />
                            
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
                                onValueChange={props.handleChange('device_id')}
                                selectedValue={props.values.device_id}
                            
                            >
                                <Picker.Item label="Select Device" value="" />
                                {device.map((item)=>(
                                    <Picker.Item
                                        label={item.model_name.toString()}
                                        value={item.id}
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
                                placeholder="Select Device"
                                onValueChange={props.handleChange('brand_id')}
                                selectedValue={props.values.brand_id}
                            
                            >
                                <Picker.Item label="Select Brand" value="" />
                                {brand.map((item)=>(
                                    <Picker.Item
                                        label={item.brand_name.toString()}
                                        value={item.brand_id}
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
                                placeholder="Select Device"
                                onValueChange={props.handleChange('consumer_model_id')}
                                selectedValue={props.values.consumer_model_id}
                            
                            >
                                <Picker.Item label="Select Consumer Model" value="" />
                                {jobItem.map((item)=>(
                                    <Picker.Item
                                        label={item.model_name.toString()}
                                        value={item.model_id}
                                        key={item.model_id}
                                    />
                                ))}

                            </Picker>
                            

                        </View>

                        <View style={styles.heading}>
                            <Text style={styles.headingtext}>
                                Accessories
                            </Text>
                        </View>

                        <View style={styles.heading}>
                            <Text style={styles.headingtext}>
                                Complaints/service Requests:
                            </Text>
                            <Modal visible={modal} animationType="slide">
                                <View style={styles.modalHeader}>
                                    <Text style={styles.modalHeaderText}>Modal Header</Text>
                                    <Button title="Close" onPress={() => setModal(false)} />
                                </View>
                                <View style={styles.modalContent}>
                                    {/* The rest of your modal content */}
                                    <Complaints onSubmitted={handleComplaintSubmit} Closebutton={handleclose}/>
                                </View>
                            </Modal>

                            <Button title="open model" onPress={()=>setModal(true)}/>

                            {complaints.length > 0 && complaints.map((item,index)=>(
                                <View key={index} style={styles.contentborder}>
                                    <View style={styles.complaintfield_margin}>
                                        <View style={styles.complaintfield}>
                                            <Text >Complaint/Service:</Text>
                                            <Text style={styles.complaintfieldval}>{item.complaint_type_name}</Text>
                                        </View>
                                        <View style={styles.complaintfield}>
                                            <Text>Complaint/Service Request:</Text>
                                            <Text style={styles.complaintfieldval}>{item.complaint_request_name}</Text>
                                        </View>
                                        <View style={styles.complaintfield}>
                                            <Text>Remarks:</Text>
                                            <Text style={styles.complaintfieldval}>{item.remarks}</Text>
                                        </View>
                                        <View>
                                            <TouchableOpacity onPress={()=>{handleRemoveComplaint(index)}}>
                                                <Text style={styles.removeButtonText}>REMOVE</Text>
                                            </TouchableOpacity>
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
                            {/* <SearchableDropDown
                            
                                style={styles.input}
                                items={employee}
                                defaultIndex={0}
                                placeholder="Select and employee "
                                resetValue={false}
                                onItemSelect={(item)=>{
                                    props.handleChange('assignedto')(item.name);
                                    props.handleChange('assignedto_id')(item.id);
                                }}
                            /> */}

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
                            {/* <DateTimePicker
                                date={new Date(date.now())}
                                mode={'date'}
                                display="default"
                                is24Hour={true}
                                onChange={props.handleChange('assignedOn')}
                            /> */}
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
                        

                    </View>
                )}
                </Formik>
            </ScrollView>
        </View>
    )

}

const styles=StyleSheet.create({

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
        maxWidth:350,
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
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        backgroundColor: "#ffa600",
    },
    modalHeaderText: {
        fontSize: 18,
        fontWeight: 'bold',
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
        fontSize: 17,
    },



});