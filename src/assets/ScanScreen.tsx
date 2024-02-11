import React, { useState } from 'react';
import { View, Text, StyleSheet,TouchableOpacity } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import { NavigationContainer } from '@react-navigation/native';
import QRCodeScanner from 'react-native-qrcode-scanner';


export default function ScanScreen({navigation,route}) {

  const [data,setData] = useState('Scan Something')

  const handleBarcodeScan = (ScannedData) => {
    setData(ScannedData);
    navigation.navigate('Add', { barcodeId: ScannedData });
  };

  return (
    <View style={styles.containeratas}>
     <View style={styles.containermini}>
     <Text style={styles.textBarcode}>Scan Barcode</Text>
        <View style={styles.button}>
          <TouchableOpacity style={styles.icon} onPress={()=>navigation.goBack()}>
            <Entypo name="back" size={50} style={styles.icon} />
          </TouchableOpacity>
        </View>
    </View>
    <QRCodeScanner
      cameraStyle={{ width:375,height:30 ,marginLeft:5,bottom:20}} 
      onRead={({data}) => handleBarcodeScan(data)}
      reactivate={true}
      reactivateTimeout={0}
      showMarker={true}
      />
      {/* <Text>{data}</Text> */}
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
      height: '9%',
      width: '100%',
      borderRadius: 4
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
   
  });
  