import {
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import style from './style';
import styles from './Login/style';
import Icon from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';


function ProfileScreen({ setIsLoggedIn }) {
  const [userData, setUserData] = useState('');
  const navigation = useNavigation();


  async function getData() {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const res = await axios.post('http://192.168.2.57:5000/userdata', { token });
        console.log('of',res.data);
        setUserData(res.data.data);
      } else {
        Alert.alert('Error', 'Token not found');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      Alert.alert('Error', 'Failed to load user data');
    }
  }
  useEffect(() => {
    getData();
  }, []);


  async function checkAsyncStorage() {
    try {
      const token = await AsyncStorage.getItem('token');
      const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
      const addDataFirst = await AsyncStorage.getItem('addDataFirst');
      
      console.log('Token:', token);
      console.log('isLoggedIn:', isLoggedIn);
      console.log('addDataFirst:', addDataFirst);
    } catch (error) {
      console.error('Error reading AsyncStorage:', error);
    }
  }
  useEffect(() => {
    checkAsyncStorage();
  }, []);
  
  function logout() {
    Alert.alert(
      'ยืนยันการออกจากระบบ',
      'คุณแน่ใจหรือไม่ว่าต้องการออกจากระบบ?',
      [
        {
          text: 'ยกเลิก',
          onPress: () => console.log('ยกเลิก'),
          style: 'cancel',
        },
        {
          text: 'ตกลง',
          onPress: async () => {
            try {
              // ลบข้อมูลทั้งหมดที่เกี่ยวข้อง
              await AsyncStorage.setItem('isLoggedIn', 'false'); // เปลี่ยนเป็น 'false' แทน ''
              await AsyncStorage.setItem('token', '');
              await AsyncStorage.setItem('addDataFirst', '');
          
              // ตรวจสอบว่า AsyncStorage ถูกลบแล้วหรือไม่
              const token = await AsyncStorage.getItem('token');
              const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
              const addDataFirst = await AsyncStorage.getItem('addDataFirst');
              
              console.log('Token after removal:', token); // ควรเป็น null
              console.log('isLoggedIn after removal:', isLoggedIn); // ควรเป็น null
              console.log('addDataFirst after removal:', addDataFirst); // ควรเป็น null
              
              // ถ้าทุกอย่างถูกลบแล้ว ไปที่หน้า Login
              if (!token && isLoggedIn === 'false' && !addDataFirst) {
                setIsLoggedIn(false);
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Loginuser' }],
                });
              }
            } catch (error) {
              console.error('Error removing data:', error);
            }
          },
        },
      ]
    );
  }
  


  return (
    <ScrollView
      keyboardShouldPersistTaps={'always'}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{paddingBottom: 40}}
      style={{ backgroundColor: '#F7F7F7'}}>
      <View style={style.container}>
        <TouchableOpacity 
         onPress={() => {
          // navigation.navigate('MainStack', { screen: 'User', params: { data: userData } });

          navigation.navigate('User', {data: userData});
        }}
        style={{flexDirection: 'row', alignItems: 'center'}
      }>
          <Icon name="user" color="black" style={styles.smallIcon} />
          <Text
            style={styless.textprofile}
           >
            ข้อมูลส่วนตัว
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
        onPress={() => {
          navigation.navigate('Updatepassword', {data: userData});
        }}
        style={{flexDirection: 'row', alignItems: 'center'}}>
          <Ionicons
            name="key-outline"
            color="black"
            style={styles.smallIcon}
          />
          <Text style={styless.textprofile}>เปลี่ยนรหัสผ่าน</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center'}}>
          <Ionicons
            name="headset-outline"
            color="black"
            style={styles.smallIcon}
          />
          <Text style={styless.textprofile}>ติดต่อเรา</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styless.containerlogout} onPress={logout}>
   
        <Text style={styless.textex}>
          ออกจากระบบ
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
const styless = StyleSheet.create({
  textprofile: {
    color: 'black',
    fontFamily: 'Arial',
    fontSize: 16,
    fontWeight: 'normal',
    padding: 10,
  },
  
  textex: {
    color: 'black',
    textAlign: 'center',
    fontFamily: 'Arial',
    fontSize: 16,
    fontWeight: 'normal',
  },
  containerlogout: {
    backgroundColor: '#DCDCDC',
    padding: 10,
    borderRadius: 10,
    margin: 15,
    marginVertical: 1,
    elevation: 2,
  },
});
export default ProfileScreen;
