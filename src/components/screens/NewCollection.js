import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Picker } from "@react-native-community/picker";
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { baseUrl } from "../../api/const";


const collectionTypeUrl = `${baseUrl}/viewCollectionType/collection_type_list/collection_type_dropdown`
const customerDetailsUrl = `${baseUrl}/viewInvoice?sequence_no=`


const CustomButton = ({ title, onPress }) => {

    return (
        <TouchableOpacity style={[styles.buttonContainer]} onPress={onPress}>
            <View style={styles.buttonContent}>
                <Text style={styles.buttonText}>{title}</Text>
            </View>
        </TouchableOpacity>
    );
};

const CustomSubmitButton = ({ title, onPress }) => {
    return (
        <TouchableOpacity style={[styles.submitButtonContainer]} onPress={onPress}>
            <View style={styles.buttonContent}>
                <Text style={styles.buttonText}>{title}</Text>
            </View>
        </TouchableOpacity>
    );
};
const NewCollection = () => {


    const route = useRoute();
    const navigation = useNavigation()

    const [resData, setResData] = useState([])
    const [collectionType, setCollectionType] = useState('');
    // const [selectedCustomer, setSelectedCustomer] = useState('');
    const [adminDetails, setAdminDetails] = useState({});
    const [customer, setCustomer] = useState({})


    //fetch details from scanner compnent
    const scannedData = route.params?.scannedData;

    console.log("scannedData----------", scannedData)

    useEffect(() => {
        fetchAdminDetails();
        axios.get(collectionTypeUrl).then((response) => {
            console.log(response.data)
            setResData(response.data)
        })


    }, []);

    useEffect(() => {
        if (scannedData) {
            fetchCustomerDetails();
        }
    }, [scannedData]);

    const fetchAdminDetails = async () => {
        try {
            const adminDetailsStr = await AsyncStorage.getItem('userData');
            if (adminDetailsStr) {
                const parsedAdminDetails = JSON.parse(adminDetailsStr);
                setAdminDetails(parsedAdminDetails);
                // console.log("adminDetails------", adminDetails);
            }
        } catch (error) {
            console.error("Error fetching admin details:", error);
        }
    };

    console.log("adminDetails--++----", adminDetails);
    console.log("response----------", resData)

    const fetchCustomerDetails = async () => {
        try {
            const response = await axios.get(`${customerDetailsUrl}${scannedData}`);
            const customerData = response.data.data[0] // Assuming the response contains the customer details

            if (customerData) {
                const customerDetails = {
                    customerName: customerData.customer.customer_name,
                    invoiceNumber: customerData.sequence_no,
                    totalAmount: customerData.total_amount.toString()
                }
                console.log("customerDetails======+++", customerDetails)
                setCustomer(customerDetails)
            }


            console.log("customerData", customerData);
            // setCustomerName(customerData.customer_name);
        } catch (error) {
            console.error('Error fetching customer details:', error);
        }
    };


    //formation date
    function formatDate(date) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        return `${day}-${month}-${year}`;
    }

    const currentDate = new Date();
    const formattedDate = formatDate(currentDate);
    console.log(formattedDate);

    // const date = new Date().toDateString();
    // console.log(date)
    let collectionTypeOptions = null;

    if (resData.data) {
        collectionTypeOptions = resData.data.map((item) => (
            <Picker.Item
                key={item._id}
                label={item.collection_type_name}
                value={item.collection_type_name}
            />
        ));
        console.log(collectionTypeOptions)
    }



    return (
        <ScrollView>

            <View style={styles.container}>
                <View>
                    <Text style={styles.label}>Date:</Text>
                    <TextInput
                        value={formattedDate}
                        style={styles.input}
                        editable={false}
                    />
                    <Text style={styles.label}>Sales Person:</Text>
                    <TextInput
                        value={adminDetails.related_profile?.name}
                        style={styles.input}
                        editable={false}
                    />
                    <Text style={styles.label}>Shop:</Text>
                    <TextInput
                        value={adminDetails.warehouse?.warehouse_name}
                        style={styles.input}
                        editable={false}
                    />
                    <Text style={styles.label}>Company:</Text>
                    <TextInput
                        value={adminDetails.company?.name}
                        style={styles.input}
                        editable={false}
                    />
                    <Text style={styles.label}>Collection Type:</Text>
                </View>
                <View style={styles.dropdown}>
                    {/* Dropdown collection type */}
                    <View style={styles.dropdown}>
                        <Picker
                            style={styles.picker}
                            selectedValue={collectionType}
                            onValueChange={(itemValue) => setCollectionType(itemValue)}
                        >
                            <Picker.Item label="Select a collection type" value="" />
                            {collectionTypeOptions}
                        </Picker>
                    </View>
                </View>
                <View style={styles.customerBorder}>
                    <View style={styles.customerContent}>
                        <Text style={styles.label}>Customer: </Text>
                        <TextInput
                            value={customer.customerName}
                            style={styles.input}
                            editable={false}
                            placeholder='Enter Customer Name'
                        />
                        <Text style={styles.label}>Invoice Number :</Text>
                        <TextInput
                            value={customer.invoiceNumber}
                            style={styles.input}
                            editable={false}
                            placeholder='Enter Invoice No'
                        />
                        <Text style={styles.label}>AMT :</Text>
                        <TextInput
                            value={customer.totalAmount}
                            style={styles.input}
                            editable={false}
                            placeholder='Enter Total Amount'
                        />
                        <View style={styles.customerBottom}>
                            <Text style={styles.qrLabel}>Update from Qr code?</Text>
                            <CustomButton title="Scan" onPress={() => navigation.navigate('Scanner')} />
                        </View>
                    </View>

                </View>
                <Text style={styles.label}>Remarks :</Text>
                <TextInput
                    style={styles.inputRemarks}
                    // editable={false}
                    placeholder='Enter Remarks'
                />
                {/* <Text style={styles.selectedValue}>Selected Value: {selectedValue}</Text> */}

                <Text style={styles.label}>Customer/Vendor Signature</Text>
                <View style={styles.signatureContainer}>
                    {/* signature  */}
                </View>
                <CustomSubmitButton title="Submit" />
            </View>
        </ScrollView>
    )
}
const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 10,
    },
    label: {
        color: "#ffa600",
        fontWeight: "bold",
        fontSize: 13,
        marginBottom: 2,
        marginTop: 3
    },
    input: {
        borderWidth: 0.9,
        borderColor: 'gray',
        paddingHorizontal: 10,
        paddingVertical: 5,
        fontSize: 18,
        borderRadius: 6,
        fontSize: 13,
        color: "black",
        fontWeight: "600"

    },
    picker: {
        backgroundColor: '#f7f7f7',
        paddingVertical: 10,
        paddingHorizontal: 16,
        fontSize: 16,
    },
    dropdown: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        overflow: 'hidden', // Clip any overflow content
    },
    customerBorder: {
        marginTop: 15,
        borderWidth: 1.5,
        borderRadius: 6,
        borderColor: "#ffa600",
        marginVertical: 10
    },
    customerContent: {
        marginHorizontal: 18,
        marginVertical: 10
    },
    buttonContent: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: 13,
        fontWeight: "700",
        textAlign: "center",
        fontFamily: "sans-serif-medium",
        letterSpacing: 0.7
    },
    buttonContainer: {
        height: 30,
        paddingHorizontal: 19,
        justifyContent: "center",
        backgroundColor: "#fac02e",
        borderRadius: 2,
    },
    submitButtonContainer: {
        height: 40,
        paddingHorizontal: 19,
        justifyContent: "center",
        backgroundColor: "#fac02e",
        borderRadius: 5,
        marginTop: 15,
        marginHorizontal: 10,
        alignItems: "center"
    },
    customerBottom: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 20
    },
    qrLabel: {
        color: "#ffa600",
        fontWeight: "bold",
        fontSize: 13,
        marginBottom: 2,
        marginVertical: 30
    },
    inputRemarks: {
        borderWidth: 0.9,
        borderColor: 'gray',
        paddingHorizontal: 10,
        paddingVertical: 30,
        fontSize: 18,
        borderRadius: 6,
        fontSize: 13,
    },
    signatureContainer: {
        borderWidth: 0.9,
        borderColor: 'gray',
        paddingHorizontal: 10,
        paddingVertical: 100,
        fontSize: 18,
        borderRadius: 6,
        fontSize: 13,
    }
})

export default NewCollection