import React, { useState,useEffect } from 'react';
import { View, Text, StyleSheet,TouchableOpacity,TextInput,Alert } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import { NavigationContainer } from '@react-navigation/native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function ChangeId({navigation}) {

  const [deviceId, setDeviceId] = useState('');

  useEffect(() => {
    loadDeviceId();
  }, []);


  const loadDeviceId = async () => {
    try {
      const savedDeviceId = await AsyncStorage.getItem('deviceId');
      if (savedDeviceId !== null) {
        setDeviceId(savedDeviceId);
      }
    } catch (error) {
      console.error('Error loading device ID:', error);
    }
  };

  const handleSaveDeviceId = async () => {
    try {
      if (!deviceId) {
        Alert.alert('Device ID cannot be empty!');
        return;
      }
      await AsyncStorage.setItem('deviceId', deviceId);
      Alert.alert('Device ID saved successfully!');
    } catch (error) {
      console.error('Error saving device ID:', error);
      Alert.alert('Failed to save device ID. Please try again.');
    }
  };

  return (
    <View style={styles.containeratas}>
     <View style={styles.containermini}>
     <Text style={styles.textBarcode}>Change Device Id</Text>
        <View style={styles.button}>
          <TouchableOpacity style={styles.icon} onPress={()=>navigation.goBack()}>
            <Entypo name="back" size={50} style={styles.icon} />
          </TouchableOpacity>
        </View>
    </View>
    <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter Device ID"
          value={deviceId}
          onChangeText={setDeviceId}
        />
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveDeviceId}>
          <Text style={styles.saveButtonText}>Save Device ID</Text>
        </TouchableOpacity>
      </View>
  </View>
  );

}
const styles = StyleSheet.create({
    containeratas: {
      flex: 1,
      backgroundColor: '#192a56',
    },
    containermini: {
      backgroundColor: '#273c75',
      height: '10%',
      width: '100%',
      borderRadius: 4,
    },
    textBarcode: {
        fontSize: 30,
        fontFamily: 'Roboto',
        color: '#FFF',
        marginTop: 8,
        marginLeft: 35,
        fontWeight: "bold",
        textAlign: 'center',
      },
      button: {
        height: 45,
        width: 45,
        marginTop: -45,
        marginLeft: 10
      },
      icon: {
        height: 50,
        width: 50,
        marginBottom: 300,
        color: '#FFF',
      },
      inputContainer: {
        marginVertical:'10%',
        justifyContent: 'center',
        alignItems: 'center',
      },
      input: {
        width: '80%',
        height: 40,
        marginBottom: 20,
        paddingHorizontal: 10,
        backgroundColor: 'black',
        borderRadius: 5,
        borderColor:'white',
        borderWidth:1,
      },
      saveButton: {
        backgroundColor: '#3498db',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
      },
      saveButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
      },
   
  });
  