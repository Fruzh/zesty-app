import { View, Text, ActivityIndicator } from 'react-native'
import React from 'react'

import tw from 'twrnc'

export default function Loading(props) {
    return (
        <View style={tw`flex-1 flex justify-center items-center`}>
            <ActivityIndicator {...props} />
        </View>
    )
}