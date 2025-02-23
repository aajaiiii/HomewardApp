import React from 'react';
import { ScrollView, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useFocusEffect} from '@react-navigation/native';

export default function Success({ navigation, route }) {
  // const navigation = useNavigation();
  const { setAddDataFirst } = route.params;

  const Home = async () => {
    setAddDataFirst(true);
    await AsyncStorage.setItem('isLoggedIn', JSON.stringify(true));
    await AsyncStorage.setItem('addDataFirst', JSON.stringify(true));
    
    navigation.navigate('TabNav');  };

  
  return (
    <ScrollView
      keyboardShouldPersistTaps={'always'}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
      style={{backgroundColor: '#F7F7F7'}}
    >
      <View style={styles.content}>
        <Ionicons name="checkmark-circle" color="#5AB9EA" size={100} />
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
    fontFamily: 'Kanit-Regular',

  },
  button: {
    backgroundColor: '#5AB9EA',
    padding: 10,
    width:160,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    fontSize: 16,
    color:'#fff',
    textAlign:'center',
    fontFamily: 'Kanit-Regular',
  },
});
