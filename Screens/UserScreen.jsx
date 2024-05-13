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

  const userBirthday =
    userData && userData.birthday ? new Date(userData.birthday) : null;
  const ageDiff = userBirthday
    ? currentDate.getFullYear() - userBirthday.getFullYear()
    : 0;
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
      <View style={[style.container, {flex: 1}]}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={styles.textheader}>ข้อมูลทั่วไป </Text>
          <Icon
            onPress={() => {
              navigation.navigate('UserEdit', {data: userData});
            }}
            name="edit"
            color="black"
            style={styles.IconUserSC}
          />
        </View>

        {userData && (
          <>
            <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
              <Text style={style.texthead}>ชื่อผู้ใช้ :</Text>
              <Text style={[style.text, style.textWidth]}>
                {userData.username}
              </Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={style.texthead}>อีเมล :</Text>
              <Text style={[style.text, style.textWidth]}>
                {userData.email}
              </Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={style.texthead}>เลขประจำตัวประชาชน :</Text>
              <Text style={[style.text, style.textWidth]}>
                {userData.ID_card_number}
              </Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={style.texthead}>ชื่อ-นามสกุล :</Text>
              <Text style={[style.text, style.textWidth]}>
                {userData.name} {userData.surname}
              </Text>
            </View>

            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={style.texthead}>เพศ :</Text>
              <Text style={[style.text, style.textWidth]}>
                {userData.gender}
              </Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
              <Text style={style.texthead}>อายุ:</Text>
              {userData && userData.birthday ? (
                <Text style={[style.text]}>
                  {userAge} ปี{' '}
                  {currentDate.getMonth() - userBirthday.getMonth()} เดือน
                </Text>
              ) : (
                <Text style={[style.text]}>0 ปี 0 เดือน</Text>
              )}
              {/* <Text style={[style.text,style.textWidth]}></Text> */}
            </View>

            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={style.texthead}>สัญชาติ :</Text>
              <Text style={[style.text, style.textWidth]}>
                {userData.nationality}
              </Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
              <Text style={[style.texthead]}>ที่อยู่ :</Text>
              <Text style={[style.text, style.textWidth]}>
                {userData.Address}
              </Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={style.texthead}>เบอร์โทรศัพท์ :</Text>
              <Text style={[style.text, style.textWidth]}>{userData.tel}</Text>
            </View>
          </>
        )}
      </View>

      <View style={style.container}>
        {caregiverInfo && (
          <>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={styles.textheader}>ข้อมูลผู้ดูแล</Text>

              <Icon
                onPress={() => {
                  navigation.navigate('CaregiverEdit', {data: caregiverInfo});
                }}
                name="edit"
                color="black"
                style={styles.IconUserSC}
              />
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={style.texthead}>ชื่อ-นามสกุล :</Text>
              <Text style={[style.text, style.textWidth]}>
                {caregiverInfo.name} {caregiverInfo.surname}
              </Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={style.texthead}>เกี่ยวข้องเป็น :</Text>
              <Text style={[style.text, style.textWidth]}>
                {caregiverInfo.Relationship}
              </Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={style.texthead}>เบอร์โทรศัพท์ :</Text>
              <Text style={[style.text, style.textWidth]}>
                {caregiverInfo.tel}
              </Text>
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  textheader: {
    color: 'black',
    fontSize: 18,
    padding: 7,
    textAlign: 'center',
    fontFamily: 'Arial',
    fontWeight: '700',
  },

  IconUserSC: {
    fontSize: 20,
  },
});
export default UserScreen;
