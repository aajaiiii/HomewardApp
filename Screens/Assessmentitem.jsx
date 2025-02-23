import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {useRoute} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import style from './style';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import styleform from './styleform';
import {useFocusEffect} from '@react-navigation/native';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';

export default function Assessmentitem(props) {
  const route = useRoute();
  const navigation = useNavigation();
  console.log(props);
  const selectedItem = route.params.selectedItem;
  const [userData, setUserData] = useState('');
  const [assessment, setAssessment] = useState('');
  const [mpersonnel, setMPersonnel] = useState('');
  const [userAge, setUserAge] = useState(0);
  const [userAgeInMonths, setUserAgeInMonths] = useState(0);
  const isFocused = useIsFocused();

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

  // useEffect(() => {
  //   const unsubscribe = navigation.addListener('beforeRemove', (e) => {
  //     if (e.data.action.type === 'POP') {
  //       navigation.getParent()?.setOptions({
  //         tabBarStyle: {  position: 'absolute',
  //           bottom: 0,
  //           left: 0,
  //           right: 0,
  //           elevation: 0,
  //           backgroundColor: '#fff',
  //           borderTopColor: 'transparent',
  //           shadowColor: '#000',
  //           shadowOffset: { width: 0, height: -2 },
  //           shadowOpacity: 0.1,
  //           shadowRadius: 6,
  //           height: 60,  },        });
  //     } else {
  //       navigation.getParent()?.setOptions({
  //         tabBarStyle: { display: 'none' },
  //       });
  //     }
  //   });

  //   return unsubscribe;
  // }, [navigation]);

  useEffect(() => {
    if (isFocused) {
      getData();
      fetchAssessment();
    }
  }, [isFocused]);

  async function getData() {
    const token = await AsyncStorage.getItem('token');
    console.log(token);
    axios.post('http://10.0.2.2:5000/userdata', {token: token}).then(res => {
      console.log(res.data);
      setUserData(res.data.data);
      console.log(userData);
    });
  }

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    fetchAssessment();
  }, [selectedItem]);

  const formatDate = dateTimeString => {
    const dateTime = new Date(dateTimeString);
    const day = dateTime.getDate();
    const month = dateTime.getMonth() + 1;
    const year = dateTime.getFullYear();
    const hours = dateTime.getHours();
    const minutes = dateTime.getMinutes();

    const thaiMonths = [
      'มกราคม',
      'กุมภาพันธ์',
      'มีนาคม',
      'เมษายน',
      'พฤษภาคม',
      'มิถุนายน',
      'กรกฎาคม',
      'สิงหาคม',
      'กันยายน',
      'ตุลาคม',
      'พฤศจิกายน',
      'ธันวาคม',
    ];

    return `${day < 10 ? '0' + day : day} ${thaiMonths[month - 1]} ${
      year + 543
    }`;
  };
  const formatTime= dateTimeString => {
    const dateTime = new Date(dateTimeString);
    const hours = dateTime.getHours();
    const minutes = dateTime.getMinutes();

 

    return `เวลา ${hours < 10 ? '0' + hours : hours}:${
      minutes < 10 ? '0' + minutes : minutes
    } น.`;
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

  const fetchAssessment = async () => {
    try {
      if (selectedItem) {
        const response = await axios.get(
          `http://10.0.2.2:5000/getassessment/${selectedItem._id}`,
        );
        const assessmentData = response.data.data;
        setAssessment(assessmentData);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log('ไม่พบข้อมูลการประเมิน');
      } else {
        console.error('Error fetching assessment info:', error);
      }
    }
  };

  useEffect(() => {
    // if (assessment) {
    fetchMpersonnel();
    // }
  }, [assessment]);

  const fetchMpersonnel = async () => {
    try {
      if (assessment && assessment.MPersonnel) {
        const response = await axios.get(
          `http://10.0.2.2:5000/getmpersonnel/${assessment.MPersonnel}`,
        );
        setMPersonnel(response.data);
        console.log('แพทย์', response.data);
      } else {
        console.log('MPersonnel ID is undefined or null');
      }
    } catch (error) {
      console.error('Error fetching mpersonnel info:', error);
    }
  };

  const getStatusButtonStyle = status => {
    switch (status) {
      case 'ปกติ':
        return styles.statusNormal;
      case 'ผิดปกติ':
        return styles.statusAbnormal;
      case 'เคสฉุกเฉิน':
        return styles.statusEmergency;
      case 'จบการรักษา':
        return styles.statusComplete;
      default:
        return styles.statusDefault;
    }
  };
  const handleEditSymptoms = () => {
    navigation.navigate('PatientFormEdit', {id: selectedItem._id});
  };

  return (
    <View style={{flex: 1}}>
      <ScrollView
        keyboardShouldPersistTaps={'always'}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 25}}
        style={{backgroundColor: 'transparent'}}>
        {/* <Text style={styles.dateText}>
          {formatDate(selectedItem.createdAt)}
        </Text> */}
        {/* <View style={styles.section}>

          <Text style={styleform.sectionHeader}>ข้อมูลผู้ป่วย</Text>
          <View style={styles.row}>
          <Text style={styles.labelText}>ชื่อ-นามสกุล: </Text>

          <Text style={styles.infoText}>
            {userData.name} {userData.surname}
          </Text>
          </View>
          {userData && userData.birthday ? (
              <View style={styles.row}>
              <Text style={styles.labelText}>อายุ: </Text>
    
            <Text style={styles.infoText}>
              {userAge} ปี {userAgeInMonths} เดือน
            </Text>
            </View>
          ) : (

            <View style={styles.row}>
            <Text style={styles.labelText}>อายุ: </Text>
          <Text style={styles.infoText}>
            อายุ: 0 ปี 0 เดือน
          </Text>
          </View>
         
            
          )}
        </View> */}
        {/* {!assessment && (
        <View style={styles.buttonnext}>
        <TouchableOpacity  style={styles.editButton} 
              onPress={handleEditSymptoms}>
           <Icon
            name="edit"
            color="white"
            style={styles.icon}
          />
            <Text style={styles.textnext}>แก้ไขการบันทึก</Text>
        </TouchableOpacity> 
            </View>
          )} */}

        <View style={styles.section}>
          <View style={styles.containeredit}>
            <Text style={styles.sectionHeaders}>ข้อมูลบันทึกอาการ</Text>
            {!assessment && (
              <View style={styles.buttonnext}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={handleEditSymptoms}>
                  <Icon name="edit" color="white" style={styles.icon} />
                  {/* <Text style={styles.textnext}>แก้ไขการบันทึก</Text> */}
                </TouchableOpacity>
              </View>
            )}
          </View>
          <View style={styles.container}>
            <View style={styles.dateContainer}>
              <Material
                name="calendar-month-outline"
                size={30}
                color="#42A5F5"
                style={styles.dateIcon}
              />
              <Text style={styles.textDate}>
                {formatDate(selectedItem.createdAt)}
              </Text>
            </View>
            <Text style={styles.sectionHeader}>อาการและอาการที่แสดง</Text>
            {selectedItem.Symptoms &&
              selectedItem.Symptoms.map((symptom, index) => (
                <View style={styles.row} key={index}>
                  <Text style={styles.labelText}>{`อาการที่ ${
                    index + 1
                  }: `}</Text>
                  <Text style={styles.infoText}>{symptom ? symptom : '-'}</Text>
                  <Text style={styles.unitText}></Text>
                </View>
              ))}
            {/* <Text></Text> */}
            <Text style={styles.sectionHeader}>สัญญาณชีพ</Text>
            <View style={styles.row}>
              <Text style={styles.labelText}>อุณหภูมิ: </Text>
              <Text style={styles.infoText}>
                {selectedItem.Temperature ? selectedItem.Temperature : '-'}
              </Text>
              <Text style={styles.unitText}>°C</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.labelText}>ความดันตัวบน:</Text>
              <Text style={styles.infoText}>
                {selectedItem.SBP ? selectedItem.SBP : '-'}
              </Text>
              <Text style={styles.unitText}>mmHg</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.labelText}>ความดันตัวล่าง:</Text>
              <Text style={styles.infoText}>
                {selectedItem.DBP ? selectedItem.DBP : '-'}
              </Text>
              <Text style={styles.unitText}>mmHg</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.labelText}>ชีพจร: </Text>
              <Text style={styles.infoText}>
                {selectedItem.PulseRate ? selectedItem.PulseRate : '-'}
              </Text>
              <Text style={styles.unitText}>ครั้ง/นาที</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.labelText}>ระดับน้ำตาลในเลือด:</Text>
              <Text style={styles.infoText}>
                {selectedItem.DTX ? selectedItem.DTX : '-'}
              </Text>
              <Text style={styles.unitText}>mg/dL</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.labelText}>การหายใจ:</Text>
              <Text style={styles.infoText}>
                {selectedItem.Respiration ? selectedItem.Respiration : '-'}
              </Text>
              <Text style={styles.unitText}>ครั้ง/นาที</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.labelText}>ความรุนแรงของอาการ:</Text>
              <Text style={styles.infoText}>
                {selectedItem.LevelSymptom ? selectedItem.LevelSymptom : '-'}
              </Text>
              <Text style={styles.unitText}></Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.labelText}>ระดับความเจ็บปวด:</Text>
              <Text style={styles.infoText}>
                {selectedItem.Painscore ? selectedItem.Painscore : '-'}
              </Text>
              <Text style={styles.unitText}></Text>
            </View>
            <View>
              <Text style={styles.labelText}>
                สิ่งที่อยากให้ทีมแพทย์ช่วยเหลือเพิ่มเติม:
              </Text>
              <View style={styles.requestContainer}>
              <Text style={styles.requestText}>
                {selectedItem.request_detail
                  ? selectedItem.request_detail
                  : '-'}
              </Text>
              </View>
            </View>
            <View style={styles.row}>
              <Text style={styles.labelText}>ผู้บันทึก:</Text>
              
              <Text style={styles.infoText}>
                {selectedItem.Recorder ? selectedItem.Recorder : '-'}
              </Text>
              <Text style={styles.unitText}></Text>
            </View>
          </View>
          </View>
          {assessment && (
            <View style={styles.section}>
               <View style={styles.containeredit}>
            <Text style={styles.sectionHeaders}>ผลการประเมิน</Text>
            {!assessment && (
              <View style={styles.buttonnext}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={handleEditSymptoms}>
                  <Icon name="edit" color="white" style={styles.icon} />
                  {/* <Text style={styles.textnext}>แก้ไขการบันทึก</Text> */}
                </TouchableOpacity>
              </View>
            )}
          </View>
          <View style={styles.container}>
          <View style={styles.row}>
          <Text style={styles.labelText}>ผลการประเมิน:</Text>
              <TouchableOpacity
                style={getStatusButtonStyle(assessment.status_name)}>
                <Text style={styles.buttonText}>{assessment.status_name}</Text>
              </TouchableOpacity>
              </View>
              {/* <View style={{flexDirection: 'row', alignItems: 'center',marginBottom: 5,}}>
              <Text style={styles.labelText}>PPS:</Text>
              <Text style={styles.infoTextFetched}>{assessment.PPS ? assessment.PPS : '-'}</Text>
            </View> */}
              {/* <View style={{flexDirection: 'row', alignItems: 'center',marginBottom: 5,}}>
            <Text style={styles.labelText}>รายละเอียด:</Text>
            <Text style={styles.infoTextFetched}>{assessment.detail}</Text>
            </View> */}
             <View>
                <Text style={styles.labelTextFetched}>คำแนะนำจากแพทย์:</Text>
                <View style={styles.requestContainer}>
                <Text style={styles.requestText}>
                  {assessment.suggestion ? assessment.suggestion : '-'}
                </Text>
                </View>
                </View>
              {mpersonnel && (
              <View style={styles.row}>
                  <Text style={styles.labelTextFetched}>ผู้ประเมิน:</Text>
                  <Text style={styles.infoTextFetched}>
                    {mpersonnel.nametitle ? mpersonnel.nametitle : '-'}{' '}
                    {mpersonnel.name ? mpersonnel.name : '-'}{' '}
                    {mpersonnel.surname ? mpersonnel.surname : '-'}
                  </Text>
                </View>
              )}
              <View style={styles.rowDate}>
                <Text style={styles.labelTextDate}>วันที่ประเมิน:</Text>
                <View style={styles.rowDateIn}>
                <Text style={styles.infoTextDate}>
                  {assessment.createdAt
                    ? formatDate(assessment.createdAt)
                    : '-'}
                </Text>
                <Text style={styles.infoTextDate}>
                     {assessment.createdAt
                    ? formatTime(assessment.createdAt)
                    : '-'}
                </Text>
                </View>
              </View>
            </View>
            </View>
          )}
        
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  rowhead: {
    alignItems: 'center',
  },
  container: {
    paddingHorizontal:15,
    paddingVertical:5,
    // padding: 16,
    // backgroundColor: '#F7F7F7',
  },
  dateText: {
    fontSize: 16,
    textAlign: 'center',
    // color: '#333',
    color: '#000',
    fontFamily: 'Kanit-Medium',
  },

  section: {
    // padding: 15,
    // marginTop: 105,
    marginVertical: 10,
    marginHorizontal: 15,
    backgroundColor: 'white',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#eee', // เปลี่ยนเป็นสีเทาอ่อน
    // marginBottom: 40,
    shadowColor: '#bbb',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  sectionHeaders: {
    fontSize: 18,
    fontFamily: 'Kanit-Medium',
    color: '#fff',
  },
  sectionHeader: {
    fontSize: 18,
    color: '#42A5F5',
    fontFamily: 'Kanit-Medium',
    marginBottom: 10,
    paddingBottom: 5,
    borderBottomWidth: 1.6,
    borderBottomColor: '#42A5F5',
    shadowColor: '#bbb',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },

  containeredit: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#42A5F5',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  labelTextFetched: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'Kanit-Regular',
    flex: 2,
  },
  infoTextFetched: {
    fontSize: 16,
    color: '#000',
    fontFamily: 'Kanit-Medium',
    flex: 4 ,
  },
  labelText: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'Kanit-Regular',
    flex: 4,
  },
  infoText: {
    fontSize: 16,
    fontFamily: 'Kanit-Medium',
    color: '#000',
    flex: 2,
  },
  unitText: {
    fontSize: 16,
    color: '#555',
    flex: 2,

    textAlign: 'right',
    fontFamily: 'Kanit-Regular',
  },
  statusNormal: {
    width: 100,
    marginRight:100,
    flex: 4,
    backgroundColor: '#72DA95',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
   
  },
  statusAbnormal: {
    width: 100,
    marginRight:100,
    flex: 4,
    backgroundColor: '#fb8c00',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  statusComplete: {
    width: 100,
    marginRight:100,
    flex: 4,
    backgroundColor: '#757575',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },

  statusEmergency: {
    width: 100,
    marginRight:100,
    flex: 4,
    backgroundColor: '#FF6A6A',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  statusDefault: {
    width: 120,
    marginRight:80,
    flex: 4,
    backgroundColor: '#9E9E9E',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 6,
    paddingHorizontal: 3,
    // borderBottomWidth: 1,
    // borderBottomColor: '#ddd',
  },
  buttonnext: {
    marginLeft: 10,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    marginHorizontal: 5,
    // paddingVertical: 10,
    // paddingHorizontal: 20,
    // shadowColor: '#000',
    // shadowOffset: {width: 0, height: 2},
    // shadowOpacity: 0.8,
    // shadowRadius: 2,
    // elevation: 3,
    // backgroundColor: '#42A5F5',
    // borderWidth: 1,
    // borderColor: '#42A5F5',
  },
  textnext: {
    color: '#fff',
    fontWeight: 'bold',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 3,
    // marginTop: 10,
    marginRight: 8,
  },
  dateIcon: {
    marginRight: 8,
  },
  textDate: {
    fontSize: 16,
    fontFamily: 'Kanit-Regular',
    color: '#000',
  },
  icon:{
    fontSize: 22,
  },
  requestContainer: {
    marginVertical: 12, // เพิ่มระยะห่างระหว่างส่วนต่างๆ
    padding: 15,
    backgroundColor: '#F7F7F7', // ใช้พื้นหลังอ่อนๆ
    borderRadius: 10, // ขอบโค้งมนเพื่อความทันสมัย
  },
  requestText:{
    fontSize: 16,
    color: '#000',
    fontFamily: 'Kanit-Medium',
    lineHeight: 22, 
  },
  rowDate: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingVertical: 6,
    paddingHorizontal: 3,
    // borderBottomWidth: 1,
    // borderBottomColor: '#ddd',
  },
  labelTextDate: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'Kanit-Regular',
    flex: 2,
  },
  rowDateIn:{
    flex: 4,
  },
  infoTextDate: {
    fontSize: 16,
    color: '#000',
    fontFamily: 'Kanit-Medium', 
  },
});
