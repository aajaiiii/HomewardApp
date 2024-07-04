import React from 'react';
import { ScrollView, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useFocusEffect} from '@react-navigation/native';

export default function Success() {
  const navigation = useNavigation();

  const Home = async () => {
    await AsyncStorage.setItem('isLoggedIn', JSON.stringify(true));
    await AsyncStorage.setItem('addDataFirst', JSON.stringify(true));
    navigation.navigate('Home');
  };

  
  return (
    <ScrollView
      keyboardShouldPersistTaps={'always'}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
      style={{backgroundColor: '#F7F7F7'}}
    >
      <View style={styles.content}>
        <Ionicons name="checkmark-circle" color="#87CEFA" size={100} />
        <Text style={styles.successText}>บันทึกข้อมูลสำเร็จ</Text>
        <TouchableOpacity onPress={Home} style={styles.button}>
          <Text style={styles.buttonText}>ไปที่หน้าหลัก</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40,
  },
  content: {
    alignItems: 'center',
  },
  successText: {
    fontSize: 20,
    marginVertical: 20,
    color:'#000',
  },
  button: {
    backgroundColor: '#87CEFA',
    padding: 10,
    width:150,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    fontSize: 16,
    color:'#fff',
    textAlign:'center'
  },
});
