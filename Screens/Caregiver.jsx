import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import style from './style';
import Toast from 'react-native-toast-message';
import {Picker} from '@react-native-picker/picker';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function Caregiver(props) {
  const navigation = useNavigation();
  console.log(props);
  const [userData, setUserData] = useState('');
  const isFocused = useIsFocused();
  const [caregiverInfo, setCaregiverInfo] = useState(null);
  const [userAge, setUserAge] = useState(0);
  const [userAgeInMonths, setUserAgeInMonths] = useState(0);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [caregivers, setCaregivers] = useState([]);

  useEffect(() => {
    if (isFocused) {
      getData();
      fetchCaregiverInfo();
    }
  }, [isFocused]);

  async function getData() {
    const token = await AsyncStorage.getItem('token');
    console.log(token);
    axios.post('http://10.0.2.2:5000/userdata', {token: token}).then(res => {
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

  const removeCaregiver = async index => {
    const caregiver = caregivers[index];
    Alert.alert(
      'ยืนยันการลบ',
      `คุณต้องการลบผู้ดูแล ${caregiver.name || 'นี้'} ใช่หรือไม่?`,
      [
        {
          text: 'ยกเลิก',
          style: 'cancel',
        },
        {
          text: 'ยืนยัน',
          onPress: async () => {
            try {
              if (caregiver._id) {
                // Call the backend to delete the caregiver
                await axios.post('http://10.0.2.2:5000/deletecaregiver', {
                  _id: caregiver._id,
                  userId: userData._id,
                });

                Toast.show({
                  type: 'success',
                  text1: 'สำเร็จ',
                  text2: 'ลบข้อมูลผู้ดูแลเรียบร้อยแล้ว',
                });
                fetchCaregiverInfo(); // Refresh caregiver list
              }
            } catch (error) {
              console.error('Error deleting caregiver:', error);
              Toast.show({
                type: 'error',
                text1: 'ล้มเหลว',
                text2: 'ไม่สามารถลบข้อมูลผู้ดูแลได้',
              });
            }
          },
        },
      ],
    );
  };

  const fetchCaregiverInfo = async () => {
    try {
      if (userData) {
        const response = await axios.get(
          `http://10.0.2.2:5000/getcaregiver/${userData._id}`,
        );
        setCaregiverInfo(response.data.data);
        setCaregivers(response.data.data);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setCaregiverInfo(null);
        setCaregivers([]);
      } else {
        console.error('Error fetching caregiver info:', error);
      }
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      // ซ่อน TabBar เมื่อเข้าหน้านี้
      navigation.getParent()?.setOptions({
        tabBarStyle: {display: 'none'},
      });
      // return () => {
      //   // แสดง TabBar กลับมาเมื่อออกจากหน้านี้
      //   navigation.getParent()?.setOptions({
      //     tabBarStyle: { display: 'flex' }, // ปรับ 'flex' ให้ TabBar กลับมาแสดง
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

  return (
    <View style={{flex: 1}}>
      <ScrollView
        keyboardShouldPersistTaps={'always'}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollView}>
        <View style={styles.container}>
          {caregiverInfo && caregiverInfo.length > 0 ? (
            caregiverInfo.map((caregiver, index) => (
              <View key={index} style={styles.cardContainerOut}>
                
                <View style={styles.cardHeaderIn}>
                    <Text style={styles.headerText}>
                      ผู้ดูแลที่ {index + 1}
                    </Text>
                    <View style={{ flexDirection: 'row', gap: 10 }}>
  <TouchableOpacity style={styles.editButton} onPress={() =>
    navigation.navigate('CaregiverEdit', { data: caregiver })}>
    <Icon name="edit" color="#5AB9EA" style={styles.IconUserSC} />
  </TouchableOpacity>
  <TouchableOpacity style={styles.deleteButton} onPress={() => removeCaregiver(index)}>
    <Icon name="trash-2" color="#fff" style={styles.IconUserSC} />
  </TouchableOpacity>
</View>

                </View>

                <View key={index} style={styles.cardContainer}>
                  <View style={styles.infoRow}>
                    <Text style={styles.textLabel}>เลขบัตรประชาชน</Text>
                    <Text style={styles.textValue}>
                      {caregiver.ID_card_number}
                    </Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Text style={styles.textLabel}>ชื่อ-นามสกุล</Text>
                    <Text style={styles.textValue}>
                      {(caregiver.name || '-') +
                        ' ' +
                        (caregiver.surname || '-')}
                    </Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Text style={styles.textLabel}>เกี่ยวข้องเป็น</Text>
                    <Text style={styles.textValue}>
                      {caregiver.userRelationships?.[0]?.relationship || '-'}
                    </Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Text style={styles.textLabel}>เบอร์โทรศัพท์</Text>
                    <Text style={styles.textValue}>{caregiver.tel || '-'}</Text>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.noDataContainer}>
              <Text style={styles.noDataText}>ไม่มีข้อมูลผู้ดูแล</Text>
            </View>
          )}
        </View>
        {/* <View style={styles.footerContainer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('CaregiverAdd')}>
          <Icon name="user-plus" size={20} color="#fff" />
          <Text style={styles.addButtonText}>เพิ่มผู้ดูแล</Text>
        </TouchableOpacity>
      </View> */}
      </ScrollView>
      <TouchableOpacity
        onPress={() => navigation.navigate('CaregiverAdd')}
        style={styles.addButton}>
        <Ionicons name="add" color="white" style={styles.IconAdd} />
        {/* <Text style={stylep.plusIcon}>+</Text> */}
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  scrollView: {
    paddingBottom: 40,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  cardContainerOut: {
    backgroundColor: '#fff',
    marginBottom: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#bbb',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  cardContainer: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 15,
  },
  cardHeaderIn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#5AB9EA',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  // cardHeader: {
  
  // },
  headerText: {
    fontSize: 18,
    color: '#fff',
    fontFamily: 'Kanit-SemiBold',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  textLabel: {
    fontSize: 16,
    color: 'gray',
    fontFamily: 'Kanit-Regular',
  },
  textValue: {
    fontSize: 16,
    color: 'black',
    fontFamily: 'Kanit-Regular',
    textAlign: 'right',
  },
  IconUserSC: {
    fontSize: 20,
  },
  noDataContainer: {
    alignItems: 'center',
    padding: 20,
  },
  noDataText: {
    fontSize: 18,
    color: 'gray',
    fontFamily: 'Kanit-Regular',
  },

  footerContainer: {
    // backgroundColor: '#fff', // พื้นหลังสีขาว
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 50,
    backgroundColor: '#42bd41',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Kanit-SemiBold',
    marginLeft: 10,
  },
  IconAdd: {
    fontSize: 28,
    fontWeight: '700',
  },
  editButton: {
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3, // เพิ่มเงาให้ปุ่มเด่นขึ้น
  },
  deleteButton: {
    backgroundColor: '#FF4D4D',
    padding: 5,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  IconUserSC: {
    fontSize: 20,
  },
});
