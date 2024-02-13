import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const CustomDrawer = ({ navigation,userLevel,username }) => {

  const handleDrawerItemPress = (screenName) => {
    navigation.navigate(screenName);
  };

  const handleLogout = () => {
    navigation.navigate('LoginScreen');
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={{ fontWeight: 'bold', fontSize: 25, color: '#FFF' }}>Barcode Inventory</Text>
        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => handleDrawerItemPress('Home')}
        >
          <Text style={styles.drawerItemText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => handleDrawerItemPress('ChangeId')}
        >
          <Text style={styles.drawerItemText}>Change Device Id</Text>
        </TouchableOpacity>
        {userLevel === 'admin' && (
        <TouchableOpacity
        style={styles.drawerItem}
        onPress={() => handleDrawerItemPress('AdminPage')}
        >
        <Text style={styles.drawerItemText}>Add/Remove User</Text>
        </TouchableOpacity>
)}

        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => handleDrawerItemPress('Authentication')}
        >
          <Text style={styles.drawerItemText}>Authentication</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={[styles.drawerItem, styles.logoutButton]}
        onPress={handleLogout}
      >
        <Text style={styles.drawerItemText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 20,
    backgroundColor: '#192a56',
    justifyContent: 'space-between'
  },
  drawerItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginVertical: 12,
  },
  drawerItemText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF'
  },
  logoutButton: {
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
});

export default CustomDrawer;
