import {StyleSheet, Text, View, Button, TouchableOpacity,ScrollView} from 'react-native';
import {useNavigation, useIsFocused } from '@react-navigation/native';
import {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import style from './style';

function UserScreen(props) {
  const navigation = useNavigation();
  console.log(props);
  const [userData, setUserData] = useState('');
  const isFocused = useIsFocused();
  const [caregiverInfo, setCaregiverInfo] = useState(null);

  useEffect(() => {
    if (isFocused) {
      getData();
      fetchCaregiverInfo();
    }
  }, [isFocused]);

  async function getData() {
    const token = await AsyncStorage.getItem('token');
    console.log(token);
    axios
      .post('http://192.168.2.43:5000/userdata', {token: token})
      .then(res => {
        console.log(res.data);
        setUserData(res.data.data);
        console.log(userData);

      });
  }

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (userData) {
      fetchCaregiverInfo();
    }
  }, [userData],[isFocused]);
  
  const fetchCaregiverInfo = async () => {
    try {
      const response = await axios.get(`http://192.168.2.43:5000/getcaregiver/${userData._id}`);
      setCaregiverInfo(response.data.data);

    } catch (error) {
      console.error("Error fetching caregiver info:", error);
    }
  };

  useEffect(()=> {
    fetchCaregiverInfo();
  }, [userData]);
  


  const currentDate = new Date();

  const userBirthday = new Date(userData.birthday);

  const ageDiff = currentDate.getFullYear() - userBirthday.getFullYear();

  const isBeforeBirthday =
    currentDate.getMonth() < userBirthday.getMonth() ||
    (currentDate.getMonth() === userBirthday.getMonth() &&
      currentDate.getDate() < userBirthday.getDate());

  const userAge = isBeforeBirthday ? ageDiff - 1 : ageDiff;

  if (caregiverInfo && caregiverInfo.user) {
    console.log('หน้า1', caregiverInfo.user);
  } else {
    console.log('ข้อมูล caregiver ยังไม่ถูกโหลด');
  }
  
  return (
    <ScrollView
    keyboardShouldPersistTaps={'always'}
    showsVerticalScrollIndicator={false}
    contentContainerStyle={{paddingBottom: 40}}>
      <View style={style.container}>
      <Text style={styles.textStyle}>ข้อมูลทั่วไป</Text>

        {userData && (
          <>
            <Text style={styles.textStyle}>
              ชื่อผู้ใช้ : {userData.username}
            </Text>
            <Text style={styles.textStyle}>
              ชื่อ-นามสกุล : {userData.name} {userData.surname}
            </Text>
            <Text style={styles.textStyle}>เพศ : {userData.gender}</Text>
            {userData && userData.birthday && (
  <Text style={styles.textStyle}>อายุ: {userAge} ปี</Text>
)}
            <Text style={styles.textStyle}>
              สัญชาติ : {userData.nationality}
            </Text>
            <Text style={styles.textStyle}>
              เลขประจำตัวบัตรประชาชน : {userData.ID_card_number}
            </Text>
            <Text style={styles.textStyle}>ที่อยู่ : {userData.Address}</Text>
            <Text style={styles.textStyle}>เบอร์โทรศัพท์ : {userData.tel}</Text>
            <Text style={styles.textStyle}>อีเมล : {userData.email}</Text>
          </>
        )}
        <Text
          style={styles.textStyle}
          onPress={() => {
            navigation.navigate('UserEdit', {data: userData});
          }}>
          แก้ไขข้อมูลส่วนตัว
        </Text>
      </View>

      <View style={style.container}>
      {caregiverInfo && (
        <>
        <Text style={styles.textStyle}>ข้อมูลผู้ดูแล</Text>
        <Text style={styles.textStyle}>ชื่อ-นามสกุล :{caregiverInfo.name}{" "}{caregiverInfo.surname}</Text>
        <Text style={styles.textStyle}>เกี่ยวข้องเป็น : {caregiverInfo.Relationship}</Text>
        <Text style={styles.textStyle}>เบอร์โทรศัพท์ : {caregiverInfo.tel}</Text>
        </>
      )}
      <Text
          style={styles.textStyle}
          onPress={() => {
            navigation.navigate('CaregiverEdit', {data: caregiverInfo});
          }}>
          แก้ไขข้อมูลผู้ดูแล
        </Text>
      </View>
      </ScrollView>

  );
}
const styles = StyleSheet.create({
  // textStyle: {
  //   color: 'black',
  //   fontSize: 18,
  //   fontWeight: '500',
  //   marginBottom: 10,
  //   fontFamily: 'Open Sans',
  // },

});
export default UserScreen;
