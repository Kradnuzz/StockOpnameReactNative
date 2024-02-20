import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import { NavigationContainer } from '@react-navigation/native';
import { openDatabase } from 'react-native-sqlite-storage';
import { TextInput } from 'react-native-paper';
import { Float } from 'react-native/Libraries/Types/CodegenTypes';

const db = openDatabase({
  name: "stockopname_sqlite",
  location: "default"
});

interface Item {
  id: number;
  shelf_id: string;
  item_id: string;
  quantity: number;
}

export default function ViewItems({ navigation }) {

  const [items, setItems] = useState<Item[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
  try {
    const database = await db;
    await database.transaction(async (txn) => {
      await txn.executeSql(
        'SELECT * FROM stock ORDER BY id DESC',
        [],
        (sqlTxn, result) => {
          const len = result.rows.length;
          const fetchedItems = [];
          for (let i = 0; i < len; i++) {
            fetchedItems.push(result.rows.item(i));
          }
          setItems(fetchedItems);
        },
        (error) => console.error('Error fetching items:', error)
      );
    });
  } catch (error) {
    console.error('Error fetching items:', error);
  }
};

  const deleteItem = async (id) => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this item?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Deletion cancelled'),
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              const database = await db;
              await database.transaction(async (txn) => {
                await txn.executeSql(
                  'DELETE FROM stock WHERE id = ?',
                  [id],
                  () => {
                    console.log(`Item with ID ${id} deleted successfully`);
                    fetchItems(); 
                  },
                  (error) => console.error(`Error deleting item with ID ${id}:`, error)
                );
              });
            } catch (error) {
              console.error(`Error deleting item with ID ${id}:`, error);
            }
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  const filteredItems = items.filter(item => {
    const barcodeMatch = item.item_id && item.item_id.toLowerCase().includes(searchQuery.toLowerCase());
    const shelfMatch = item.shelf_id && item.shelf_id.toLowerCase().includes(searchQuery.toLowerCase());
    return barcodeMatch || shelfMatch;
  });

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.itemtext}>Tanggal:{item.tanggal}</Text>
      <Text style={styles.itemtext}>DeviceId:{item.device_id}</Text>
      <Text style={styles.itemtext}>Waktu:{item.waktu}</Text>
      <Text style={styles.itemtext}>Username:{item.User_id}</Text>
      <Text style={styles.itemtext}>Barcode:{item.item_id}</Text>
      <Text style={styles.itemtext}>Quantity:{item.quantity.toFixed(2)}</Text>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteItem(item.id)}
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.containeratas}>
      <View style={styles.containermini}>
        <Text style={styles.textBarcode}>View Items</Text>
        <View style={styles.button}>
          <TouchableOpacity style={styles.icon} onPress={() => navigation.goBack()}>
            <Entypo name="back" size={50} style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>
       <TextInput
        style={styles.searchInput}
        placeholder="Search by barcode or shelf ID"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={filteredItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
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
  item: {
    backgroundColor: '#55efc4',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  searchInput: {
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 20,
    margin: 10,
    borderRadius: 15,
    borderColor:'#ccc',
    borderWidth:2
  },
  deleteButton: {
    backgroundColor: '#d63031',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  itemtext:
  {
    fontWeight:'bold',
    color:'#2d3436',
    fontFamily:'Roboto'
  }

});
