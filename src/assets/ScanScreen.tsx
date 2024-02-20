import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import { NavigationContainer } from '@react-navigation/native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { openDatabase } from 'react-native-sqlite-storage';
import Snackbar from 'react-native-snackbar';
import Sound from 'react-native-sound'

const db = openDatabase({
  name: "stockopname_sqlite",
  location: 'default'
});

const successSound = new Sound('success.mp3', Sound.MAIN_BUNDLE, (error) => {
  if (error) {
    console.log('Failed to load the sound', error);
    return;
  }
});

export default function ScanScreen({ navigation, route }) {

  const [data, setData] = useState('Scan Something')
  const { selectedRadio,userId,devId } = route.params;

  const createTables = async () => {
    try {
      const database = await db;
      await database.transaction(txn => {
        txn.executeSql('CREATE TABLE IF NOT EXISTS stock (id INTEGER PRIMARY KEY AUTOINCREMENT, tanggal DATE, device_id VARCHAR(50), waktu TIME, User_id VARCHAR(50), item_id VARCHAR(20), quantity FLOAT)',
        [],
        (sqlTxn, res)=>{
          console.log("Table created successfully");
        },
        (error) => {
          console.error('Error creating table:', error);
        }
        );
      });
    } catch (error) {
      console.error('Error creating tables:', error);
    }
  };

  const insertItem = async (barcodeId) => {
    try {
      const currentDate = new Date().toISOString().split('T')[0];
      const currentTime = new Date().toLocaleTimeString();
      await db.transaction(async (txn) => {
        await txn.executeSql(
          `INSERT INTO stock (tanggal, device_id, waktu, User_id, item_id, quantity) VALUES (?, ?, ?, ?, ?, ?)`,
          [currentDate, devId, currentTime, userId, barcodeId, 1],
          (sqlTxn, res) => {
            if (res.rowsAffected > 0) {
              Snackbar.show({
                text: "Saved Successfully",
                duration: Snackbar.LENGTH_SHORT,
                textColor: 'black',
                backgroundColor: '#FFF'
              });
              successSound.play();
            } else {
              Alert.alert('Error', 'Failed to save');
            }
          },
          (error) => {
            console.error('Error inserting data:', error);
            Alert.alert('Error', 'Failed to save');
          }
        );
      });
    } catch (error) {
      console.error(`Error inserting data: ${error.message}`);
      Alert.alert('Error', 'Failed to save');
    }
  };

  const handleBarcodeScan = (scannedData) => {
    setData(scannedData);
    if (selectedRadio === 1) {
      insertItem(scannedData);
    }
    else if (selectedRadio === 2) {
      successSound.play();
      navigation.navigate('Add', { barcodeId: scannedData,userId:userId,devId:devId });
    }
  };

  return (
    <View style={styles.containeratas}>
      <View style={styles.containermini}>
        <Text style={styles.textBarcode}>Scan Barcode</Text>
        <View style={styles.button}>
          <TouchableOpacity style={styles.icon} onPress={() => navigation.goBack()}>
            <Entypo name="back" size={50} style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>
      <QRCodeScanner
        cameraStyle={{ width: 375, height: 30, marginLeft: 5, bottom: 20 }}
        onRead={({ data }) => handleBarcodeScan(data)}
        reactivate={true}
        reactivateTimeout={1000}
        showMarker={true}
      />
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
