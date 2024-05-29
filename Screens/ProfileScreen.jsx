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
import { CommonActions } from '@react-navigation/native';

function ProfileScreen({navigation}) {
  const [userData, setUserData] = useState('');

  async function getData() {
    const token = await AsyncStorage.getItem('token');
    console.log(token);
    axios
      .post('http://192.168.2.38:5000/userdata', {token: token})
      .then(res => {
        console.log(res.data);
        setUserData(res.data.data);
        console.log(userData);
        console.log('tt',token);

      });
  }

  useEffect(() => {
    getData();
  }, []);
  
  //ใช้ได้ตลอด
  // function logout() {
  //   AsyncStorage.removeItem('isLoggedIn');
  //   AsyncStorage.removeItem('token');
  //   navigation.reset({
  //     index: 0,
  //     routes: [{ name: 'LoginUser' }],
  //   });
  // }
  

  // function logout() {
  //   AsyncStorage.setItem('isLoggedIn', '');
  //   AsyncStorage.setItem('token', '');
  //   navigation.dispatch(
  //     CommonActions.reset({
  //       index: 0,
  //       routes: [
  //         { name: 'LoginUser' },
  //       ],
  //     })
  //   );
  // }

  // async function logout() {
  //   try {
  //     await AsyncStorage.removeItem('token');
  //     await AsyncStorage.removeItem('isLoggedIn');
  //     navigation.navigate('LoginUser');
  //   } catch (error) {
  //     console.error('Error while logging out:', error);
  //   }
  // }

  // function logout() {
  //   try {
  //     Alert.alert(
  //       'ออกจากระบบจากบัญชีของคุณใช่ไหม',
  //       '',
  //       [
  //         {
  //           text: 'ยกเลิก',
  //           onPress: () => console.log('ยกเลิกการออกจากระบบ'),
  //           style: 'cancel',
  //         },
  //         {
  //           text: 'ออกจากระบบ',
  //           onPress : () => {
  //             AsyncStorage.setItem('isLoggedIn','');
  //             AsyncStorage.setItem('token','');
  //             navigation.navigate('Login');
  //           },
  //         },
  //       ],
  //       { cancelable: false }
  //     );
  //   } catch (error) {
  //     console.error('Error while logging out:', error);
  //   }
  // }
  
  // function logout() {
  //   Alert.alert(
  //     "ยืนยันการออกจากระบบ",
  //     "คุณแน่ใจหรือไม่ว่าต้องการออกจากระบบ?",
  //     [
  //       {
  //         text: "ยกเลิก",
  //         onPress: () => console.log("ยกเลิก"),
  //         style: "cancel"
  //       },
  //       { text: "ตกลง", onPress: () => handleLogout() }
  //     ]
  //   );
  // }
  
  async function logout() {
    await AsyncStorage.setItem('isLoggedIn', '');
    await AsyncStorage.setItem('token', '');
    navigation.navigate("Login");
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
   
        <Text style={styless.textex} onPress={logout}>
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
