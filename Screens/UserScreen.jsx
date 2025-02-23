import {
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  ScrollView,
  BackHandler,
} from 'react-native';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import style from './style';
import Icon from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import {useFocusEffect} from '@react-navigation/native';

function UserScreen(props) {
  const navigation = useNavigation();
  console.log(props);
  const [userData, setUserData] = useState('');
  const isFocused = useIsFocused();
  const [caregiverInfo, setCaregiverInfo] = useState(null);
  const [userAge, setUserAge] = useState(0);
  const [userAgeInMonths, setUserAgeInMonths] = useState(0);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

   useFocusEffect(
      React.useCallback(() => {
        // ซ่อน TabBar เมื่อเข้าหน้านี้
        navigation.getParent()?.setOptions({
          tabBarStyle: {display: 'none'},
        });
        // return () => {
        //   navigation.getParent()?.setOptions({
        //     tabBarStyle: {display: 'none'},
        //   });
        // };
      }, [navigation]),
    );
  
    useEffect(() => {
      const unsubscribe = navigation.addListener('beforeRemove', e => {
        if (e.data.action.type === 'POP') {
          navigation.getParent()?.setOptions({
            tabBarStyle: {
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              elevation: 10,
              backgroundColor: '#fff',
              borderTopColor: 'transparent',
              shadowColor: '#000',
              shadowOffset: {width: 0, height: -5},
              shadowOpacity: 0.15,
              shadowRadius: 10,
              height: 65,
            },
          });
        } else {
          navigation.getParent()?.setOptions({
            tabBarStyle: {display: 'none'},
          });
        }
      });
  
      return unsubscribe;
    }, [navigation]);

    
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
      .post('http://10.0.2.2:5000/userdata', {token: token})
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
          `http://10.0.2.2:5000/getcaregiver/${userData._id}`,
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
    <View

      style={{flex: 1}} 
    >
    <ScrollView
      keyboardShouldPersistTaps={'always'}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{paddingBottom: 40}}
      style={{backgroundColor: '#F5F5F5'}}>
      {!isEmailVerified && (
        <View style={styles.emailActions}>
          <View style={styles.alertBox}>
            <View style={styles.alertInBox}>
              <Ionicons
                name="mail"
                size={24}
                color="#fff"
                style={styles.alertIcon}
              />
              <Text style={styles.alertText}>กรุณายืนยันอีเมลของคุณ</Text>
            </View>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('EmailVerification', {data: userData})
              }
              style={styles.verifyEmailButton}>
              <Text style={styles.verifyEmailText}>ยืนยันอีเมล</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
{/* {!userData.email ? (
  <View style={styles.emailActions}>
    <View style={styles.alertBoxNull}>
      <View style={styles.alertInBox}>
        <Ionicons
          name="mail"
          size={24}
          color="#fff"
          style={styles.alertIcon}
        />
        <Text style={styles.alertText}>กรุณาเพิ่มอีเมลของคุณ</Text>
      </View>
      <TouchableOpacity
        onPress={() => navigation.navigate('AddEmail', { data: userData })}
        style={styles.verifyEmailButtonNull}>
        <Text style={styles.verifyEmailText}>เพิ่มอีเมล</Text>
      </TouchableOpacity>
    </View>
  </View>
) : !isEmailVerified && (
  <View style={styles.emailActions}>
    <View style={styles.alertBox}>
      <View style={styles.alertInBox}>
        <Ionicons
          name="mail"
          size={24}
          color="#fff"
          style={styles.alertIcon}
        />
        <Text style={styles.alertText}>กรุณายืนยันอีเมลของคุณ</Text>
      </View>
      <TouchableOpacity
        onPress={() => navigation.navigate('EmailVerification', { data: userData })}
        style={styles.verifyEmailButton}>
        <Text style={styles.verifyEmailText}>ยืนยันอีเมล</Text>
      </TouchableOpacity>
    </View>
  </View>
)} */}

      <View style={[style.container]}>
        <View style={styles.header}>
          <Text style={styles.texter}>ข้อมูลทั่วไป</Text>
          <Icon
            onPress={() => {
              navigation.navigate('UserEdit', {data: userData});
            }}
            name="edit"
            color="#5AB9EA"
            style={styles.IconUserSC}
          />
        </View>

        {userData && (
          <>
            <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
              <Text style={styles.textLabel}>ชื่อผู้ใช้</Text>
              <Text style={styles.textValue}>{userData.username}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.textLabel}>เลขบัตรประชาชน</Text>
              <Text style={styles.textValue}>{userData.ID_card_number}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.textLabel}>อีเมล</Text>
              <Text style={styles.textValue}>{userData.email|| "-"}</Text>
            </View>

            <View
              style={[
                styles.emailStatusContainer,
                {
                  borderColor: isEmailVerified ? '#259b24' : '#ff9800',
                  backgroundColor: isEmailVerified ? '#E6F4EA' : '#FFF3E0',
                },
              ]}>
              <Ionicons
                name={isEmailVerified ? 'checkmark-circle' : 'close-circle'}
                size={20}
                color={isEmailVerified ? '#259b24' : '#ff9800'}
                style={styles.emailStatusIcon}
              />
              <Text
                style={[
                  styles.emailStatusText,
                  {color: isEmailVerified ? '#259b24' : '#ff9800'},
                ]}>
                {isEmailVerified ? 'ยืนยันอีเมลแล้ว' : 'อีเมลยังไม่ได้ยืนยัน'}
              </Text>
            </View>
{/* {userData.email && (
  <View
    style={[
      styles.emailStatusContainer,
      {
        borderColor: isEmailVerified ? '#259b24' : '#ff9800',
        backgroundColor: isEmailVerified ? '#E6F4EA' : '#FFF3E0',
      },
    ]}>
    <Ionicons
      name={isEmailVerified ? 'checkmark-circle' : 'close-circle'}
      size={20}
      color={isEmailVerified ? '#259b24' : '#ff9800'}
      style={styles.emailStatusIcon}
    />
    <Text
      style={[
        styles.emailStatusText,
        { color: isEmailVerified ? '#259b24' : '#ff9800' },
      ]}>
      {isEmailVerified ? 'ยืนยันอีเมลแล้ว' : 'อีเมลยังไม่ได้ยืนยัน'}
    </Text>
  </View>
)} */}
            {/* <View style={styles.emailActions}>
  {!isEmailVerified ? (
    <TouchableOpacity
      onPress={() => navigation.navigate('EmailVerification', { data: userData })}
      style={styles.verifyEmailButton}>
      <Ionicons name="alert-circle" size={16} color="white" />
      <Text style={styles.verifyEmailText}>ยืนยันอีเมล</Text>
    </TouchableOpacity>
  ) : (
    <TouchableOpacity
      onPress={() => navigation.navigate('UpdateEmail', { data: userData })}
      style={styles.editEmailButton}>
      <Icon name="edit" size={18} color="black" />
      <Text style={styles.editEmailText}>เปลี่ยนอีเมล</Text>
    </TouchableOpacity>
  )}
</View> */}

            <View style={styles.infoRow}>
              <Text style={styles.textLabel}>ชื่อ-นามสกุล</Text>
              <Text style={styles.textValue}>
                {userData.name} {userData.surname}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.textLabel}>เพศ</Text>
              <Text style={styles.textValue}>{userData.gender || "-"}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.textLabel}>อายุ</Text>
              {userData && userData.birthday ? (
                <Text style={styles.textValue}>
                  {userAge} ปี {userAgeInMonths} เดือน
                </Text>
              ) : (
                <Text style={[style.text]}>0 ปี 0 เดือน</Text>
              )}
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.textLabel}>สัญชาติ</Text>
              <Text style={styles.textValue}>{userData.nationality|| "-"}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.textLabel}>ที่อยู่</Text>
              <Text style={styles.textValue}>{userData.Address|| "-"}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.textLabel}>เบอร์โทรศัพท์</Text>
              <Text style={styles.textValue}>{userData.tel|| "-"}</Text>
            </View>
            {/* <View style={styles.buttonnext}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('UserEdit', {data: userData});
                  }}
                  style={styles.editButton}>
                  <Icon name="edit" color="white" style={styles.icon} />
                  <Text style={styles.textnext}>แก้ไข</Text>
                </TouchableOpacity>
              </View> */}
          </>
        )}
      </View>

      <View style={style.container}>
        {caregiverInfo && caregiverInfo.length > 0 ? (
          <>
            <View style={styles.header}>
              <Text style={styles.texter}>ข้อมูลผู้ดูแล</Text>
              <Icon
                onPress={() => {
                  // navigation.navigate('CaregiverEdit', {data: caregiver});
                  navigation.navigate('Caregiver');
                }}
                name="edit"
                color="#5AB9EA"
                style={styles.IconUserSC}
              />
            </View>
            {caregiverInfo.map((caregiver, index) => (
              <View key={index} style={styles.caregiverCard}>
              <View style={styles.caregiverHeader}>
              <Text style={styles.caregiverTitle}>
                ผู้ดูแลที่ {index + 1}
              </Text>
            </View>
                <View key={index} style={styles.caregiverInCard}>
                  
                {/* <Text style={styles.texter}>ข้อมูลทั่วไป</Text> */}
                <View style={styles.infoRow}>
                  <Text style={styles.textLabel}>เลขบัตรประชาชน</Text>
                  <Text style={styles.textValue}>
                    {caregiver.ID_card_number}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.textLabel}>ชื่อ-นามสกุล</Text>
                  <Text style={styles.textValue}>
                    {caregiver.name} {caregiver.surname}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.textLabel}>ความสัมพันธ์กับผู้ป่วย</Text>
                  <Text style={styles.textValue}>
                    {caregiver.userRelationships[0]?.relationship}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.textLabel}>เบอร์โทรศัพท์</Text>
                  <Text style={styles.textValue}>{caregiver.tel}</Text>
                </View>
                {/* <View style={styles.buttonnext}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('CaregiverEdit', { data: caregiver });
              }}
              style={styles.editButton}>
              <Icon name="edit" color="white" style={styles.icon} />
              <Text style={styles.textnext}>แก้ไข</Text>
            </TouchableOpacity>
          </View> */}
              </View>
              </View>
            ))}
          </>
        ) : (
          <View style={styles.emptyContainer}>
          <View style={styles.header}>
            <Text style={styles.texter}>ข้อมูลผู้ดูแล</Text>
            <Icon
              onPress={() => navigation.navigate('Caregiver')}
              name="edit"
              color="#5AB9EA"
              style={styles.IconUserSC}
            />
          </View>
          <View style={styles.noDataContainer}>
              <Text style={styles.noDataText}>ไม่มีข้อมูลผู้ดูแล</Text>
          </View>
          {/* <TouchableOpacity
            onPress={() => navigation.navigate('Caregiver')}
            style={styles.addButton}
          >
            <Text style={styles.addButtonText}>เพิ่มข้อมูลผู้ดูแล</Text>
          </TouchableOpacity> */}
        </View>
        )}
      </View>
    </ScrollView>
   </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB', // พื้นหลังสีอ่อน
    padding: 20,
    borderRadius: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 5, 
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  texter: {
    color: 'black',
    fontSize: 20,
    padding: 7,
    fontFamily: 'Kanit-SemiBold',
  },
  textLabel: {
    fontSize: 16,
    color: 'gray',
    paddingHorizontal: 10,
    fontFamily: 'Kanit-Medium',
    lineHeight: 24,
  },
  textValue: {
    fontFamily: 'Kanit-Medium',
    fontSize: 16,
    color: 'black',
    textAlign: 'right',
    flex: 1,
    lineHeight: 24,
  },

  IconUserSC: {
    fontSize: 25,
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
    // fontWeight: 'bold',
    fontFamily: 'Kanit-Regular',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
    // emailActions: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   justifyContent: 'flex-end',
  //   marginTop: 5,
  // },

  // verifyEmailButton: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   backgroundColor: '#FF4D4D', // สีแดงเตือน
  //   paddingVertical: 5,
  //   paddingHorizontal: 10,
  //   borderRadius: 6,
  // },

  // verifyEmailText: {
  //   color: 'white',
  //   fontSize: 14,
  //   marginLeft: 6,
  //   fontFamily: 'Kanit-Regular',
  // },

  // editEmailButton: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   paddingVertical: 5,
  //   paddingHorizontal: 10,
  //   borderRadius: 6,
  //   borderWidth: 1,
  //   borderColor: '#5AB9EA', // สีฟ้า
  // },

  // editEmailText: {
  //   color: '#5AB9EA',
  //   fontSize: 14,
  //   marginLeft: 6,
  //   fontFamily: 'Kanit-Regular',
  // },
  emailActions: {
    marginTop: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  alertBox: {
    backgroundColor: '#FF9800', 
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 10,
    flexDirection: 'column',
    marginBottom: 10,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5, // เพิ่มเงาให้กล่อง
  },
  alertBoxNull: {
    backgroundColor: '#00bcd4', 
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 10,
    flexDirection: 'column',
    marginBottom: 10,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5, // เพิ่มเงาให้กล่อง
  },
  alertInBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  alertIcon: {
    marginRight: 12,
  },
  alertText: {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'Kanit-Regular',
    flexShrink: 1,
    lineHeight: 24,
  },
  verifyEmailButton: {
    alignItems: 'center',
    backgroundColor: '#FFB74D',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 6,
    justifyContent: 'center',
    marginTop: 8,
  },
  verifyEmailButtonNull: {
    alignItems: 'center',
    backgroundColor: '#4dd0e1',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 6,
    justifyContent: 'center',
    marginTop: 8,
  },
  verifyEmailText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Kanit-Regular',
    textAlign: 'center',
  },
  emailStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end', // ให้ไปอยู่ชิดขวา
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1.5,
    borderRadius: 6,
  },
  emailStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  emailStatusText: {
    fontSize: 14,
    color: '#888',
    fontFamily: 'Kanit-Regular',
  },
  emailStatusIcon: {
    marginRight: 5,
  },
  caregiverCard: {
    backgroundColor: '#fff',
    marginBottom: 14,
    borderRadius: 8,    
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  caregiverInCard: {
    paddingHorizontal:12,
    marginBottom: 20,
  },
  caregiverHeader: {
    backgroundColor: '#5AB9EA',
    paddingHorizontal:18,
    paddingVertical:9,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    // marginBottom: 10,
  },
  caregiverTitle: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Kanit-Medium',
    paddingLeft:5
  },
  noDataContainer: {
    alignItems: 'center',
    padding: 10,
  },
  noDataText: {
    fontSize: 16,
    color: 'gray',
    fontFamily: 'Kanit-Regular',
  },
});
export default UserScreen;
