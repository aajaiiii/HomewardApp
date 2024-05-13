import {
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import style from './style';
import Icon from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';

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

  useEffect(
    () => {
      if (userData) {
        fetchCaregiverInfo();
      }
    },
    [userData],
    [isFocused],
  );

  const fetchCaregiverInfo = async () => {
    try {
      if (userData) {
        const response = await axios.get(
          `http://192.168.2.43:5000/getcaregiver/${userData._id}`,
        );
        setCaregiverInfo(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching caregiver info:', error);
    }
  };
  

  useEffect(() => {
    fetchCaregiverInfo();
  }, [userData]);

const currentDate = new Date();

const userBirthday = userData && userData.birthday ? new Date(userData.birthday) : null;
const ageDiff = userBirthday ? currentDate.getFullYear() - userBirthday.getFullYear() : 0;
const isBeforeBirthday =
  userBirthday &&
  (currentDate.getMonth() < userBirthday.getMonth() ||
    (currentDate.getMonth() === userBirthday.getMonth() &&
      currentDate.getDate() < userBirthday.getDate()));
const userAge = isBeforeBirthday ? ageDiff - 1 : ageDiff;

  return (
    <ScrollView
      keyboardShouldPersistTaps={'always'}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{paddingBottom: 40}}>
      <View style={style.container}>
      <View style={styles.container1}>
        <Text style={styles.textheader}>ข้อมูลทั่วไป</Text>
        </View>

        {userData && (
          <>
            <Text style={style.text}>
              ชื่อผู้ใช้ : {userData.username}
            </Text>
            <Text style={style.text}>อีเมล : {userData.email}</Text>
            <Text style={style.text}>
              เลขประจำตัวบัตรประชาชน : {userData.ID_card_number}
            </Text>
            <Text style={style.text}>
              ชื่อ-นามสกุล : {userData.name} {userData.surname}
            </Text>
            <Text style={style.text}>เพศ : {userData.gender}</Text>
            {userData && userData.birthday && (
              <Text style={style.text}>อายุ: {userAge} ปี</Text>
            )}
            <Text style={style.text}>
              สัญชาติ : {userData.nationality}
            </Text>
       
            <Text style={style.text}>ที่อยู่ : {userData.Address}</Text>
            <Text style={style.text}>เบอร์โทรศัพท์ : {userData.tel}</Text>
          </>
        )}
        <Text
          style={style.text}
          onPress={() => {
            navigation.navigate('UserEdit', {data: userData});
          }}>
          แก้ไขข้อมูลส่วนตัว
        </Text>
      </View>

      <View style={style.container}>
        {caregiverInfo && (
          <>
            <Text style={styles.textheader}>ข้อมูลผู้ดูแล</Text>
            <Text style={style.text}>
              ชื่อ-นามสกุล :{caregiverInfo.name} {caregiverInfo.surname}
            </Text>
            <Text style={style.text}>
              เกี่ยวข้องเป็น : {caregiverInfo.Relationship}
            </Text>
            <Text style={style.text}>
              เบอร์โทรศัพท์ : {caregiverInfo.tel}
            </Text>
          </>
        )}
        <Text
          style={style.text}
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
  textheader: {
    color: 'black',
    fontSize: 18,
    padding: 7,
    textAlign:'center',
    fontFamily: 'Arial',
    fontWeight:'700',
  },

});
export default UserScreen;
