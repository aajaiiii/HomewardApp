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
        tabBarStyle: { display: 'none' },
      });
      // return () => {
      //   // แสดง TabBar กลับมาเมื่อออกจากหน้านี้
      //   navigation.getParent()?.setOptions({
      //     tabBarStyle: { display: 'flex' }, // ปรับ 'flex' ให้ TabBar กลับมาแสดง
      //   });
      // };
    }, [navigation])
  );
  
  
  useEffect(() => {
    // ฟัง event ของการกดปุ่ม Header Back (Navigate Up)
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if (e.data.action.type === 'POP') {
        // แสดง TabBar เมื่อกดปุ่ม Navigate Up
        navigation.getParent()?.setOptions({
          tabBarStyle: {  position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            elevation: 0,
            backgroundColor: '#fff',
            borderTopColor: 'transparent',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 6,
            height: 60,  },        });
      } else {
        // ซ่อน TabBar ถ้ากลับด้วยวิธีอื่นๆ เช่น navigation.goBack()
        navigation.getParent()?.setOptions({
          tabBarStyle: { display: 'none' },
        });
      }
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (isFocused) {
      getData();
      fetchAssessment();
    }
  }, [isFocused]);

  async function getData() {
    const token = await AsyncStorage.getItem('token');
    console.log(token);
    axios
      .post('http://10.53.57.175:5000/userdata', {token: token})
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
    } เวลา ${hours < 10 ? '0' + hours : hours}:${
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
          `http://10.53.57.175:5000/getassessment/${selectedItem._id}`,
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
          `http://10.53.57.175:5000/getmpersonnel/${assessment.MPersonnel}`,
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
    navigation.navigate('PatientFormEdit',{ id: selectedItem._id });
  };

  

  return (
    <LinearGradient
    // colors={['#00A9E0', '#5AB9EA', '#E0FFFF', '#FFFFFF']}
    colors={['#fff', '#fff']}

    style={{flex: 1}} // ให้ครอบคลุมทั้งหน้าจอ
  >
    <ScrollView
      keyboardShouldPersistTaps={'always'}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{paddingBottom: 60}}
      style={{backgroundColor: 'transparent'}}>
      <View style={styles.container}>
        <Text style={styles.dateText}>
          {formatDate(selectedItem.createdAt)}
        </Text>
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
        {!assessment && (
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
          )}
        <View style={styles.section}>
          <Text style={styleform.sectionHeader}>อาการและอาการที่แสดง</Text>
          {selectedItem.Symptoms && selectedItem.Symptoms.map((symptom, index) => (
            <View style={styles.row} key={index}>
              <Text style={styles.labelText}>{`อาการที่ ${index + 1}: `}</Text>
              <Text style={styles.infoText}>{symptom ? symptom : '-'}</Text>
            </View>
          ))}
          {/* <Text></Text> */}
          <Text style={styleform.sectionHeader}>สัญญาณชีพ</Text>
          <View style={styles.row}>
            <Text style={styles.labelText}>ความดันตัวบน:</Text>
            <Text style={styles.infoText}>{selectedItem.SBP ? selectedItem.SBP : '-'}</Text>
            <Text style={styles.infoText}>mmHg</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.labelText}>ความดันตัวล่าง:</Text>
            <Text style={styles.infoText}>{selectedItem.DBP ? selectedItem.DBP : '-'}</Text>
            <Text style={styles.infoText}>mmHg</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.labelText}>ชีพจร: </Text>
            <Text style={styles.infoText}>{selectedItem.PulseRate ? selectedItem.PulseRate : '-'}</Text>
            <Text style={styles.infoText}>ครั้ง/นาที</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.labelText}>อุณหภูมิ: </Text>
            <Text style={styles.infoText}>{selectedItem.Temperature ? selectedItem.Temperature : '-'}</Text>
            <Text style={styles.infoText}>°C</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.labelText}>ระดับน้ำตาลในเลือด:</Text>
            <Text style={styles.infoText}>{selectedItem.DTX ? selectedItem.DTX : '-'}</Text>
            <Text style={styles.infoText}>mg/dL</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.labelText}>การหายใจ:</Text>
            <Text style={styles.infoText}>{selectedItem.Respiration ? selectedItem.Respiration : '-'}</Text>
            <Text style={styles.infoText}>ครั้ง/นาที</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.labelText}>ความรุนแรงของอาการ:</Text>
            <Text style={styles.infoText}>{selectedItem.LevelSymptom ? selectedItem.LevelSymptom : '-'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.labelText}>ระดับความเจ็บปวด:</Text>
            <Text style={styles.infoText}>{selectedItem.Painscore ? selectedItem.Painscore : '-'}</Text>
          </View>
          <View >
            <Text style={styles.labelText}>
              สิ่งที่อยากให้ทีมแพทย์ช่วยเหลือเพิ่มเติม:
            </Text>
            <Text style={styles.infoText}>{selectedItem.request_detail ? selectedItem.request_detail : '-'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.labelText}>ผู้บันทึก:</Text>
            <Text style={styles.infoText}>{selectedItem.Recorder ? selectedItem.Recorder : '-'}</Text>
          </View>

        </View>

        {assessment && (
          <View style={styles.section}>
            <Text style={styleform.sectionHeader}>ผลการประเมิน</Text>
            <TouchableOpacity
              style={getStatusButtonStyle(assessment.status_name)}>
              <Text style={styles.buttonText}>{assessment.status_name}</Text>
            </TouchableOpacity>
            <View style={{flexDirection: 'row', alignItems: 'center',marginBottom: 5,}}>
              <Text style={styles.labelText}>PPS:</Text>
              <Text style={styles.infoTextFetched}>{assessment.PPS ? assessment.PPS : '-'}</Text>
            </View>
            {/* <View style={{flexDirection: 'row', alignItems: 'center',marginBottom: 5,}}>
            <Text style={styles.labelText}>รายละเอียด:</Text>
            <Text style={styles.infoTextFetched}>{assessment.detail}</Text>
            </View> */}
            <View style={{flexDirection: 'row', alignItems: 'center',marginBottom: 5,}}>
            <Text style={styles.labelText}>คำแนะนำจากแพทย์:</Text>
            <Text style={styles.infoTextFetched}>{assessment.suggestion ? assessment.suggestion : '-'}</Text>
            </View>
            {mpersonnel && (
            <View style={{flexDirection: 'row', alignItems: 'center',marginBottom: 5,}}>
            <Text style={styles.labelText}>ผู้ประเมิน:</Text>
              <Text style={styles.infoTextFetched}>
                {mpersonnel.nametitle ? mpersonnel.nametitle : '-'} {mpersonnel.name ? mpersonnel.name : '-'}{' '}
                {mpersonnel.surname ? mpersonnel.surname : '-'}
              </Text>
              </View>
           
            )}
              <View style={{flexDirection: 'row', alignItems: 'center',marginBottom: 5,}}>
            <Text style={styles.labelText}>วันที่ประเมิน:</Text>
            <Text style={styles.infoTextFetched}>{assessment.createdAt ? formatDate(assessment.createdAt) : '-'}</Text>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
    </LinearGradient>
  );
}


const styles = StyleSheet.create({
  rowhead: {
    alignItems: 'center',
  },
 icon:{
  fontSize: 20,
  marginRight:5,
  // marginLeft:10,
  // paddingBottom: 5,
  // marginBottom: 10,
 },
  container: {
    // padding: 16,
    // backgroundColor: '#F7F7F7',
  },
  dateText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop:15,
    marginVertical: 10,
    // color: '#333',
    color: '#000',

    fontWeight: '500',
  },
  labelText: {
    fontSize: 16,
    color: '#555',
    marginLeft: 7,
    fontWeight: '600',
  },
  infoTextFetched: {
    fontSize: 16,
    color: '#555',
    marginLeft: 7,
  },
  section: {
    padding: 15,
    marginVertical: 10,
    marginHorizontal: 10,
    backgroundColor: 'white',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 5,
    color: '#333',
    marginRight:10
  },
  infoText: {
    fontSize: 16,
    marginVertical: 6,
    fontFamily: 'Arial',
    color: '#555',
    marginLeft: 10,
  },
  statusNormal: {
    width: 150,
    marginLeft: 'auto',
    marginRight: 'auto',
    backgroundColor: '#72DA95',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  statusAbnormal: {
    width: 150,
    marginLeft: 'auto',
    marginRight: 'auto',
    backgroundColor: '#e7639a',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  statusComplete: {
    width: 150,
    marginLeft: 'auto',
    marginRight: 'auto',
    backgroundColor: '#FFCC80',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },

  statusEmergency: {
    width: 150,
    marginLeft: 'auto',
    marginRight: 'auto',
    backgroundColor: '#FF6A6A',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  statusDefault: {
    width: 150,
    marginLeft: 'auto',
    marginRight: 'auto',
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
    alignItems: 'center',
    marginBottom: 8,
  },
  buttonnext: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
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

