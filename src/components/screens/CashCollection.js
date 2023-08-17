import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { baseUrl } from '../../api/const';

const listAuditingUrl = `${baseUrl}/viewAuditing`;

const CashCollection = () => {
    const [auditingList, setAuditingList] = useState([]);

    useEffect(() => {
        axios.get(listAuditingUrl)
            .then((res) => {
                console.log(res.data.data);
                const customerDetails = res.data.data.map((item) => ({
                    id: item._id,
                    sequenceNum: item.sequence_no,
                    date: item.date,
                    customerName: item.customer_name,
                    totalAmount: item.amount,
                }));
                setAuditingList(customerDetails);
            })
            .catch((error) => {
                console.error("Error fetching invoice:", error);
            });
    }, []);

    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            {auditingList.length === 0 ? (
                <Text style={styles.notFoundText}>No Collections found</Text>
            ) : (
                auditingList.map((data, index) => (
                    <View style={styles.detailsContainer} key={data.id}>
                        <Text>{data.customerName}</Text>
                        <Text>{data.date}</Text>
                        <Text>{data.totalAmount}</Text>
                    </View>
                ))
            )}
            <TouchableOpacity
                onPress={() => navigation.navigate('NewCollection')}
                style={styles.fab}
            >
                <Text style={styles.fabIcon}>+</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 20,
        marginVertical: 20,
    },
    fab: {
        position: 'absolute',
        width: 56,
        height: 56,
        alignItems: 'center',
        justifyContent: 'center',
        right: 20,
        bottom: 20,
        backgroundColor: '#07d7c7',
        borderRadius: 30,
        elevation: 8,
    },
    fabIcon: {
        fontSize: 40,
        color: 'white',
    },
    detailsContainer: {
        borderWidth: 1.5,
        borderRadius: 20,
        marginVertical: 1,
    },
    notFoundText: {
        textAlign: "center",
        fontSize: 30,
        color: "black"
    }
});

export default CashCollection;
