import {StyleSheet, Text, View, Button, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import FeatherIcon from 'react-native-vector-icons/Feather';

function ProfileScreen(props) {
  const navigation = useNavigation();
  console.log(props);
  const [userData, setUserData] = useState('');

  async function getData() {
    const token = await AsyncStorage.getItem('token');
    console.log(token);
    axios
      .post('http://192.168.2.40:5000/userdata', {token: token})
      .then(res => {
        console.log(res.data);
        setUserData(res.data.data);
        console.log(userData);
      });
  }

  useEffect(() => {
    getData();
  }, []);

  async function logout() {
    try {
      await AsyncStorage.removeItem('token');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error while logging out:', error);
    }
  }
  return (
    <View>
      {/* <TouchableOpacity style={styles.container}
       onPress={() => {
        navigation.navigate('User', {data: userData});
      }}
      >
        <Text style={styles.text}>
          {userData.name} {userData.surname}
        </Text>  
      </TouchableOpacity> */}

      <View style={styles.container}>
        <Text
          style={styles.text}
          onPress={() => {
            navigation.navigate('User', {data: userData});
          }}>
          ข้อมูลส่วนตัว
        </Text>
        <Text style={styles.text}>เกี่ยวกับเรา</Text>
        <Text style={styles.textex} onPress={logout}>
          ออกจากระบบ
        </Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    margin: 10,
    elevation: 2,
    //   alignItems: 'center',
  },
  container1: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginTop: 1,
    marginHorizontal: 10,
    elevation: 2,
    //   alignItems: 'center',
  },
  text: {
    color: 'black',
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 10,
  },
  textex: {
    fontSize: 18,
    color: 'red',
    fontWeight: '500',
    marginBottom: 10,
  },
});
export default ProfileScreen;
