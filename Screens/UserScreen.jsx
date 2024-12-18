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
import LinearGradient from 'react-native-linear-gradient';

function UserScreen(props) {
  const navigation = useNavigation();
  console.log(props);
  const [userData, setUserData] = useState('');
  const isFocused = useIsFocused();
  const [caregiverInfo, setCaregiverInfo] = useState(null);
  const [userAge, setUserAge] = useState(0);
  const [userAgeInMonths, setUserAgeInMonths] = useState(0);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

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
      .post(
        'http://10.53.57.175:5000/userdata',
        {token: token},
      )
      .then(res => {
        console.log(res.data);
        setUserData(res.data.data);
        setIsEmailVerified(res.data.data.isEmailVerified);
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
          `http://10.53.57.175:5000/getcaregiver/${userData._id}`,
        );
        setCaregiverInfo(response.data.data);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setCaregiverInfo(null);
      } else {
        console.error('Error fetching caregiver info:', error);
      }
    }
  };

  const currentDate = new Date();

  useEffect(() => {
    if (userData && userData.birthday) {
      const userBirthday = new Date(userData.birthday);
      const ageDiff = currentDate.getFullYear() - userBirthday.getFullYear();
      const monthDiff = currentDate.getMonth() - userBirthday.getMonth();
      setUserAgeInMonths(monthDiff >= 0 ? monthDiff : 12 + monthDiff);

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && currentDate.getDate() < userBirthday.getDate())
      ) {
        setUserAge(ageDiff - 1);
      } else {
        setUserAge(ageDiff);
      }
    }
  }, [userData, currentDate]);

  return (
    <LinearGradient
      // colors={['#00A9E0', '#5AB9EA', '#E0FFFF', '#FFFFFF']}
      // colors={['#5AB9EA', '#87CEFA']}
      colors={['#fff', '#fff']}
      style={{flex: 1}} // ให้ครอบคลุมทั้งหน้าจอ
    >
      <ScrollView
        keyboardShouldPersistTaps={'always'}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 60}}
        style={{backgroundColor: 'transparent'}}>
        {/* <View style={styles.buttonnext}>
        <TouchableOpacity onPress={() => {
              navigation.navigate('UserEdit', {data: userData});
            }} style={styles.editButton} 
             >
           <Icon
            name="edit"
            color="white"
            style={styles.icon}
          />
            <Text style={styles.textnext}>แก้ไขการบันทึก</Text>
        </TouchableOpacity>
            </View> */}
        <View style={[style.container, {flex: 1}]}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={styles.texter}>ข้อมูลทั่วไป </Text>
            {/* <Icon
            onPress={() => {
              navigation.navigate('UserEdit', {data: userData});
            }}
            name="edit"
            color="black"
            style={styles.IconUserSC}
          /> */}
          </View>

          {userData && (
            <>
              <View
                style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
                <Text style={style.text}>ชื่อผู้ใช้ :</Text>
                <Text style={[style.text, style.textWidth]}>
                  {userData.username}
                </Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={style.text}>เลขประจำตัวประชาชน :</Text>
                <Text style={[style.text, style.textWidth]}>
                  {userData.ID_card_number}
                </Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={style.text}>อีเมล :</Text>
                <Text style={[style.text, style.textWidth]}>
                  {userData.email}
                </Text>
                {isEmailVerified ? (
                  <Icon
                    name="edit"
                    color="black"
                    style={styles.IconUserSC}
                    onPress={() => {
                      navigation.navigate('UpdateEmail', {data: userData});
                    }}
                  />
                ) : (
                  <Text
                    onPress={() => {
                      navigation.navigate('EmailVerification', {
                        data: userData,
                      });
                    }}>
                    ยืนยันอีเมล
                  </Text>
                )}
              </View>

              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={style.text}>ชื่อ-นามสกุล :</Text>
                <Text style={[style.text, style.textWidth]}>
                  {userData.name} {userData.surname}
                </Text>
              </View>

              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={style.text}>เพศ :</Text>
                <Text style={[style.text, style.textWidth]}>
                  {userData.gender}
                </Text>
              </View>
              <View
                style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
                <Text style={style.text}>อายุ:</Text>
                {userData && userData.birthday ? (
                  <Text style={[style.text]}>
                    {userAge} ปี {userAgeInMonths} เดือน
                  </Text>
                ) : (
                  <Text style={[style.text]}>0 ปี 0 เดือน</Text>
                )}
              </View>

              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={style.text}>สัญชาติ :</Text>
                <Text style={[style.text, style.textWidth]}>
                  {userData.nationality}
                </Text>
              </View>
              <View style={{flexDirection: 'row', flex: 1}}>
                <Text style={[style.text]}>ที่อยู่ :</Text>
                <Text style={[style.text, style.textWidth]}>
                  {userData.Address}
                </Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={style.text}>เบอร์โทรศัพท์ :</Text>
                <Text style={[style.text, style.textWidth]}>
                  {userData.tel}
                </Text>
              </View>
              <View style={styles.buttonnext}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('UserEdit', {data: userData});
                  }}
                  style={styles.editButton}>
                  <Icon name="edit" color="white" style={styles.icon} />
                  <Text style={styles.textnext}>แก้ไข</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>

        <View style={style.container}>
          {caregiverInfo ? (
            <>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={styles.texter}>ข้อมูลผู้ดูแล</Text>
                {/* 
              <Icon
                onPress={() => {
                  navigation.navigate('CaregiverEdit', {data: caregiverInfo});
                }}
                name="edit"
                color="black"
                style={styles.IconUserSC}
              /> */}
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={style.text}>ชื่อ-นามสกุล :</Text>
                <Text style={[style.text, style.textWidth]}>
                  {caregiverInfo.name} {caregiverInfo.surname}
                </Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={style.text}>เกี่ยวข้องเป็น :</Text>
                <Text style={[style.text, style.textWidth]}>
                  {caregiverInfo.Relationship}
                </Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={style.text}>เบอร์โทรศัพท์ :</Text>
                <Text style={[style.text, style.textWidth]}>
                  {caregiverInfo.tel}
                </Text>
              </View>
              <View style={styles.buttonnext}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('CaregiverEdit', {data: caregiverInfo});
                  }}
                  style={styles.editButton}>
                  <Icon name="edit" color="white" style={styles.icon} />
                  <Text style={styles.textnext}>แก้ไข</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={styles.texter}>ข้อมูลผู้ดูแล</Text>
              {/* <TouchableOpacity
              style={styles.addButton}
              onPress={() => {
                navigation.navigate('CaregiverAdd', {userId: userData._id});
              }}>
              <Text style={styles.addButtonText}>เพิ่มข้อมูลผู้ดูแล</Text>
            </TouchableOpacity> */}
              <Text>ไม่มีข้อมูลผู้ดูแล</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  texter: {
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
  addButtonText: {
    backgroundColor: '#5AB9EA',
    padding: 10,
    margin: 5,
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonnext: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: 5,
    marginTop: 5,
  },
  editButton: {
    flexDirection: 'row',
    backgroundColor: '#5AB9EA',
    borderWidth: 1,
    borderColor: '#5AB9EA',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 3,
  },
  textnext: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
export default UserScreen;
