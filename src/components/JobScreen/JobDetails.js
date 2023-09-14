import React from "react";
import { View,Text,StyleSheet,TouchableWithoutFeedback, TouchableOpacity, ScrollView } from "react-native";
import { AntDesign } from "@expo/vector-icons";



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

const Diagnosbutton =({title,onPress})=>{
    return(
        <TouchableOpacity onPress={onPress}>
            <View style={styles.diagnosbutton}>
                <Text style={styles.buttontitle}>{title}</Text>
            </View>
            

        </TouchableOpacity>
    );
}


export default function JobDetails({navigation,route}){

    const { item } = route.params;

    console.log("itemS+++++++++++",item)

    return(
        
            <View style={styles.container}>
                    <CustomButton title={`${item.sequence_no}`}  onPress={() => navigation.goBack()} />
                    <ScrollView>
                        <View style={styles.buttonarray}>
                            <Diagnosbutton title="start diagnosis" onPress={()=>{console.log("pressed")}}/>
                            <Diagnosbutton title="ReAssign" onPress={()=>{navigation.navigate('Reassign')}}/>
                            <Diagnosbutton title="Cancel Service" onPress={()=>{console.log("lol pressed")}}/>
                        </View>

                    
                        <Text style={styles.heading}>PENDING FOR SERVICE</Text>

                        <View style={styles.itemborder}>
                            <View style={styles.sectionmargin}>
                                <Text style={{fontWeight:'700',}}>CUSTOMER INFORMATION</Text>
                                <View style={styles.field}>
                                    <Text>Customer Name:</Text>
                                    < Text style={styles.fielddata}>{item.customer_name || '--'}</Text>
                                </View>
                                <View style={styles.field}>
                                    <Text>Mobile:</Text>
                                    <Text style={styles.fielddata}>{item.customer_mobile || '--'}</Text>
                                </View>
                                <View style={styles.field}>
                                    <Text>Email:</Text>
                                    <Text style={styles.fielddata}>{item.customer_email || '--'}</Text>
                                </View>
                                <View style={styles.field}>
                                    <Text>Return Job Order Number:</Text>
                                    <Text style={styles.fielddata}>{item.job_return_no || '--'}</Text>
                                </View>
                            </View>

                        </View>

                        <View style={styles.itemborder}>
                            <View style={styles.sectionmargin}>
                                <Text style={{fontWeight:'700',}}>JOB SHEET</Text>
                                <View style={styles.field}>
                                    <Text>Warehouse/Shop:</Text>
                                    < Text style={styles.fielddata}>{item.warehouse_name || '--'}</Text>
                                </View>
                                <View style={styles.field}>
                                    <Text>Incoming Date:</Text>
                                    <Text style={styles.fielddata}>{item.incoming_date || '--'}</Text>
                                </View>
                                <View style={styles.field}>
                                    <Text>Created On:</Text>
                                    <Text style={styles.fielddata}>{item.created_on || '--'}</Text>
                                </View>
                                <View style={styles.field}>
                                    <Text>Created By:</Text>
                                    <Text style={styles.fielddata}>{item.sales_person_name   || '--'}</Text>
                                </View>
                            </View>

                        </View>

                        <View style={styles.itemborder}>
                            <View style={styles.sectionmargin}>
                                <Text style={{fontWeight:'700',}}>PRODUCT ATTRIBUTE</Text>
                                <View style={styles.field}>
                                    <Text>Device:</Text>
                                    < Text style={styles.fielddata}>{item.device_name || '--'}</Text>
                                </View>
                                <View style={styles.field}>
                                    <Text>Brand:</Text>
                                    <Text style={styles.fielddata}>{item.brand_name || '--'}</Text>
                                </View>
                                <View style={styles.field}>
                                    <Text>Consumer Model:</Text>
                                    <Text style={styles.fielddata}>{ item.consumer_model_name|| '--'}</Text>
                                </View>
                                <View style={styles.field}>
                                    <Text>Serial No:</Text>
                                    <Text style={styles.fielddata}>{   item.serial_no || '--'}</Text>
                                </View>
                            </View>

                        </View>
                        <View style={styles.itemborder}>
                            <View style={styles.sectionmargin}>
                                <Text style={{fontWeight:'700',}}>ACCESSORIES</Text>
                                <View style={styles.field}>
                                        <Text>Accessories:</Text>
                                        {item.accessories.map((item,index)=>(
                                            < Text key={index} style={styles.fielddata}>{index > 0 ? ", " : ""}{item || '--'}</Text>
                                ))}
                                </View>
                            </View>

                        </View>

                        <Text style={styles.heading}>COMPLAINTS/SERVICE REQUESTS</Text>

                        {item.job_complaints_or_service_request.map((item,index)=>(
                            <View key={index} style={styles.itemborder}>
                                <View style={styles.sectionmargin}>
                                    <View style={styles.field}>
                                        <Text>Complaint/Service Type:</Text>
                                        < Text style={styles.fielddata}>{item.complaint_type_name || '--'}</Text>
                                    </View>
                                    <View style={styles.field}>
                                        <Text>Remarks:</Text>
                                        < Text style={styles.fielddata}>{item.remarks || '--'}</Text>
                                    </View>

                                </View>

                            </View>

                        ))}

                        

                        <View style={styles.itemborder}>
                            <View style={styles.sectionmargin}>
                                <Text style={{fontWeight:'700',}}>JOB CREATION REMARKS</Text>
                                <View style={styles.field}>
                                    <Text>Assigned To:</Text>
                                    < Text style={styles.fielddata}>{item.assignee_name || '--'}</Text>
                                </View>
                                <View style={styles.field}>
                                    <Text>Assigned On:</Text>
                                    <Text style={styles.fielddata}>{item.assigned_on || '--'}</Text>
                                </View>
                                <View style={styles.field}>
                                    <Text>Total Estimation:</Text>
                                    <Text style={styles.fielddata}>{ item.total_sale_estimation|| '--'}</Text>
                                </View>
                                
                            </View>

                        </View>
                </ScrollView>

                    
            </View>
    )

}

const styles=StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'white',
    },
    heading:{
        fontWeight:'bold',
        fontSize:15,
        marginVertical:15,
        marginHorizontal:17,

    },
    sectionmargin:{
        
        marginHorizontal:15,
        marginVertical:10,

    },
    itemborder:{
        borderWidth:0.7,
        borderRadius:6,
        borderColor:"black",
        marginHorizontal:15,
        marginTop:15,
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
    field:{
        flexDirection:'row',
        
    },
    fielddata:{
        marginLeft:5,
        fontWeight:'700',
    },
    diagnosbutton:{
        textAlign: "center",
        padding:10,
        borderWidth:.7,
        borderRadius:10,
        borderColor:"#ffa600",

        // padding: 10,
        
        backgroundColor: "#ffa600",
    },
    buttonarray:{
        flexDirection:'row',
        marginHorizontal:15,
        marginVertical:10,
        justifyContent:'space-evenly'
        
    },
    buttontitle:{
        textAlign:'center',
        color: "white"
    }
    }
)