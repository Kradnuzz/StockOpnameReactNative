import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CheckBox } from 'react-native-elements';
import { openDatabase } from 'react-native-sqlite-storage';
import axios from 'axios';


const db = openDatabase({
  name: "stockopname_sqlite",
  location: "default"
});


export default function ExportItems({ navigation }) {
  const [serverIp, setServerIp] = useState('');
  const [deleteAllBarcode, setDeleteAllBarcode] = useState(false);

  useEffect(() => {
        loadServerIp();
  }, []);

  const loadServerIp = async () => {
    try {
      const savedServerIp = await AsyncStorage.getItem('serverIp');
      if (savedServerIp !== null) {
        setServerIp(savedServerIp);
      }
    } catch (error) {
      console.error('Error loading server IP:', error);
    }
  };

  const handleSave = async () => {
    try {
      await AsyncStorage.setItem('serverIp', serverIp);
      alert('Server IP saved successfully!');
    } catch (error) {
      console.error('Error saving server IP:', error);
      alert('Failed to save server IP.');
    }
  };

  const deleteAllItems = async () => {
    try {
      const database = await db;
      await database.transaction(async (txn) => {
        await txn.executeSql(
          'DELETE FROM stock',
          [],
          (sqlTxn, result) => {
            if (result.rowsAffected > 0) {
              Alert.alert('Success', 'All items deleted successfully');
            } else {
              Alert.alert('Error', 'Failed to delete items');
            }
          },
          (error) => {
            console.error('Error deleting items:', error);
            Alert.alert('Error', 'Failed to delete items');
          }
        );
      });
    } catch (error) {
      console.error('Error deleting items:', error);
      Alert.alert('Error', 'Failed to delete items');
    }
  };

  const handleSend = async () => {
    try {
      const database = await db;
      database.transaction(async (txn) => {
        txn.executeSql(
          'SELECT * FROM stock',
          [],
          async (tx, results) => {
            const len = results.rows.length;
            const items = [];
            for (let i = 0; i < len; i++) {
              const row = results.rows.item(i);
              const item = { ...row, barcode: row.item_id };
              delete item.item_id;
              items.push(item);
            }
            await sendItemsToBackend(items);
            if (deleteAllBarcode) {
              console.log('Deleting all barcodes...');
              await deleteAllItems(); // Call deleteAllItems function here
            }
          },
          (error) => {
            console.error('Error executing SQL query:', error);
            alert('Failed to fetch items from database.');
          }
        );
      });
    } catch (error) {
      console.error('Error accessing database:', error);
      alert('Failed to access database.');
    }
  };


  const sendItemsToBackend = async (items) => {
    try {
      const response = await axios.post(`http://${serverIp}:8080/stocksget`, items);
      console.log('Response from backend:', response.data);
      alert('Items sent successfully!');
    } catch (error) {
      console.error('Error sending items to backend:', error);
      alert('Failed to send items to the server.');
    }
  };
  
 

  return (
    <View style={styles.containeratas}>
      <View style={styles.containermini}>
        <Text style={styles.textBarcode}>Export Items</Text>
        <View style={styles.button}>
          <TouchableOpacity style={styles.icon} onPress={() => navigation.goBack()}>
            <Entypo name="back" size={50} style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.containerbawah}>
        <Text style={{ color:'#2f3542',fontWeight:'bold',fontSize:24,marginBottom:20 }}>Server Ip</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter server IP"
          value={serverIp}
          onChangeText={text => setServerIp(text)}
        />
        <TouchableOpacity style={styles.buttonExport} onPress={handleSave}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>

        
        <CheckBox   
        style={styles.check}
        title="Delete All Barcode After Save"
        checked={deleteAllBarcode}
        size={30}
        onPress={()=>{setDeleteAllBarcode(!deleteAllBarcode)}}
        />
        <TouchableOpacity style={styles.buttonExport} onPress={handleSend}>
          <Text style={styles.buttonText}>Send</Text>
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
    fontWeight: 'bold',
    marginLeft:130,
    marginTop:13
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
  containerbawah: {
    backgroundColor: '#f5f6fa',
    marginTop: 20,
    borderRadius: 50,
    marginLeft: 11,
    height: '85%',
    width: '95%',
    paddingBottom: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: 40,
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: 'black'
  },
  buttonExport: {
    backgroundColor: '#192a56',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  check:
  {
    backgroundColor:"#f5f6fa"
  }
});
