import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { Text } from 'react-native-paper';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Entypo from 'react-native-vector-icons/Entypo';


const AdminPage = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userLevel, setUserLevel] = useState('user');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const userList = await AsyncStorage.multiGet(keys);
      const filteredList = userList.filter(([key, value]) => {
        return key !== 'adminUsername' && key !== 'adminPassword' && isValidJson(value);
      });
      setUsers(filteredList.map(([key, value]) => ({ key, ...JSON.parse(value) })));
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const isValidJson = (str) => {
    try {
      JSON.parse(str);
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleRegister = async () => {
    try {
      if (!username || !password) {
        Alert.alert('Please enter both username and password.');
        return;
      }
      const userData = {
        username,
        password,
        userLevel,
      };
      await AsyncStorage.setItem(username, JSON.stringify(userData));
      Alert.alert('User registered successfully!');
      setUsername('');
      setPassword('');
      setUserLevel('user');
      loadUsers(); 
    } catch (error) {
      console.error('Error registering user:', error);
      Alert.alert('Failed to register user. Please try again.');
    }
  };

  const handleDelete = async (key, username) => {
    try {
      const loggedInUsername = await AsyncStorage.getItem('loggedInUsername'); 
      if (loggedInUsername === username) {
        Alert.alert('Cannot delete own account!');
        return;
      }
  
      Alert.alert(
        'Confirm Deletion',
        `Delete User ${username}?`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Delete',
            onPress: async () => {
              await AsyncStorage.removeItem(key);
              Alert.alert('User deleted successfully!');
              loadUsers(); 
            },
            style: 'destructive',
          },
        ]
      );
    } catch (error) {
      console.error('Error deleting user:', error);
      Alert.alert('Failed to delete user. Please try again.');
    }
  };
  

  return (
    <View style={styles.container}>
    <View style={styles.containermini}>
     <Text style={styles.textBarcode}>Add/Remove User</Text>
        <View style={styles.button}>
          <TouchableOpacity style={styles.icon} onPress={()=>navigation.goBack()}>
            <Entypo name="back" size={50} style={styles.icon} />
          </TouchableOpacity>
        </View>
    </View>
      <View style={styles.containerbawah}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <Picker
            style={styles.input}
            selectedValue={userLevel}
            onValueChange={(itemValue) => setUserLevel(itemValue)}
          >
            <Picker.Item label="User" value="user" />
            <Picker.Item label="Admin" value="admin" />
          </Picker>
          <Button title="Register" onPress={handleRegister} />
          <View style={styles.userList}>
            {users.map((user) => (
              <View key={user.key} style={styles.userItem}>
                <Text style={styles.userInfo}>{user.username} - {user.password}-{user.userLevel}</Text>
                <TouchableOpacity onPress={() => handleDelete(user.key, user.username)}>
                    <Entypo name="trash" size={30} color={'red'} style={{ marginRight:'5%' }} />
                </TouchableOpacity>

              </View>
            ))}
          </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor:'#192a56'
  },
  input: {
    width: '100%',
    height: 40,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: 'black',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    color:'#FFF',
  },
  userList: {
    marginTop: 20,
    width: '100%',
    backgroundColor:'#74b9ff',
    borderRadius:20
  },
  userItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  userInfo: {
    color: '#2d3436',
    fontWeight:'bold',
    marginLeft:'5%',
    marginVertical:'5%'
    
  },
  containermini: {
    backgroundColor: '#273c75',
    height: '9%',
    width: '110%',
    borderRadius: 4,
    marginTop:'1%'
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
    containerbawah:
    {
        width:'100%',
        marginVertical:'10%'
    }
    
});

export default AdminPage;
