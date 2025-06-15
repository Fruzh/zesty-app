import { View, Text, ScrollView, TextInput, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { BellIcon, MagnifyingGlassIcon, HeartIcon } from 'react-native-heroicons/outline'
import Categories from '../components/categories';
import axios from 'axios';
import Recipes from '../components/recipes';

import tw from 'twrnc'

export default function HomeScreen() {
    const [activeCategory, setActiveCategory] = useState('Beef');
    const [categories, setCategories] = useState([]);  
    const [meals, setMeals] = useState([]); 

    const [searchQuery, setSearchQuery] = useState(''); 

    useEffect(() => {
        getCategories();
        getRecipes();
    }, [])

    const handleChangeCategory = category => {
        setSearchQuery(''); 
        getRecipes(category);
        setActiveCategory(category);
        setMeals([]);  
    }

    const getCategories = async () => {
        try {   
            const response = await axios.get('https://www.themealdb.com/api/json/v1/1/categories.php');
            if (response && response.data && response.data.categories) {
                setCategories(response.data.categories);
            }
        } catch(err) {
            console.log('error: ', err.message);
        }
    }

    const getRecipes = async (category = "Beef", query = "") => {
        try {   
            let url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`;
            if (query) {
                url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`;
            }
            const response = await axios.get(url);
            if (response && response.data && response.data.meals) {
                setMeals(response.data.meals);
            }
        } catch(err) {
            console.log('error: ', err.message);
        }
    }

    const handleSearch = (query) => {
        setSearchQuery(query);
        getRecipes(activeCategory, query);
    };4

    return (
        <View style={tw`flex-1 bg-white`}>
            <StatusBar style='dark' />
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 50 }}
                style={tw`pt-14`}
            >
                {/* avatar and bell icon */}
                <View style={tw`mx-4 flex-row justify-between items-center mb-2`}>
                    <Image source={require('../../assets/logo.png')}
                        style={{ height: hp(5), width: hp(7.8) }} />
                    <BellIcon size={hp(4)} color="gray" />
                </View>

                {/* greetings and punchline */}
                <View style={tw`mx-4 mt-4 mb-2`}>
                    <Text style={[tw`text-neutral-600`, { fontSize: hp(1.7) }]}>Hello, There!</Text>
                    <View style={tw`mt-4`}>
                        <Text style={[tw`font-semibold text-neutral-600`, { fontSize: hp(3.8) }]}>Make your own food</Text>
                    </View>
                    <Text style={[tw`font-semibold text-neutral-600 mb-2`, { fontSize: hp(3.8) }]}>
                        stay at <Text style={tw`text-amber-400`}>home</Text>
                    </Text>
                </View>

                {/* search bar */}
                <View style={tw`mx-4 mt-4 mb-2 flex-row items-center rounded-full bg-black/5 p-[6px]`}>
                    <TextInput
                        placeholder='Search any recipe'
                        placeholderTextColor={'gray'}
                        value={searchQuery}
                        onChangeText={(text) => handleSearch(text)}
                        style={[tw`flex-1 text-base mb-1 pl-3 tracking-wider`,
                        { fontSize: hp(1.7) }]}
                    />
                    <View style={tw`bg-white rounded-full p-3`}>
                        <MagnifyingGlassIcon size={hp(2.5)} strokeWidth={3} color="gray" />
                    </View>
                </View>

                {/* categories */}
                <View style={tw`mt-4`}>
                    {categories && categories.length > 0 && (
                        <Categories 
                            categories={categories} 
                            activeCategory={activeCategory} 
                            handleChangeCategory={handleChangeCategory} 
                        />
                    )}
                </View>

                {/* recipes */}
                <View>
                    {meals && meals.length > 0 && (
                        <Recipes meals={meals} categories={categories} />
                    )}
                </View>
            </ScrollView>
        </View>
    )
}
