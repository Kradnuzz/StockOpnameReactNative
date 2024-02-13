import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Home from './src/assets/Home'
import {NavigationContainer} from "@react-navigation/native"
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Add from './src/assets/Add'
import ViewItems from './src/assets/ViewItems'
import ExportItems from './src/assets/ExportItems'
import ScanScreen from './src/assets/ScanScreen'
import Tes from './src/assets/Tes'
import LoginScreen from './src/assets/LoginScreen'
import { Drawer } from 'react-native-paper'
import { createDrawerNavigator } from '@react-navigation/drawer'
import DrawerNavigator from './src/assets/DrawerNavigator'
import 'react-native-gesture-handler';
import Admin from './src/assets/AdminPage'



const Stack = createNativeStackNavigator();
const Menu = createDrawerNavigator();


export default function App() {

  return (
    <NavigationContainer>
       <Stack.Navigator initialRouteName="LoginScreen">
        <Stack.Screen name="LoginScreen" options={{ headerShown:false }} component={LoginScreen}/>
        <Stack.Screen name="DrawerNavigator"options={{ headerShown:false }} component={DrawerNavigator} />
        <Stack.Screen name="Add"options={{ headerShown:false }} component={Add} />
        <Stack.Screen name="ViewItems"options={{ headerShown:false }} component={ViewItems} />
        <Stack.Screen name="ExportItems"options={{ headerShown:false }} component={ExportItems} />
        <Stack.Screen name="ScanScreen"options={{ headerShown:false }} component={ScanScreen} />
    </Stack.Navigator>
    </NavigationContainer>

    // <Tes/>

  )
}

const styles = StyleSheet.create({})