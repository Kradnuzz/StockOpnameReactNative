import React from 'react';
import { View, Text } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import 'react-native-gesture-handler';
import Home from './Home';
import CustomDrawer from './CustomDrawer';
import ChangeId from './ChangeId';
import Admin from './Admin';
import Authentication from './Authentication';



const Drawer = createDrawerNavigator();


export default function DrawerNavigator() {
  return (
    <Drawer.Navigator drawerContent={(props) => <CustomDrawer {...props}/>}>
      <Drawer.Screen name="Home" component={Home} options={{ headerShown: false }} />
      <Drawer.Screen name="ChangeId" options={{ headerShown: false }} component={ChangeId}/>
      <Drawer.Screen name="Admin" options={{ headerShown: false }} component={Admin}/>
      <Drawer.Screen name="Authentication" options={{ headerShown: false }} component={Authentication}/>
    </Drawer.Navigator>
  );
}
