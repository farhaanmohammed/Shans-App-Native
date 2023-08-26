import React, { useEffect, useState } from "react";
import { StyleSheet, View, TouchableWithoutFeedback, Text, FlatList } from "react-native";
import { Searchbar } from "react-native-paper";
import axios from "axios";
import { AntDesign } from "@expo/vector-icons"
import { useNavigation, useRoute } from "@react-navigation/native";
import { baseUrl } from "../../api/const";
import CategoriesList from "../categoriesList";

const CustomButton = ({ title, onPress }) => {
    return (
        <TouchableWithoutFeedback onPress={onPress}>
            <View style={styles.buttonContainer}>
                <View style={styles.buttonContent}>
                    <AntDesign name="left" size={20} color="black" />
                    <Text style={styles.buttonText}>{title}</Text>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};

const searchUrl = `${baseUrl}/viewCategories?category_name=`;

const CategoriesScreen = () => {
    const route = useRoute()

    const contact = route.params?.contact // without ? getting errors 
    // const{ contact }=route.params;


    const numColumns = 2;
    const navigation = useNavigation();

    const productCategoriesUrl = `${baseUrl}/viewCategories`;

    const [categoryNames, setCategoriesNames] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredCategories, setfilteredCategories] = useState([]);

    // console.log("passed items",contact);

    useEffect(() => {
        axios.get(productCategoriesUrl)
            .then((res) => {
                const categoryNameArr = res.data.data.map((item) => ({
                    _id: item._id, 
                    categoryName: item.category_name,
                    imageUrl: item.image_url,
                    landingCost: item.landing_cost
                }));
                setCategoriesNames(categoryNameArr);
                setfilteredCategories(categoryNameArr);
            })
            .catch(err => console.log(err));
    }, []);

    useEffect(() => {
        if (searchQuery !== "") {
            axios.get(searchUrl + searchQuery)
                .then((res) => {
                    const filteredSearchResults = res.data.data.map((item) => ({
                        _id: item._id,
                        categoryName: item.category_name,
                        landingCost: item.landing_cost
                    }));
                    setfilteredCategories(filteredSearchResults);
                })
                .catch(err => console.log(err));
        } else {
            setfilteredCategories(categoryNames);
        }
    }, [searchQuery, categoryNames]);


    //on chaging search test

    const onChangeSearch = (query) => {
        setSearchQuery(query);
    };

    return (
        <View style={styles.container}>

            <View>
                <CustomButton title="Categories" onPress={() => navigation.goBack()} />
            </View>

            <View style={styles.searchContainer}>
                <Searchbar
                    placeholder="Search Categories"
                    value={searchQuery}
                    onChangeText={onChangeSearch}
                    style={styles.searchBox}
                />
            </View>
            <View style={styles.productListContainer}>
                <FlatList
                    data={filteredCategories}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => <CategoriesList item={item} contact={contact} />}
                    numColumns={numColumns}
                />
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    searchBox: {
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#ffa600',
        backgroundColor: "white",
        marginBottom: 10,
    },
    buttonContainer: {
        backgroundColor: "#ffa600",
    },
    buttonContent: {
        flexDirection: "row",
        marginLeft: 10,
        marginBottom: 12,
        alignItems: "center"
    },

    buttonText: {
        marginLeft: 34,
        fontSize: 17,
        color: "white"
    },
    searchContainer: {
        backgroundColor: "#ffa600",
        paddingHorizontal: 10,
    },
    productListContainer: {

        alignItems: "center",
        flex: 1,
    }

});

export default CategoriesScreen;
