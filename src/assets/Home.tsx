import React,{useEffect} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, ScrollView,Alert} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import { NavigationContainer } from '@react-navigation/native';
import { openDatabase } from 'react-native-sqlite-storage';



const db = openDatabase({
  name:"stockopname_sqlite",
  location:'default'
});

export default function Home({navigation}) {

  const handleDeleteAllItems = () => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete all items?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel'
        },
        {
          text: 'OK',
          onPress: () => deleteAllItems()
        }
      ],
      { cancelable: false }
    );
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

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      e.preventDefault();

      Alert.alert(
        'Logout',
        'Are you sure you want to logout?',
        [
          { text: 'Cancel', style: 'cancel', onPress: () => {} },
          {
            text: 'Logout',
            style: 'destructive',
            onPress: () => navigation.dispatch(e.data.action), 
          },
        ],
        { cancelable: false }
      );
    });

    return unsubscribe;
  }, [navigation]);


  return (
    <View style={styles.containeratas}>
      <View style={styles.containermini}>
        <Text style={styles.textBarcode}>Barcode Inventory</Text>
        <View style={styles.button}>
          <TouchableOpacity style={styles.icon}>
            <Entypo name="menu" size={50} style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.welcome}>Welcome User ...</Text>
      <View style={styles.containerbawah}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <TouchableOpacity style={styles.card} onPress={()=> navigation.navigate('Add')}>
            <Entypo name="circle-with-plus" size={70} style={{color:'#44bd32', marginRight: 10}} />
            <View>
              <Text style={styles.headercard}>Add Items</Text>
              <Text style={styles.cardText}>Click here to add items</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card} onPress={()=> navigation.navigate('ViewItems')}>
            <View style={styles.iconAndText}>
              <View>
                <Text style={styles.headercardkiri}>View Items</Text>
                <Text style={styles.cardTextKiri}>Click here to view items</Text>
              </View>
              <Entypo name="eye" size={60} style={{color:'#353b48', marginLeft: 10}} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card} onPress={()=>navigation.navigate('ExportItems')}>
            <Entypo name="publish" size={70} style={{color:'#487eb0', marginRight: 10}} />
            <View>
              <Text style={styles.headercard}>Export Data</Text>
              <Text style={styles.cardText}>Click here to export all items</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card} onPress={handleDeleteAllItems}>
            <View style={styles.iconAndText}>
              <View>
                <Text style={styles.headercardkirib}>Delete All Barcode</Text>
                <Text style={styles.cardTextKiri}>Click here to delete all items</Text>
              </View>
              <Entypo name="trash" size={50} style={{color:'#e84118', marginLeft:5}} />
            </View>
          </TouchableOpacity>
        </ScrollView>
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
    height: '9%',
    width: '100%',
    borderRadius: 4
  },
  containerbawah: {
    flex: 1,
    marginTop: 30,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#ccc',
    alignItems: 'center',
    backgroundColor: '#FFF'
  },
  textBarcode: {
    fontSize: 30,
    fontFamily: 'Roboto',
    color: '#FFF',
    marginTop: 8,
    marginLeft: 20,
    fontWeight: "bold",
    textAlign: 'center',
  },
  icon: {
    height: 40,
    width: 40,
    marginBottom: 300,
    color: '#FFF',
  },
  containerlogo: {
    marginHorizontal: 27
  },
  button: {
    height: 45,
    width: 45,
    marginTop: -45,
    marginLeft: 10
  },
  welcome: {
    justifyContent: 'center',
    textAlign: 'center',
    color: '#0097e6',
    fontWeight: 'bold',
    fontSize: 30,
    marginTop: 40
  },
  card: {
    marginVertical: 20,
    padding: 15,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#ccc',
    margin: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f6fa',
    width: '90%', 
  },
  scrollView: {
    paddingBottom:25,
    marginTop:10,
    // backgroundColor: '#FFF',
    alignItems: 'center',
    width:380
  },
  iconbawah: {
    height: 70,
    width: 70,
  },
  headercard: {
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 20,
    color:'#2d3436'
  },
  cardText: {
    fontSize: 16,
    color: '#555',
  },
  iconAndText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headercardkiri: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 120,
    color:'#2d3436'
  },
  cardTextKiri: {
    fontSize: 16,
    color: '#555',
    marginLeft:60
  },
  headercardkirib: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 100,
    color:'#2d3436'
  },
});
