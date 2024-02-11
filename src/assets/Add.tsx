import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, ScrollView , Alert} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import { openDatabase } from 'react-native-sqlite-storage';
import { RadioButton, TextInput } from 'react-native-paper';

const db = openDatabase({
  name:"stockopname_sqlite",
  location:'default'
});

export default function Add({ navigation, route }) {
  const [selectedRadio, setSelectedRadio] = useState(1);
  const [barcodeId, setBarcodeId] = useState(route.params?.barcodeId || '');
  const [shelfId, setShelfId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [recordCount, setRecordCount] = useState(0)
  const [quantityCount, setQuantityCount] = useState(0)

  const createTables = async () => {
    try {
      const database = await db;
      await (await db).transaction(txn => {
        txn.executeSql('CREATE TABLE IF NOT EXISTS stock (id INTEGER PRIMARY KEY AUTOINCREMENT,shelf_id VARCHAR(20),item_id VARCHAR(20),quantity INTEGER)',
        [],
        (sqlTxn, res)=>{
          console.log("Table created successfully");
        }
        );
      });
    } catch (error) {
      console.error('Error creating tables:', error);
    }
  };

  const insertItem = async (shelf_id, item_id, quantity) => {
    try {
      const database = await db;
      await database.transaction(async (txn) => {
        await txn.executeSql(
          `SELECT id, quantity FROM stock WHERE shelf_id = ? AND item_id = ?`,
          [shelf_id, item_id],
          async (sqlTxn, result) => {
            if (result.rows.length > 0) {
              const existingQuantity = result.rows.item(0).quantity;
              const updatedQuantity = existingQuantity + quantity;
              await txn.executeSql(
                `UPDATE stock SET quantity = ? WHERE shelf_id = ? AND item_id = ?`,
                [updatedQuantity, shelf_id, item_id],
                (sqlTxn, res) => {
                  if (res.rowsAffected > 0) {
                    console.log(`Updated quantity for item with shelf_id ${shelf_id} and item_id ${item_id}`);
                  } else {
                    console.log('Failed to update quantity');
                  }
                }
              );
            } else {
              await txn.executeSql(
                `INSERT INTO stock (shelf_id, item_id, quantity) VALUES (?, ?, ?)`,
                [shelf_id, item_id, quantity],
                (sqlTxn, res) => {
                  if (res.rowsAffected > 0) {
                    console.log(`Inserted row with shelf_id ${shelf_id} and item_id ${item_id}`);
                  } else {
                    console.log('Failed to insert row');
                  }
                }
              );
            }
          }
        );
      });
    } catch (error) {
      console.error(`Error inserting data: ${error.message}`);
    }
  };
  
  

  const handleSave = async () => {
    await createTables();
    if (shelfId && barcodeId) {
      let quantityToInsert;
      if (selectedRadio === 1) {
        quantityToInsert = 1;
      } else {
        quantityToInsert = quantity ? parseInt(quantity) : 1;
      }
      await insertItem(shelfId, barcodeId, quantityToInsert);
      setShelfId('');
      setBarcodeId('');
      setSelectedRadio(1);
      setQuantity(''); 
      fetchRecordCount();
      fetchQuantityCount();
    } else {
      Alert.alert('Please fill in all the required fields');
    }
  };
  
  

  

  useEffect(() => {
    if (route.params?.barcodeId) {
      setBarcodeId(route.params.barcodeId);
    }
  }, [route.params?.barcodeId]);

  useEffect(() => {
    fetchRecordCount();
    fetchQuantityCount();
  }, [recordCount, quantityCount]);

  useEffect(() => {
    navigation.addListener('focus', () => {
      fetchRecordCount();
      fetchQuantityCount();
    });
  }, [navigation]);


  const handleRadioChange = (value) => {
    setSelectedRadio(value);
    if (value === 1) {
      setQuantity('1');
    } else {
      setQuantity('');
    }
  };


  useEffect(() => {
    fetchRecordCount();
  }, []);

  const fetchRecordCount = async () => {
    try {
      const database = await db;
      await database.transaction(async (txn) => {
        await txn.executeSql(
          'SELECT COUNT(*) AS count FROM stock',
          [],
          (sqlTxn, result) => {
            const count = result.rows.item(0).count;
            setRecordCount(count);
          },
          (error) => console.error('Error fetching record count:', error)
        );
      });
    } catch (error) {
      console.error('Error fetching record count:', error);
    }
  };

  useEffect(() => {
      fetchQuantityCount();
  },[]);

  const fetchQuantityCount = async () => {
    try {
      const database = await db;
      await database.transaction(async (txn) => {
        await txn.executeSql(
          'SELECT SUM(quantity) as totalQuantity FROM stock',
          [],
          (sqlTxn, result) => {
            const totalQuantity = result.rows.item(0).totalQuantity || 0;
            setQuantityCount(totalQuantity);
          },
          (error) => console.error('Error fetching quantity count:', error)
        );
      });
    } catch (error) {
      console.error('Error fetching quantity count:', error);
    }
  };


  const choice = [
    {
      id: 1,
      name: 'Auto Quantity = 1'
    },
    {
      id: 2,
      name: 'Manual Quantity'
    }
  ];

  return (
    <KeyboardAvoidingView
      behavior='padding'
      style={styles.containeratas}
    >
      <ScrollView>
        <View style={styles.containermini}>
          <Text style={styles.textBarcode}>Add Items</Text>
          <View style={styles.button}>
            <TouchableOpacity style={styles.icon} onPress={() => navigation.goBack()}>
              <Entypo name="back" size={50} style={styles.icon} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.containerbawah}>
          <Text style={{ marginLeft: '10%', marginTop: 40, fontSize: 20, fontFamily: "monospace", fontWeight: 'bold', color: '#00a8ff' }}>Record: {recordCount}</Text>
          <Text style={{ marginLeft: '55%', bottom: 29.5, right: 25, fontSize: 20, fontFamily: "monospace", fontWeight: 'bold', color: '#00a8ff' }}>Quantity: {quantityCount}</Text>
          {choice.map((choice) => (
            <TouchableOpacity key={choice.id} onPress={() => setSelectedRadio(choice.id)}>
              <View style={styles.skillContainer}>
                <Text style={styles.skillText}>{choice.name}</Text>
                <RadioButton
                  value={String(choice.id)}
                  status={selectedRadio === choice.id ? 'checked' : 'unchecked'}
                  onPress={() => setSelectedRadio(choice.id)}
                />
              </View>
            </TouchableOpacity>
          ))}
          <TextInput
            style={styles.input}
            label="Type shelf Id"
            value={shelfId}
            onChangeText={setShelfId}
          />
          <TextInput
            style={styles.input}
            label="Type or Scan Barcode ID"
            value={barcodeId}
            onChangeText={setBarcodeId}
          />
          <TouchableOpacity onPress={() => navigation.navigate('ScanScreen')} style={{ width:100,marginHorizontal:'80%',bottom:'17%'}}>
              <Entypo name="camera" size={60} color='black'/>
          </TouchableOpacity>

          {selectedRadio === 2 && (
            <TextInput
            style={styles.inputbawah}
            label="Quantity"
            value={quantity}
            onChangeText={(text) => {
              const numericValue = parseInt(text);
              if (!isNaN(numericValue)) {
                setQuantity(text);
              }
            }}
            keyboardType="numeric"
          />
          )}


          <TouchableOpacity style={styles.buttonbawah} onPress={handleSave}>
            <Text style={styles.text}>Save</Text>
          </TouchableOpacity>


        </View>
      </ScrollView>
    </KeyboardAvoidingView>

  );
}

const styles = StyleSheet.create({
  containeratas: {
    flex: 1,
    backgroundColor: '#192a56',
    paddingBottom: 100,
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
  containerbawah: {
    backgroundColor: '#f5f6fa',
    marginTop: 20,
    borderRadius: 50,
    marginLeft: 11,
    height: '85%',
    width: '95%',
    paddingBottom: 100,
  },
  skillContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  skillText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    width: '70%',
    marginTop: 20,
    marginBottom: 10,
    borderRadius: 8,
    marginLeft: 20,
  },
  inputbawah: {
    width: '70%',
    bottom: 30,
    marginBottom: 10,
    borderRadius: 8,
    marginLeft: 20,
  },
  buttonbawah: {
    position: 'absolute',
    top: '105%',
    backgroundColor: '#0a0a23',
    borderRadius: 10,
    padding: 15,
    minHeight: 30,
    minWidth: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    left: 120,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  buttonsamping: {
    position: 'absolute',
    top: '20%',
    backgroundColor: '#0a0a23',
    borderRadius: 10,
    padding: 15,
    minHeight: 30,
    minWidth: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    left: 20,
  },
});
