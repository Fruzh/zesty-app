import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AppNavigation from './src/navigation/navigation.js';
import 'react-native-gesture-handler';
import 'react-native-reanimated';


import tw from "twrnc";

export default function App() {
  return (
    <AppNavigation />
  );
}