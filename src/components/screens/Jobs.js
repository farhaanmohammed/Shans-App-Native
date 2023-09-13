import React, { useEffect } from "react"
import { Text, View, StyleSheet, ScrollView,TouchableOpacity,TouchableWithoutFeedback } from "react-native"
import Calender from "../Calender/Calender";
import { FAB } from 'react-native-paper';
import { AntDesign } from '@expo/vector-icons';
import HorizontalCalendar from "../Calender/Calender";
import { baseUrl } from "../../api/const";
import axios from "axios";

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


export default function Jobs({ navigation }) {
    const[jobs,setJobs]=React.useState([])
    const viewJobs= `${baseUrl}/viewJobRegistration`

    useEffect(()=>{
        axios.get(viewJobs).then(res=>{
            const jobArray=res.data.data.map((item)=>({
                id:item._id,
                sequence_no:item.sequence_no,
                invoice_date:item.invoice_date,
                created_on:item.created_on ? item.created_on.split("T")[0] : null,
                created_date:item.created_date? item.created_date.split("T")[0] : null,
                customer_id:item.customer_id,
                customer_name:item.customer_name,
                customer_mobile:item.customer_mobile,
                customer_email:item.customer_email,
                job_return_no:item.job_return_no,
                warehouse_name:item.warehouse_name,
                incoming_date:item.incoming_date ? item.incoming_date.split("T")[0] : null, 
                warehouse_name:item.warehouse_name,
                sales_person_name:item.sales_person_name,
                device_name:item.device_name,
                brand_name:item.brand_name,
                consumer_model_name:item.consumer_model_name,
                serial_no:item.serial_no, 
                accessories:item.accessories.map((accessory) => accessory.accessory_name),
                job_complaints_or_service_request:item.job_complaints_or_service_request.map((request)=>({complaint_type_name:request.complaint_type_name,remarks:request.remarks})),
                assignee_name:item.assignee_name,
                assigned_on:item.assigned_on ? item.assigned_on.split("T")[0] : null,
                total_sale_estimation:item.total_sale_estimation,
            }))
            setJobs(jobArray)
        }).catch(err=>console.log(err));
    },[])

    // console.log("jobsssss_______",jobs)

    return (
        <View style={styles.container}>
            <CustomButton title="Jobs"  onPress={() => navigation.goBack()} />
        
            {/* <HorizontalCalendar/> */}
            {jobs.map(item=>(
                <ScrollView key={item.id}>
                    
                    <TouchableOpacity onPress={()=>{navigation.navigate('JobDetail',{item:item})}}>
                            <View style={styles.item}>
                                <Text>{item.sequence_no}</Text>
                            </View>
                    </TouchableOpacity>
                        
                    

                    

                </ScrollView>
            ))}
            <FAB
                style={styles.fab}
                icon={() => <AntDesign name="plus" size={24} color="white" />}
                onPress={() => navigation.navigate('AddJobscreen')}
            />
        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: 'white',
        // alignItems: 'center',
        // justifyContent: 'center',
    },

    fab: {
        position: 'absolute',
        right: 28,
        bottom: 200,
        backgroundColor: '#ffa600',
        borderRadius: 30,
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
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
    item:{
        marginHorizontal:16,
        marginVertical:14,

    },
    
});