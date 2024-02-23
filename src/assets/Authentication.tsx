import React, { useState,useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Clipboard, Alert } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import DeviceInfo from 'react-native-device-info';
import CryptoJS from 'react-native-crypto-js';
import RNFS from 'react-native-fs'; // Import RNFS
import { TextInput } from 'react-native-paper';

export default function Authentication({ navigation }) {
  const [encryptedDeviceId, setEncryptedDeviceId] = useState('');
  const [decryptedInput, setDecryptedInput] = useState('');
  const [fileExists, setFileExists] = useState(false);


  useEffect(() => {
    checkFileExistence();
  }, []);

  const checkFileExistence = async () => {
    try {
      const path = RNFS.DocumentDirectoryPath + '/encrypted1.txt';
      const exists = await RNFS.exists(path);
      setFileExists(exists);
      console.log('File exists:', exists);
      
      if (exists) {
        const content = await RNFS.readFile(path, 'utf8');
        console.log('File content:', content);
      }
    } catch (error) {
      console.error('Error checking file existence:', error);
    }
  };

  const encryptDeviceId = () => {
    try {
      const deviceId = DeviceInfo.getAndroidIdSync() || '';
      const encrypted1 = CryptoJS.AES.encrypt(deviceId, 'fqP2OyXp8Sjp9PmcuYfK3O4KKb4pONTvLrAKJAcBSJZPPr6L8LC2CWVfrsokA7EEx3KHlBYuSlLaueutSuIUxXvBLvfgGd6hHpDg').toString();
      const encrypted2 = CryptoJS.AES.encrypt(encrypted1, 'UYqjAWLWXy5nKT5OlUyXVMSMlZMwo1kq4qrXPTawiaUQNDEOVZ3zyM3x7RyYaP7XNqNVbUaIpRA84fFlupV7rxlWEIfpRvW9cDVm').toString();
      const encrypted3 = CryptoJS.AES.encrypt(encrypted2, 'Asp5BbjUKY55o2Ww6bPgmsY2kbCeY3axfqtxkYXDhKqgXydfSpBzvyqZoB8WP40waD0y8LEQumFmzVq8FUgZJkmBQ0MV31kWnWA5').toString();
      setEncryptedDeviceId(encrypted3);
    } catch (error) {
      console.error('Error encrypting device ID:', error);
    }
  };

  const authenticate = async () => {
    try {
      // First decryption(androidId)
      const bytes1 = CryptoJS.AES.decrypt(encryptedDeviceId, 'Asp5BbjUKY55o2Ww6bPgmsY2kbCeY3axfqtxkYXDhKqgXydfSpBzvyqZoB8WP40waD0y8LEQumFmzVq8FUgZJkmBQ0MV31kWnWA5');
      const decrypted1 = bytes1.toString(CryptoJS.enc.Utf8);

      // Second decryption(encrypted1)
      const bytes2 = CryptoJS.AES.decrypt(decrypted1, 'UYqjAWLWXy5nKT5OlUyXVMSMlZMwo1kq4qrXPTawiaUQNDEOVZ3zyM3x7RyYaP7XNqNVbUaIpRA84fFlupV7rxlWEIfpRvW9cDVm');
      const decrypted2 = bytes2.toString(CryptoJS.enc.Utf8);

      // Third decryption(encrypted2)
      const bytes3 = CryptoJS.AES.decrypt(decrypted2, 'fqP2OyXp8Sjp9PmcuYfK3O4KKb4pONTvLrAKJAcBSJZPPr6L8LC2CWVfrsokA7EEx3KHlBYuSlLaueutSuIUxXvBLvfgGd6hHpDg');
      const decrypted3 = bytes3.toString(CryptoJS.enc.Utf8);

      console.log('Third Decrypted Device ID:', decrypted2);

      // Check if decrypted3 matches the user input
      if (decryptedInput === decrypted2) {
        // Write encrypted1 to a file
        const deviceId = DeviceInfo.getAndroidIdSync() || '';
        const encrypted1 = CryptoJS.AES.encrypt(deviceId, 'UYqjAWLWXy5nKT5OlUyXVMSMlZMwo1kq4qrXPTawiaUQNDEOVZ3zyM3x7RyYaP7XNqNVbUaIpRA84fFlupV7rxlWEIfpRvW9cDVm').toString();

        const path = RNFS.DocumentDirectoryPath + '/encrypted1.txt';
        await RNFS.writeFile(path, encrypted1, 'utf8');
        console.log('Encrypted1 written to file:', path);

        // Show success message
        Alert.alert('Authentication successful', 'Encrypted1 written to file.');
      } else {
        // Show error message if authentication fails
        Alert.alert('Authentication failed', 'Invalid input.');
      }
    } catch (error) {
      console.error('Error decrypting device ID:', error);
      // Show error message if decryption fails
      Alert.alert('Error', 'Error decrypting device ID.');
    }
  };

  return (
    <View style={styles.containeratas}>
      <View style={styles.containermini}>
        <Text style={styles.textBarcode}>Authentication</Text>
        <View style={styles.button}>
          <TouchableOpacity style={styles.icon} onPress={() => navigation.goBack()}>
            <Entypo name="back" size={50} style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity onPress={encryptDeviceId}>
        <Text style={styles.textEncrypt}>Encrypt Device ID</Text>
      </TouchableOpacity>

      {encryptedDeviceId && (
        <View style={styles.encryptedContainer}>
          <Text style={styles.textEncrypt}>{encryptedDeviceId}</Text>
        </View>
      )}

      <TextInput
        style={styles.input}
        placeholder="Enter decrypted code"
        onChangeText={setDecryptedInput}
        value={decryptedInput}
      />

      <TouchableOpacity onPress={authenticate}>
        <Text style={styles.textEncrypt}>Authenticate</Text>
      </TouchableOpacity>
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
  textEncrypt: {
    color: '#FFF',
    fontSize: 20,
    marginTop: 20,
  },
  encryptedContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#273c75',
    borderRadius: 5,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 20,
    marginHorizontal: 20,
    paddingHorizontal: 10,
    color: '#FFF',
  },
});
