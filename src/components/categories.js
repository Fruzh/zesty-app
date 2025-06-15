import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import React from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { categoryData } from '../contants';
import tw from 'twrnc';
import { CachedImage } from '../helpers/image';

export default function Categories({ categories, activeCategory, handleChangeCategory }) {
    return (

        <Animated.View entering={FadeInDown.duration(500).springify()}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={[tw`flex-row items-center px-4`, {paddingHorizontal: 15}]}
            >
                {categories.map((cat, index) => {
                    const isActive = cat.strCategory === activeCategory;
                    return (
                        <TouchableOpacity
                            key={index}
                            onPress={() => handleChangeCategory(cat.strCategory)}
                            style={[tw`items-center`, { marginRight: wp(4), marginBottom: hp(2) }]}
                        >
                            <View
                                style={tw.style(
                                    'rounded-full p-[6px]',
                                    isActive ? 'bg-amber-400' : 'bg-black/10'
                                )}
                            >
                                <Image
                                    source={{ uri: cat.strCategoryThumb }}
                                    style={[tw`rounded-full`, { width: hp(6), height: hp(6) }]}
                                />
                                {/* <CachedImage 
                                    uri={cat.strCategoryThumb}
                                    style={[tw`rounded-full`, { width: hp(6), height: hp(6) }]}
                                /> */}
                            </View>
                            <Text style={[tw`text-neutral-600`, { fontSize: hp(1.6) }]}>
                                {cat.strCategory}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </Animated.View>
    );
}
