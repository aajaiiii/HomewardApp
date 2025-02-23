import {
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  ScrollView,
  Alert,
  BackHandler,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import style from './style';
import styles from './Login/style';
import Icon from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useFocusEffect} from '@react-navigation/native';

import LinearGradient from 'react-native-linear-gradient';

function ProfileScreen({setIsLoggedIn}) {
  const [userData, setUserData] = useState('');
  const navigation = useNavigation();

     useFocusEffect(
        React.useCallback(() => {
          // ซ่อน TabBar เมื่อเข้าหน้านี้
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
              height: 65,}
          });
          return () => {
            navigation.getParent()?.setOptions({
              tabBarStyle: {display: 'none'},
            });
          };
        }, [navigation]),
      );

  useEffect(() => {
    const backAction = () => {
      // ถ้าเป็นหน้า Profile หรือ Chat จะกลับไปที่หน้า Home ก่อน
      if (navigation.isFocused()) {
        navigation.navigate('Home');
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => {
      backHandler.remove();
    };
  }, [navigation]);

  async function getData() {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const res = await axios.post('http://10.0.2.2:5000/userdata', {
          token,
        });
        console.log('of', res.data);
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
    Alert.alert('ยืนยันการออกจากระบบ', 'คุณแน่ใจหรือไม่ว่าต้องการออกจากระบบ?', [
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
                routes: [{name: 'Loginuser'}],
              });
            }
          } catch (error) {
            console.error('Error removing data:', error);
          }
        },
      },
    ]);
  }

  return (
    <View style={{flex: 1, justifyContent: 'space-between'}}>
      <ScrollView
        keyboardShouldPersistTaps={'always'}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 40}}
        // style={{backgroundColor: 'transparent'}}
        style={{backgroundColor: '#F5F5F5'}}>
       <View style={styless.profileCard}>
          {userData && (
            <TouchableOpacity onPress={() => navigation.navigate('User', { data: userData })} style={styless.profileWrapper}>
              <View style={styless.profilePic}>
                <Text style={styless.profileInitials}>
                  {userData.name?.charAt(0).toUpperCase()}
                  {userData.surname?.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={styless.profileText}>
                <Text style={styless.userName}>{userData.name} {userData.surname}</Text>
                <Text style={styless.userDetail}>ชื่อผู้ใช้: {userData.username}</Text>
              </View>
              <TouchableOpacity
                onPress={() => navigation.navigate('User', { data: userData })}
        style={styless.editButton}>
        {/* <Icon  name="edit"
                    color="#5AB9EA"
                    size={25}  /> */}
                                      <Ionicons name="chevron-forward" size={25} color="#5AB9EA" />
                    
      </TouchableOpacity>
            </TouchableOpacity>
          )}
        </View>

        <View style={styless.menuContainer}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Updatepassword', {data: userData})
            }
            style={styless.menuItem}>
            <Ionicons name="key-outline" color="black" style={styless.icon} />
            <Text style={styless.menuText}>เปลี่ยนรหัสผ่าน</Text>
          </TouchableOpacity>

          {/* <TouchableOpacity style={styless.menuItem}>
            <Ionicons
              name="headset-outline"
              color="black"
              style={styless.icon}
            />
            <Text style={styless.menuText}>ติดต่อเรา</Text>
          </TouchableOpacity> */}

          <TouchableOpacity
            onPress={logout}
            style={[styless.menuItem, styles.logoutButton]}>
            <MaterialIcons name="logout" color="red" style={styless.icon} />
            <Text style={styless.logoutText}>ออกจากระบบ</Text>
          </TouchableOpacity>
        </View>
        {/* <View style={style.container}>
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
          <TouchableOpacity
            style={{flexDirection: 'row', alignItems: 'center'}}>
            <Ionicons
              name="headset-outline"
              color="black"
              style={styles.smallIcon}
            />
            <Text style={styless.textprofile}>ติดต่อเรา</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={logout}
            style={{flexDirection: 'row', alignItems: 'center'}}>
            <MaterialIcons name="logout" color="red" style={styles.smallIcon} />
            <Text style={styless.textex}>ออกจากระบบ</Text>
          </TouchableOpacity>
        </View> */}
        {/* <TouchableOpacity style={styless.containerlogout} onPress={logout}>
   
        <Text style={styless.textex}>
          ออกจากระบบ
        </Text>
      </TouchableOpacity> */}
      </ScrollView>
    </View>
  );
}
const styless = StyleSheet.create({
  containeruser: {
    padding: 20,
    marginVertical: 10,
    marginHorizontal: 15,
    backgroundColor: 'white',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  textprofile: {
    color: 'black',
    fontFamily: 'Arial',
    fontSize: 16,
    fontWeight: 'normal',
    padding: 10,
  },
  textuser: {
    color: 'black',
    fontFamily: 'Arial',
    fontSize: 20,
    fontWeight: '700',
    paddingHorizontal: 5,
    // padding: 10,
  },
  textuserprofile: {
    color: 'black',
    fontFamily: 'Arial',
    fontSize: 16,
    paddingHorizontal: 5,
  },
  textex: {
    color: '#d9534f',
    fontFamily: 'Kanit-Regular',
    fontSize: 16,
    fontWeight: 'normal',
    padding: 8,
  },
  containerlogout: {
    // backgroundColor: '#d9534f',
    backgroundColor: '#FF6A6A',
    // backgroundColor: '#D3D3D3',
    padding: 10,
    borderRadius: 10,
    margin: 15,
    marginVertical: 1,
    elevation: 2,
  },
  container: {
    flex: 1,
  },
  profileCard: {
    padding: 20,
    margin: 15,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
    // elevation: 3,
  },
  profileWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePic: {
    width: 60,
    height: 60,
    borderRadius: 50,
    backgroundColor: '#5AB9EA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  profileInitials: {
    color: 'white',
    fontSize: 24,
    // fontWeight: 'bold',
    fontFamily: 'Kanit-SemiBold',

  },
  userName: {
    fontSize: 18,
    color: 'black',
    paddingVertical:4,
    fontFamily: 'Kanit-SemiBold',
  },
  userDetail: {
    fontSize: 16,
    color: '#555',
    paddingVertical:4,
    fontFamily: 'Kanit-Regular',
  },
  menuContainer: {
    marginHorizontal: 15,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 1 },
    // shadowOpacity: 0.1,
    // shadowRadius: 3,
    // elevation: 2,
  },
  icon: {
    fontSize: 22,
    marginRight: 10,
  },
  menuText: {
    fontSize: 16,
    color: 'black',
    fontFamily: 'Kanit-Regular',
  },
  logoutButton: {
    backgroundColor: '#fff5f5',
  },
  logoutText: {
    color: '#d9534f',
    fontSize: 16,
    fontFamily: 'Kanit-Regular',  
  },
  editButton: {
    position: 'absolute',
    bottom: 10,   // ชิดขอบล่าง
    right: 2,    // ชิดขอบขวา
    padding: 8,
    
  },
  IconUserSC: {
    fontSize: 25,
  },
});
export default ProfileScreen;
