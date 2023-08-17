import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { Picker } from "@react-native-community/picker";
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { baseUrl } from "../../api/const";
// import SignatureScreen from "react-native-signature-canvas";
import Sign from "../Sign/Sign";



// const collectionTypeDropdownUrl = `${baseUrl}/viewCollectionType/collection_type_list/collection_type_dropdown`//no need this drop down we can collect data in the invoice 
const collectionTypeUrl = `${baseUrl}/viewCollectionType?bussiness_type_id=`
const invoiceDetailsUrl = `${baseUrl}/viewInvoice?sequence_no=`
const vendorDetailsUrl = `${baseUrl}/viewVendorBill?sequence_no=`
const salesReturnUrl = `${baseUrl}/viewReturn?sequence_no=`
const purchaseReturnUrl = `${baseUrl}/viewReturn?sequence_no=`
const capitalPaymentUrl = `${baseUrl}/viewCapitalPayment?sequence_no=`
const capitalReceiptsUrl = `${baseUrl}/viewCapital?sequence_no=`
const createAuditingUrl = `${baseUrl}/createAuditing`


const CustomButton = ({ title, onPress }) => {

    return (
        <TouchableOpacity style={[styles.buttonContainer]} onPress={onPress}>
            <View style={styles.buttonContent}>
                <Text style={styles.buttonText}>{title}</Text>
            </View>
        </TouchableOpacity>
    );
};


// submit button

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
    console.log(route)
    const navigation = useNavigation()

    const [resData, setResData] = useState([])
    const [collectionType, setCollectionType] = useState('');
    // const [selectedCustomer, setSelectedCustomer] = useState('');
    const [adminDetails, setAdminDetails] = useState({});
    const [customer, setCustomer] = useState({});
    const [remarks, setRemarks] = useState('')
    const [customerDataAPI, setCustomerDataAPI] = useState({})
    // console.log(remarks)


    //fetch details from scanner compnent
    const scannedData = route.params?.scannedData; //sample output getting scanned data filtering which want to search in the sequence number sample getting output is "INV-39"
    const whichBill = route.params?.whichBill; //which bill means invoice or vendor or anything else // sample output gettinig is Invoice or Vendor bill
    const uploadUrl = route.params?.uploadUrl;

    console.log("scannedData----------", scannedData)
    console.log("whichBill----------", whichBill)
    console.log("uploadUrl----------", uploadUrl)



    useEffect(() => {
        fetchAdminDetails();
        // axios.get(collectionTypeDropdownUrl).then((response) => { //no need dropdown 
        //     console.log(response.data)
        //     setResData(response.data)
        // })
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
            if (whichBill == "Invoice") {

                const response = await axios.get(`${invoiceDetailsUrl}${scannedData}`);

                const customerData = response.data.data[0] // Assuming the response contains the customer details
                setCustomerDataAPI(customerData)
                if (customerData) {
                    const customerDetails = {
                        customerName: customerData.customer.customer_name,
                        invoiceNumber: customerData.sequence_no,
                        businessType: customerData.bussiness_type_id,
                        paymentMethod: customerData.register_payments[0].payment_method_id,
                        totalAmount: customerData.total_amount.toString()

                    }
                    console.log("customerDetails=====full =+++", customerDetails)
                    const collectionTypeResponse = await axios.get(`${collectionTypeUrl}${customerDetails.businessType}&payment_method_id=${customerDetails.paymentMethod}`);
                    //checking api format correct or not 
                    console.log(`${collectionTypeUrl}${customerDetails.businessType}&payment_method_id=${customerDetails.paymentMethod}`)
                    // const collectionTypeResponse = await axios.get(`http://137.184.67.138:3004/viewCollectionType?bussiness_type_id=${customerDetails.businessType}&payment_method_id=${customerDetails.paymentMethod}`);
                    const collectionResponseData = collectionTypeResponse.data.data[0];
                    setCollectionType(collectionResponseData)
                    setCustomer(customerDetails)


                }

                console.log("customerData", customerData);
            }
            if (whichBill == "Vendor Bill") {
                const response = await axios.get(`${vendorDetailsUrl}${scannedData}`);
                const customerData = response.data.data[0] // Assuming the response contains the customer details

                console.log("Vendor bill customoer data", customerData)

                if (customerData) {
                    const customerDetails = {
                        customerName: customerData.supplier.supplier_name,
                        invoiceNumber: customerData.sequence_no,
                        totalAmount: customerData.total_amount.toString(),
                        businessType: customerData.bussiness_type_id,
                        paymentMethod: customerData.register_payments[0].payment_method_id,
                    }
                    console.log("customerDetails======+++", customerDetails)
                    const collectionTypeResponse = await axios.get(`${collectionTypeUrl}${customerDetails.businessType}&payment_method_id=${customerDetails.paymentMethod}`);
                    //checking api format correct or not 
                    console.log(`${collectionTypeUrl}${customerDetails.businessType}&payment_method_id=${customerDetails.paymentMethod}`)
                    // const collectionTypeResponse = await axios.get(`http://137.184.67.138:3004/viewCollectionType?bussiness_type_id=${customerDetails.businessType}&payment_method_id=${customerDetails.paymentMethod}`);
                    const collectionResponseData = collectionTypeResponse.data.data[0];
                    setCollectionType(collectionResponseData)
                    setCustomer(customerDetails)
                }

                console.log("customerData", customerData);

            }

            if (whichBill == "SALRET") {
                const response = await axios.get(`${salesReturnUrl}${scannedData}`);
                const customerData = response.data.data[0] // Assuming the response contains the customer details

                console.log("Vendor bill customoer data", customerData)

                if (customerData) {
                    const customerDetails = {
                        customerName: customerData.customer.customer_name,
                        invoiceNumber: customerData.sequence_no,
                        totalAmount: customerData.total_amount.toString(),
                        // businessType: customerData.bussiness_type_id,
                        // paymentMethod: customerData.payment_method_id,
                    }
                    console.log("customerDetails======+++", customerDetails)
                    setCustomer(customerDetails)
                }

                console.log("customerData", customerData);
            }
            if (whichBill == "PURCHRET") {
                const response = await axios.get(`${purchaseReturnUrl}${scannedData}`);
                const customerData = response.data.data[0] // Assuming the response contains the customer details

                console.log("Vendor bill customoer data", customerData)

                if (customerData) {
                    const customerDetails = {
                        customerName: customerData.supplier.supplier_name,
                        invoiceNumber: customerData.sequence_no,
                        totalAmount: customerData.total_amount.toString(),
                        businessType: customerData.bussiness_type_id,
                        paymentMethod: customerData.payment_method_id,

                    }
                    console.log("customerDetails======+++", customerDetails)
                    setCustomer(customerDetails)
                }

                console.log("customerData", customerData);
            }

            if (whichBill == "CAPREC") {
                const response = await axios.get(`${capitalReceiptsUrl}${scannedData}`);
                const customerData = response.data.data[0] // Assuming the response contains the customer details

                console.log("Vendor bill customoer data", customerData)

                if (customerData) {
                    const customerDetails = {
                        customerName: customerData.sales_person.sales_person_name,
                        invoiceNumber: customerData.sequence_no,
                        totalAmount: customerData.amount.toString(),
                        businessType: customerData.bussiness_type_id,
                        paymentMethod: customerData.paid_through_chart_of_account_id,
                    }
                    console.log("customerDetails======+++", customerDetails)
                    const collectionTypeResponse = await axios.get(`${collectionTypeUrl}${customerDetails.businessType}&payment_method_id=${customerDetails.paymentMethod}`);
                    //checking api format correct or not 
                    console.log(`${collectionTypeUrl}${customerDetails.businessType}&payment_method_id=${customerDetails.paymentMethod}`)
                    // const collectionTypeResponse = await axios.get(`http://137.184.67.138:3004/viewCollectionType?bussiness_type_id=${customerDetails.businessType}&payment_method_id=${customerDetails.paymentMethod}`);
                    const collectionResponseData = collectionTypeResponse.data.data[0];
                    setCollectionType(collectionResponseData)
                    setCustomer(customerDetails)
                }

                console.log("customerData", customerData);
            }
            if (whichBill == "CAPPAY") {
                const response = await axios.get(`${capitalPaymentUrl}${scannedData}`);
                const customerData = response.data.data[0] // Assuming the response contains the customer details

                console.log("Vendor bill customoer data", customerData)

                if (customerData) {
                    const customerDetails = {
                        customerName: customerData.sales_person.sales_person_name,
                        invoiceNumber: customerData.sequence_no,
                        totalAmount: customerData.amount.toString(),
                        businessType: customerData.bussiness_type_id,
                        paymentMethod: customerData.paid_through_chart_of_account_id
                    }
                    console.log("customerDetails======+++", customerDetails)

                    const collectionTypeResponse = await axios.get(`${collectionTypeUrl}${customerDetails.businessType}&payment_method_id=${customerDetails.paymentMethod}`);
                    //checking api format correct or not 
                    console.log(`${collectionTypeUrl}${customerDetails.businessType}&payment_method_id=${customerDetails.paymentMethod}`)
                    // const collectionTypeResponse = await axios.get(`http://137.184.67.138:3004/viewCollectionType?bussiness_type_id=${customerDetails.businessType}&payment_method_id=${customerDetails.paymentMethod}`);
                    const collectionResponseData = collectionTypeResponse.data.data[0];
                    setCollectionType(collectionResponseData)
                    setCustomer(customerDetails)
                }
                console.log("customerData", customerData);
            }
            console.log(customer);
            // setCustomerName(customerData.customer_name);
        } catch (error) {
            console.error('Error fetching customer details:', error);
        }
    };
    console.log("collectionType: ", collectionType)

    //formation date
    function formatDate(date) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        return `${year}-${month}-${day}`;
    }

    const currentDate = new Date();
    const formattedDate = formatDate(currentDate);
    console.log(formattedDate);

    // const date = new Date().toDateString();
    // console.log(date)




    const handleSubmit = async () => {
        // const auditingDataToAPI = {

        //     "date": formattedDate,
        //     "amount": customer.totalAmount,
        //     "un_taxed_amount": 95,
        //     "signature": uploadUrl || null,
        //     "remarks": remarks,
        //     "attachments": [
        //         "hai"
        //     ],
        //     "warehouse_id": "646b263905b93160a102c0e3",
        //     "warehouse_name": adminDetails.warehouse?.warehouse_name,
        //     "sales_person_id": "646b263905b93160a102c0e3",
        //     "sales_person_name": adminDetails.related_profile?.name,
        //     "collection_type_id": "646b796fb2cff9b23ba2f07e",
        //     "collection_type_name": collectionType.collection_type_name,
        //     "company_id": "646b263905b93160a102c0e3",
        //     "company_name": adminDetails.company?.name,
        //     "customer_id": "646b263905b93160a102c0e3",
        //     "customer_name": customer.customerName,
        //     "invoice_id": "646b263905b93160a102c0e3",
        //     "inv_sequence_no": customer.invoiceNumber,
        //     "register_payment_id": "646b263905b93160a102c0e3",
        //     "register_payment_sequence_no": "rp_seq_1",
        //     "chq_no": "123",
        //     "chq_date": formattedDate,
        //     "chq_type": "test",
        //     "cheque_transaction_type": "test",
        //     "chart_of_accounts_id": "646b263905b93160a102c0e3",
        //     "chart_of_accounts_name": "test coa"

        // }


        const auditingDataToAPI = {

            "date": formattedDate,
            "amount": customer.totalAmount,
            "un_taxed_amount": customerDataAPI.untaxed_total_amount,
            "customer_vendor_signature": uploadUrl || null,
            "cashier_signature": "",
            "remarks": remarks,
            "attachments": [
                null
            ],
            "warehouse_id": adminDetails.warehouse_id,
            "warehouse_name": adminDetails.warehouse?.warehouse_name,
            "sales_person_id": customerDataAPI.sales_person_id || null,
            "sales_person_name": adminDetails.related_profile?.name,
            "supplier_id": "646b263905b93160a102c0e3",
            "supplier_name": "test sup",
            "collection_type_id": collectionType._id || null,
            "collection_type_name": collectionType.collection_type_name,
            "company_id": "646b263905b93160a102c0e3",
            "company_name": adminDetails.company?.name,
            "customer_id": adminDetails.company?.company_id,
            "customer_name": customer.customerName,
            "invoice_id": customerDataAPI.crm_product_lines[0].invoice_id,
            "inv_sequence_no": customer.invoiceNumber,
            "register_payment_id": customerDataAPI.register_payments[0]._id,
            "register_payment_sequence_no": "rp_seq_1",
            "chq_no": customerDataAPI.register_payments[0].chq_no,
            "chq_date": customerDataAPI.register_payments[0].chq_date,
            "chq_type": customerDataAPI.register_payments[0].chq_type,
            "cheque_transaction_type": "",
            "chart_of_accounts_id": "646b263905b93160a102c0e3",
            "chart_of_accounts_name": "",
            "ledger_name": null,
            "ledger_type": null,
            "ledger_id": "643e4799c0e7b0adaed6a8b3",
            "ledger_display_name": null,
            "employee_ledger_id": "643e4799c0e7b0adaed6a8b3",
            "employee_ledger_name": null,
            "employee_ledger_display_name": null,
            "service_amount": null,
            "service_product_amount": null

        }
        console.log("auditingDataToAPI: ", auditingDataToAPI)

        try {
            const response = await axios.post(createAuditingUrl, auditingDataToAPI);
            console.log(response.data);
            if (response.data.success === "true") {
                alert("Invoice Created Successfully");
                navigation.navigate("CashCollection")
            } else {
                alert("Invoice not Created");
            }
            // Handle the response data as needed
        } catch (error) {
            console.error('API error:', error);
            console.log('Error details:', error.response);
            console.log('Error details:', error.message);
            // Handle the error
        }
    }

    // collectiontype name
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
        <View style={styles.container}>
            <ScrollView style={styles.scrollContainer} >
                <>
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
                            <TextInput
                                value={collectionType.collection_type_name}
                                style={styles.input}
                                editable={false}
                                placeholder='Collection Type'
                            />
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
                        onChangeText={(text) => setRemarks(text)}
                    />
                </>
                {/* <Text style={styles.selectedValue}>Selected Value: {selectedValue}</Text> */}

            </ScrollView>
            <Text style={styles.label}>Customer/Vendor Signature</Text>
            {/* <CustomButton title="sign" onPress={() => navigation.navigate('Sign')} />  */}
            <View style={styles.signatureContainer}>
                <Sign />
            </View>
            <CustomSubmitButton title="Submit" onPress={handleSubmit} />
        </View>

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
        borderWidth: 1,
        borderColor: '#000',
        width: '100%',
        height: 200,
        marginBottom: 20,

    },
    scrollContainer: {
        flex: 1,
    }
})


export default NewCollection