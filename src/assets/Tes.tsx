import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import * as Keychain from 'react-native-keychain';

export default function Tes() {
  const [isRegistered, setIsRegistered] = useState(false);
  const [deviceId, setDeviceId] = useState('');

  useEffect(() => {
    checkRegistration();
    fetchAndroidId(); // Fetch Android ID when component mounts
  }, []);

  const checkRegistration = async () => {
    try {
      const deviceId = await DeviceInfo.getAndroidId();
      if (deviceId) {
        const storedDeviceId = await getStoredDeviceId();
        setIsRegistered(deviceId === storedDeviceId);
      } else {
        console.error('Error checking registration: Empty or null deviceId');
      }
    } catch (error) {
      console.error('Error checking registration:', error);
    }
  };

  const getStoredDeviceId = async () => {
    try {
      const credentials = await Keychain.getGenericPassword();
      return credentials ? credentials.username : null;
    } catch (error) {
      console.error('Error getting stored device ID:', error);
      return null;
    }
  };

  const registerDevice = async () => {
    try {
      const deviceId = await DeviceInfo.getAndroidId();
      if (deviceId) {
        await Keychain.setGenericPassword(deviceId, deviceId);
        setIsRegistered(true);
      } else {
        console.error('Error registering device: Empty or null deviceId');
      }
    } catch (error) {
      console.error('Error registering device:', error);
    }
  };

  const fetchAndroidId = async () => {
    try {
      const id = await DeviceInfo.getAndroidId();
      setDeviceId(id);
    } catch (error) {
      console.error('Error fetching Android ID:', error);
    }
  };

  return (
    <View style={styles.container}>
      {isRegistered ? (
        <Text style={styles.text}>Home Page</Text>
      ) : null}
      {!isRegistered && (
        <Button title="Register" onPress={registerDevice} />
      )}
      <Text style={styles.text}>Android ID: {deviceId}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  text: {
    fontSize: 20,
    color: 'white',
  },
});
