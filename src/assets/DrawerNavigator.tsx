import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-gesture-handler';
import Home from './Home';
import CustomDrawer from './CustomDrawer';
import ChangeId from './ChangeId';
import Authentication from './Authentication';
import AdminPage from './AdminPage';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator({route}) {
  const {userLevel,username} = route.params;

  // console.log(username);

  useEffect(() => {
    // console.log('User level received:', userLevel);
  }, [userLevel]);




  return (  
    <Drawer.Navigator drawerContent={(props) => <CustomDrawer {...props} userLevel={userLevel} username={username}/>}>
      <Drawer.Screen name="Home" component={Home} options={{ headerShown: false }}  initialParams={{ username: username }}/>
      <Drawer.Screen name="ChangeId" options={{ headerShown: false }} component={ChangeId} />
      <Drawer.Screen name="AdminPage" options={{ headerShown: false }} component={AdminPage} />
      <Drawer.Screen name="Authentication" options={{ headerShown: false }} component={Authentication} />
    </Drawer.Navigator>
  );
}
