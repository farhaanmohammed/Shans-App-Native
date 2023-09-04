import React, { useState, useEffect } from "react"
import { View, StyleSheet, Text, Image, StatusBar, FlatList } from "react-native";
import { FontAwesome } from '@expo/vector-icons';
import { FAB, ActivityIndicator } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import CustomButton from "../custombutton";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { baseUrl } from "../../api/const";
import HomeProductList from "./HomeProductList";


const productUrl = `${baseUrl}/viewProducts`;

export default function Home() {
    const numColumns = 2

    const [productNames, setProductNames] = useState([]);
    const [offset, setOffset] = useState(0);
    const [loadingMore, setLoadingMore] = useState(false); // Track loading state for loadMore


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

    console.log("offset:", offset)

    useEffect(() => {
        fetchProducts()
    }, [offset])



    const fetchProducts = () => {
        axios.get(`${productUrl}?offset=${offset}&limit=20`)
            .then((res) => {
                const productNamesArr = res.data.data.map((item) => ({
                    _id: item._id, // Add missing _id property
                    productName: item.product_name,
                    productCost: item.cost,
                    imageUrl: item.image_url,
                }));
                setProductNames((prevProductNames) => [...prevProductNames, ...productNamesArr]);
                setLoadingMore(false);
            })
            .catch(err => console.log(err));


    }

    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#ffa600" />

            <View style={styles.imageContainer} >
                <Image
                    source={require('../../../assets/shansHome.jpeg')}
                    fadeDuration={0}
                    style={{ width: 200, height: 50 }}
                />
                <FontAwesome name="bell-o" style={styles.bellIcon} />
            </View>

            <View style={styles.searchContainer}>
                <FontAwesome name="search" size={22} color="white" />
                <CustomButton title="What are you looking for ?" textcolor="#ffa600" onPress={() => navigation.navigate('OptionScreen')} />
                <AntDesign name="barcode" size={22} color="white" />
            </View>

            <View>
                <Text style={{ fontWeight: '500', textAlign: 'center', marginTop: 8, fontSize: 16, }}>Discount available for Bulk Purchase</Text>
            </View>

            <View>
                <Image source={require('../../../assets/huaweibanner.jpg')} style={{ width: 450, height: 200, resizeMode: "stretch" }} />
            </View>

            <View style={styles.button}>
                <View style={styles.buttonicon}>
                    <Image source={require('../../../assets/homeIcons/ic_dashboard_pickup.png')} style={{ width: 90, height: 50, resizeMode: "stretch" }} />
                    {/* <MaterialIcons name="directions-bike" size={28} color="black" /> */}
                    <CustomButton title="Pickup" color="#32c918" onPress={() => console.log('Button pressed')} />
                </View>

                <View style={styles.buttonicon}>
                    {/* <MaterialIcons name="design-services" size={28} color="black" /> */}
                    <Image source={require('../../../assets/homeIcons/ic_shan_service.png')} style={{ width: 90, height: 50, resizeMode: "stretch" }} />
                    <CustomButton title="Services" color="#fe0000" onPress={() => navigation.navigate('Jobscreen')} />
                </View>

                <View style={styles.buttonicon}>
                    {/* <MaterialIcons name="contact-page" size={28} color="black" /> */}

                    <Image source={require('../../../assets/homeIcons/ic_dashboard_contacts.png')} style={{ width: 90, height: 50, resizeMode: "stretch" }} />
                    <CustomButton title="Contacts" color="#3c7dff" onPress={() => navigation.navigate('Contactsviewnav')} />
                </View>
            </View>
            <View style={{ flex: 1 }}>
                <View style={styles.productListContainer}>
                    <FlatList
                        data={productNames}
                        keyExtractor={(item, index) => item._id + index.toString()}
                        renderItem={({ item }) => <HomeProductList item={item} />}
                        numColumns={numColumns}
                        ListFooterComponent={renderLoader}
                        onEndReached={loadMoreItem}
                        onEndReachedThreshold={0.1}
                    />
                </View>
            </View>

            <FAB
                style={styles.fab}
                icon={() => <MaterialIcons name="message" size={24} color="white" />}
                onPress={() => console.log('FAB pressed')}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },

    Text: {
        padding: 25,
    },

    shanstext: {
        fontSize: 20,
    },

    shans: {
        flexDirection: 'row',
        marginTop: 20,
        justifyContent: 'space-around',
        marginTop: 10,
    },

    fab: {
        position: 'absolute',
        left: 20,
        bottom: 100,
        backgroundColor: '#ffa600',
        borderRadius: 30,
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
    },

    searchContainer: {
        marginTop: 15,
        marginHorizontal: 15,
        flexDirection: 'row',
        borderWidth: 1,
        borderRadius: 15,
        padding: 5,
        justifyContent: 'space-evenly',
        backgroundColor: '#222222',
        alignItems: "center"
    },

    searchtext: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#eea40f',
    },

    buttonicon: {
        borderWidth: 0.5,
        borderColor: '#222222',
        paddingVertical: 15,
        paddingHorizontal: 5,
        borderRadius: 12,
        alignItems: 'center',
        marginHorizontal: 5
    },

    button: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 18,
    },
    imageContainer: {
        flexDirection: "row",
        marginTop: 10,
        alignItems: "center",
        marginHorizontal: 20,
        justifyContent: "space-between"
    },
    bellIcon: {
        fontSize: 24,
        color: "black",
    },
    productListContainer: {
        // alignSelf: "center",
        alignItems: "center"
    }
});