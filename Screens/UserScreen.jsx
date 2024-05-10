import {StyleSheet, Text, View, Button, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import FeatherIcon from 'react-native-vector-icons/Feather';

function UserScreen(props) {
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

  const calculateAge = (birthday) => {
    // ตรวจสอบว่า birthday ไม่เป็นค่าว่าง และไม่เป็น undefined
    if (birthday) {
      const birthDate = new Date(birthday);
      const today = new Date();
      
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      // ถ้าเดือนปัจจุบันน้อยกว่าเดือนเกิด หรือ ถ้าเดือนเท่ากัน และวันปัจจุบันน้อยกว่าวันเกิด
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
    
      return age;
    } else {
      // ถ้า birthday เป็นค่าว่าง หรือ undefined ให้คืนค่าเป็น 0
      return 0;
    }
  };
  const currentDate = new Date();

  // แปลงวันเกิดของผู้ใช้เป็นวัตถุ Date
  const userBirthday = new Date(userData.birthday);

  // คำนวณความแตกต่างระหว่างปีปัจจุบันกับปีเกิดของผู้ใช้
  const ageDiff = currentDate.getFullYear() - userBirthday.getFullYear();

  // ตรวจสอบว่าวันเกิดของผู้ใช้มีเกินวันปัจจุบันหรือไม่
  // ถ้ายังไม่เกิน แสดงอายุเป็นผลลัพธ์
  // ถ้าเกินแล้ว ลดอายุลง 1 ปี
  const isBeforeBirthday =
    currentDate.getMonth() < userBirthday.getMonth() ||
    (currentDate.getMonth() === userBirthday.getMonth() &&
      currentDate.getDate() < userBirthday.getDate());

  const userAge = isBeforeBirthday ? ageDiff - 1 : ageDiff;


  return (
    <View>
      <View style={styles.container}>
      <Text style={styles.textStyle}>ชื่อผู้ใช้ : {userData.username}</Text>
        <Text style={styles.textStyle}>
          ชื่อ-นามสกุล : {userData.name} {userData.surname}
        </Text>
        <Text style={styles.textStyle}>เพศ : {userData.gender}</Text>
        <Text style={styles.textStyle}>อายุ: {userAge} ปี</Text>
        <Text style={styles.textStyle}>สัญชาติ : {userData.nationality}</Text>
        <Text style={styles.textStyle}>
          เลขประจำตัวบัตรประชาชน : {userData.ID_card_number}
        </Text>
        <Text style={styles.textStyle}>ที่อยู่ : {userData.Address}</Text>
        <Text style={styles.textStyle}>เบอร์โทรศัพท์ : {userData.tel}</Text>
        <Text style={styles.textStyle}>อีเมล : {userData.email}</Text>

        <Text
          style={styles.textStyle}
          onPress={() => {
            navigation.navigate('UserEdit', {data: userData});
          }}>
          แก้ไขข้อมูลส่วนตัว
        </Text>
      </View>
      <View style={styles.container}>
        <Text style={styles.textStyle}>ผู้ดูแลหลัก :</Text>
        <Text style={styles.textStyle}>ผู้เกี่ยวข้องเป็น :</Text>
        <Text style={styles.textStyle}>เบอร์โทรศัพท์ :</Text>
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
  textStyle: {
    color: 'black',
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 10,
  },
});
export default UserScreen;
