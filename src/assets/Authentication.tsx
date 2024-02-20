import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Clipboard } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import DeviceInfo from 'react-native-device-info';
import CryptoJS from 'react-native-crypto-js';

export default function Authentication({ navigation }) {
  const [encryptedDeviceId, setEncryptedDeviceId] = useState('');

  const encryptDeviceId = () => {
    try {
      const deviceId = DeviceInfo.getAndroidIdSync() || '';
      const encrypted = CryptoJS.AES.encrypt(deviceId, 'fqP2OyXp8Sjp9PmcuYfK3O4KKb4pONTvLrAKJAcBSJZPPr6L8LC2CWVfrsokA7EEx3KHlBYuSlLaueutSuIUxXvBLvfgGd6hHpDg').toString();
      setEncryptedDeviceId(encrypted);
    } catch (error) {
      console.error('Error encrypting device ID:', error);
    }
  };

  const decryptDeviceId = () => {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedDeviceId, 'fqP2OyXp8Sjp9PmcuYfK3O4KKb4pONTvLrAKJAcBSJZPPr6L8LC2CWVfrsokA7EEx3KHlBYuSlLaueutSuIUxXvBLvfgGd6hHpDg');
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      console.log('Decrypted Device ID:', decrypted);
    } catch (error) {
      console.error('Error decrypting device ID:', error);
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

      <TouchableOpacity onPress={decryptDeviceId}>
        <Text style={styles.textEncrypt}>Decrypt Device ID</Text>
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
  }
});
