import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar';
import { widthPercentageToDP as wp, heightPercentageToDP as hp, heightPercentageToDP } from 'react-native-responsive-screen';
import tw from 'twrnc'
import { ChevronLeftIcon, ClockIcon, FireIcon, Square3Stack3DIcon, UsersIcon } from 'react-native-heroicons/outline';
import { HeartIcon } from 'react-native-heroicons/solid';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import Loading from '../components/loading';
import YoutubeIframe, { getYoutubeMeta } from 'react-native-youtube-iframe';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DetailScreen(props) {

    let item = props.route.params;

    const [isFavourite, setIsFavourite] = useState(false);
    const navigation = useNavigation();
    const [meal, setMeal] = useState(null);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getMealData(item.idMeal);
    }, [])

    const getMealData = async (id) => {
        try {   
            const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
            // console.log('got recipes: ', response.data);
            if (response && response.data) {
                setMeal(response.data.meals[0]);
                setLoading(false);
            }
        } catch(err) {
            console.log('error: ', err.message);
        }
    }

    const ingredientsindexes = (meal) => {
        if(!meal) return [];
        let indexes = []
        for(let i = 1; i <= 20; i++) {
            if(meal['strIngredient'+i]) {
                indexes.push(i);

            }
        }

        return indexes;
    }

    const getYoutubeVideoId = url => {
        const regex = /[?&]v=([^&]+)/;
        const match = url.match(regex);
        if (match && match[1]) {
            return match[1];
        }
        return null;
    }

    useEffect(() => {
        const loadFavouriteStatus = async () => {
            try {
                const savedStatus = await AsyncStorage.getItem('isFavourite');
                if (savedStatus !== null) {
                    // Jika status ada di AsyncStorage, set statusnya
                    setIsFavourite(JSON.parse(savedStatus));
                }
            } catch (error) {
                console.error("Error loading favourite status", error);
            }
        };
        
        loadFavouriteStatus();
    }, []); // Empty dependency array, hanya dijalankan sekali saat komponen dimuat

    // Fungsi untuk toggle status favorit dan menyimpannya ke AsyncStorage
    const toggleFavourite = async () => {
        try {
            const newStatus = !isFavourite; // Mengubah status favorit
            setIsFavourite(newStatus); // Update state
            await AsyncStorage.setItem('isFavourite', JSON.stringify(newStatus)); // Simpan ke AsyncStorage
        } catch (error) {
            console.error("Error saving favourite status", error);
        }
    };

    return (
        <ScrollView
            style={tw`bg-white flex-1`}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: 30}}
        >
            <StatusBar style='light' />

            {/* recipe image */}
            <View style={tw`flex-row justify-center`}>
                <Image 
                    source={{uri: item.strMealThumb}}
                    style={{width: wp(98), height: hp(50), borderRadius: 53, borderBottomLeftRadius: 40, borderBottomRightRadius: 40, marginTop: 4}}
                    sharedTransitionTag={item.strMeal}
                />
            </View>

            {/* back button */}
            <View style={tw`w-full absolute flex-row justify-between items-center pt-14`}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={tw`p-2 rounded-full ml-5 bg-white`}>
                    <ChevronLeftIcon size={hp(3.5)} strokeWidth={4.5} color="#fbbf24" />
                </TouchableOpacity>
                <TouchableOpacity
                onPress={toggleFavourite}
                style={tw`p-2 rounded-full mr-5 bg-white`}
            >
                <HeartIcon
                    size={hp(3.5)}
                    strokeWidth={4.5}
                    color={isFavourite ? "red" : "gray"} // Warna berubah berdasarkan status
                />
            </TouchableOpacity>
            </View>

            {/* meal description */}
            {
                loading? (
                    <Loading size="large" style={tw`mt-16`} />
                ):(
                    <View style={tw`px-4 flex justify-between pt-8`}>
                        {/* name and area */}
                        <View style={tw`mb-6`}>
                            <Text style={[tw`mb-2 font-bold flex-1 text-neutral-700`, {fontSize: hp(3)}]}>
                                {meal?.strMeal}
                            </Text>
                            <Text style={[tw`font-medium flex-1 text-neutral-500`, {fontSize: hp(2)}]}>
                                {meal?.strArea}
                            </Text>
                        </View>

                        {/* misc */}
                        <View style={tw`mb-6 flex-row justify-around`}>
                            <View style={tw`flex rounded-full bg-amber-300 p-2`}>
                                <View style={[tw`bg-white rounded-full flex items-center justify-center`, {height: hp(6.5), width: hp(6.5)}]}>
                                    <ClockIcon size={hp(4)} strokeWidth={2.5} color="#525252" />
                                </View>
                                <View style={tw`flex items-center py-2`}>
                                    <Text style={[tw`font-bold text-neutral-700`, {fontSize: hp(2)}]}>
                                        35
                                    </Text>
                                    <Text style={[tw`font-bold text-neutral-700`, {fontSize: hp(1.3)}]}>
                                        Mins
                                    </Text>
                                </View>
                            </View>
                            <View style={tw`flex rounded-full bg-amber-300 p-2`}>
                                <View style={[tw`bg-white rounded-full flex items-center justify-center`, {height: hp(6.5), width: hp(6.5)}]}>
                                    <UsersIcon size={hp(4)} strokeWidth={2.5} color="#525252" />
                                </View>
                                <View style={tw`flex items-center py-2`}>
                                    <Text style={[tw`font-bold text-neutral-700`, {fontSize: hp(2)}]}>
                                        03
                                    </Text>
                                    <Text style={[tw`font-bold text-neutral-700`, {fontSize: hp(1.3)}]}>
                                        Servings
                                    </Text>
                                </View>
                            </View>
                            <View style={tw`flex rounded-full bg-amber-300 p-2`}>
                                <View style={[tw`bg-white rounded-full flex items-center justify-center`, {height: hp(6.5), width: hp(6.5)}]}>
                                    <FireIcon size={hp(4)} strokeWidth={2.5} color="#525252" />
                                </View>
                                <View style={tw`flex items-center py-2`}>
                                    <Text style={[tw`font-bold text-neutral-700`, {fontSize: hp(2)}]}>
                                        103
                                    </Text>
                                    <Text style={[tw`font-bold text-neutral-700`, {fontSize: hp(1.3)}]}>
                                        Cal
                                    </Text>
                                </View>
                            </View>
                            <View style={tw`flex rounded-full bg-amber-300 p-2`}>
                                <View style={[tw`bg-white rounded-full flex items-center justify-center`, {height: hp(6.5), width: hp(6.5)}]}>
                                    <Square3Stack3DIcon size={hp(4)} strokeWidth={2.5} color="#525252" />
                                </View>
                                <View style={tw`flex items-center py-2`}>
                                    <Text style={[tw`font-bold text-neutral-700`, {fontSize: hp(2)}]}>
                                        
                                    </Text>
                                    <Text style={[tw`font-bold text-neutral-700`, {fontSize: hp(1.3)}]}>
                                        Easy
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* ingredients */}
                        <View style={tw`mb-6`}>
                            <Text style={[tw`font-bold flex-1 text-neutral-700`, {fontSize: hp(2.5)}]}>
                                Ingredients
                            </Text>
                            <View style={tw`mt-2 ml-3`}>
                                {
                                    ingredientsindexes(meal).map(i => {
                                        return (
                                            <View key={i} style={tw`flex-row mt-1 mb-1 items-center gap-4`}>
                                                <View style={[tw`bg-amber-300 rounded-full`, {height: hp(1.5), width: hp(1.5)}]} /> 
                                                <View style={tw`flex-row items-center gap-1`}>
                                                    <Text style={[tw`font-extrabold text-neutral-700`, {fontSize: hp(1.7)}]}>{meal['strMeasure'+i]}</Text>
                                                    <Text style={[tw`font-medium text-neutral-600`, {fontSize: hp(1.7)}]}>{meal['strIngredient'+i]}</Text>
                                                </View>
                                            </View>
                                        )
                                    })
                                }
                            </View>
                        </View>


                        {/* instruction */}
                        <View style={tw`mb-6`}>
                            <Text style={[tw`mb-4 font-bold flex-1 text-neutral-700`, {fontSize: hp(2.5)}]}>
                                Instruction
                            </Text>
                            <Text style={[tw`text-neutral-700`, {fontSize: hp(1.6)}]}>
                                {
                                    meal?.strInstructions
                                }
                            </Text>
                        </View>

                        {/* recipe video */}
                        {
                            meal.strYoutube && (
                                <View style={tw`mb-6`}>
                                    <Text style={[tw`font-bold flex-1 text-neutral-700 mb-4`, {fontSize: hp(2.5)}]}>
                                        Recipe Video
                                    </Text>
                                    <View>
                                        <YoutubeIframe
                                            videoId={getYoutubeVideoId(meal.strYoutube)}
                                            height={hp(30)}
                                        />
                                    </View> 
                                </View>
                            )
                        }
                        
                    </View>
                )
            }
        </ScrollView>
    )
}