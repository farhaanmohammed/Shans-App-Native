import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, StatusBar, FlatList } from "react-native";
import { Searchbar } from "react-native-paper";
import { FAB ,ActivityIndicator} from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import axios from "axios";
import ContactItem from "../contactitem";
import { baseUrl } from "../../api/const";


export default function Contacts({ navigation }) {
    const { fab } = styles;

    const contacturl = `${baseUrl}/viewCustomers`;
    const searchurl = `${contacturl}?name=`;

    const [names, setNames] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredNames, setFilteredNames] = useState([]);
    const [offset, setOffset] = useState(0);
    const [loadingMore, setLoadingMore] = useState(false);

    const renderLoader = () => {
        return (
            <View style={styles.loaderStyle}>
                <ActivityIndicator size="large" color="#ffa600" />
            </View>
        );
    };

    const loadMoreItem = () => {
        console.log("y first u load : ", loadingMore)
        if (loadingMore) return; // Prevent multiple calls while loading
        setLoadingMore(true);
        setOffset(offset + 1);
    };

    useEffect(() => {
        axios.get(`${contacturl}?offset=${offset}&limit=20`)
        .then((res) => {
            const namesArray = res.data.data.map((item) => ({
            name: item.name,
            customer_mobile: item.customer_mobile,
            _id: item._id,
            // warehouse_id: item.warehouse_id,
            // warehouse_name:item.warehouse_name,
            language_id:item.language_id,
            country_id:item.country_id,
            currency_id:item.currency_id,
            // pipelines_id:item.pipelines._id,
            trn_no:item.trn_no,
            state_id:item.state_id,
            pipeline_id:item.pipelines,
            address:item.address,
            customer_credit_ledger:item.customer_credit_ledger,
            image_url:item.image_url,

            



            }));
            setNames(namesArray);
            setFilteredNames(namesArray);
        })
        .catch(err => console.log(err));

    }, [offset]);

    useEffect(() => {
        
        if (searchQuery !== "") {
        axios.get(searchurl + searchQuery)
            .then((res) => {
            const filteredResults = res.data.data.map((item) => ({
                name: item.name,
                customer_mobile: item.customer_mobile,
                _id: item._id,
                
            }));
            setFilteredNames(filteredResults);
            })
            .catch(err => console.log(err));
        } else {
        setFilteredNames(names);
        }
    }, [searchQuery, names]);

    const onChangeSearch = (query) => {
        setSearchQuery(query);
    };

    // console.log(names)
    console.log("ofset",offset);

    return (
        <View style={styles.container}>
        <StatusBar backgroundColor={"#ffa600"} />

        <Searchbar
            placeholder="Search contacts"
            onChangeText={onChangeSearch}
            value={searchQuery}
            style={{
            borderRadius: 0,
            borderWidth: 12,
            borderColor: '#ffa600',
            backgroundColor:"white",
            
            }}
        />
        <View style={styles.contactscroll}>
            <FlatList
                data={filteredNames}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => <ContactItem item={item} />}
                onEndReached={loadMoreItem}
                onEndReachedThreshold={0.1}
                ListFooterComponent={renderLoader}
            />

        </View>
        

        <FAB
            style={styles.fab}
            icon={() => <MaterialIcons name="contact-page" size={24} color="white" />}
            onPress={() => navigation.navigate('addcontacts')}
        />

        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        flex:1,
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

    contactscroll:{
        flex:1,
    },
});
