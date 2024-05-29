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

export default function Assessmentitem() {
  const route = useRoute();
  const selectedItem = route.params.selectedItem;
  const [userData, setUserData] = useState('');
  const [assessment, setAssessment] = useState('');
  const [mpersonnel, setMPersonnel] = useState('');
  const [userAge, setUserAge] = useState(0);
  const [userAgeInMonths, setUserAgeInMonths] = useState(0);

  async function getData() {
    const token = await AsyncStorage.getItem('token');
    console.log(token);
    axios
      .post('http://192.168.2.38:5000/userdata', {token: token})
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
          `http://192.168.2.38:5000/getassessment/${selectedItem._id}`,
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
          `http://192.168.2.38:5000/getmpersonnel/${assessment.MPersonnel}`,
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
      case 'จบการรักษา':
        return styles.statusComplete;
      default:
        return styles.statusDefault;
    }
  };
  return (
    <ScrollView
      keyboardShouldPersistTaps={'always'}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{paddingBottom: 40}}
      style={{backgroundColor: '#F7F7F7'}}>
      <View style={styles.container}>
        <Text style={styles.dateText}>
          {formatDate(selectedItem.createdAt)}
        </Text>
        <View style={styles.section}>

          <Text style={styles.sectionHeader}>ข้อมูลผู้ป่วย</Text>
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
              อายุ: {userAge} ปี {userAgeInMonths} เดือน
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
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>อาการและอาการที่แสดง</Text>
          {selectedItem.Symptom1 && (
            <View style={styles.row}>
              <Text style={styles.labelText}>อาการที่ 1: </Text>
              <Text style={styles.infoTextFetched}>
                {selectedItem.Symptom1}
              </Text>
            </View>
          )}
          {selectedItem.Symptom2 && (
            <View style={styles.row}>
              <Text style={styles.labelText}>อาการที่ 2: </Text>
              <Text style={styles.infoTextFetched}>
                {selectedItem.Symptom2}
              </Text>
            </View>
          )}
          {selectedItem.Symptom3 && (
            <View style={styles.row}>
              <Text style={styles.labelText}>อาการที่ 3: </Text>
              <Text style={styles.infoTextFetched}>
                {selectedItem.Symptom3}
              </Text>
            </View>
          )}
          {selectedItem.Symptom4 && (
            <View style={styles.row}>
              <Text style={styles.labelText}>อาการที่ 4: </Text>
              <Text style={styles.infoTextFetched}>
                {selectedItem.Symptom4}
              </Text>
            </View>
          )}
          {selectedItem.Symptom5 && (
            <View style={styles.row}>
              <Text style={styles.labelText}>อาการที่ 5: </Text>
              <Text style={styles.infoTextFetched}>
                {selectedItem.Symptom5}
              </Text>
            </View>
          )}
          <Text></Text>
          <Text style={styles.sectionHeader}>Vital signs</Text>
          <View style={styles.row}>
            <Text style={styles.labelText}>ความดันโลหิต:</Text>
            <Text style={styles.infoText}>{selectedItem.BloodPressure}</Text>
            <Text style={styles.infoText}>mmHg</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.labelText}>ชีพจร: </Text>
            <Text style={styles.infoText}>{selectedItem.PulseRate}</Text>
            <Text style={styles.infoText}>ครั้ง/นาที</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.labelText}>อุณหภูมิ: </Text>
            <Text style={styles.infoText}>{selectedItem.Temperature}</Text>
            <Text style={styles.infoText}>°C</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.labelText}>ระดับน้ำตาลในเลือด:</Text>
            <Text style={styles.infoText}>{selectedItem.DTX}</Text>
            <Text style={styles.infoText}>mg/dL</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.labelText}>การหายใจ:</Text>
            <Text style={styles.infoText}>{selectedItem.Resptration}</Text>
            <Text style={styles.infoText}>ครั้ง/นาที</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.labelText}>ความรุนแรงของอาการ:</Text>
            <Text style={styles.infoText}>{selectedItem.LevelSymptom}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.labelText}>ระดับความเจ็บปวด:</Text>
            <Text style={styles.infoText}>{selectedItem.Painscore}</Text>
          </View>
          <View >
            <Text style={styles.labelText}>
              สิ่งที่อยากให้ทีมแพทย์ช่วยเหลือเพิ่มเติม:
            </Text>
            <Text style={styles.infoText}>{selectedItem.request_detail}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.labelText}>ผู้บันทึก:</Text>
            <Text style={styles.infoText}>{selectedItem.Recorder}</Text>
          </View>
        </View>

        {assessment && (
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>ผลการประเมิน</Text>
            <TouchableOpacity
              style={getStatusButtonStyle(assessment.status_name)}>
              <Text style={styles.buttonText}>{assessment.status_name}</Text>
            </TouchableOpacity>
            <View style={{flexDirection: 'row', alignItems: 'center',marginBottom: 5,}}>
              <Text style={styles.labelText}>PPS:</Text>
              <Text style={styles.infoTextFetched}>{assessment.PPS}</Text>
            </View>
            {/* <View style={{flexDirection: 'row', alignItems: 'center',marginBottom: 5,}}>
            <Text style={styles.labelText}>รายละเอียด:</Text>
            <Text style={styles.infoTextFetched}>{assessment.detail}</Text>
            </View> */}
            <View style={{flexDirection: 'row', alignItems: 'center',marginBottom: 5,}}>
            <Text style={styles.labelText}>คำแนะนำจากแพทย์:</Text>
            <Text style={styles.infoTextFetched}>{assessment.suggestion}</Text>
            </View>
            {mpersonnel && (
            <View style={{flexDirection: 'row', alignItems: 'center',marginBottom: 5,}}>
            <Text style={styles.labelText}>ผู้ประเมิน:</Text>
              <Text style={styles.infoTextFetched}>
                {mpersonnel.nametitle} {mpersonnel.name}{' '}
                {mpersonnel.surname}
              </Text>
              </View>
           
            )}
              <View style={{flexDirection: 'row', alignItems: 'center',marginBottom: 5,}}>
            <Text style={styles.labelText}>วันที่ประเมิน:</Text>
            <Text style={styles.infoTextFetched}>{formatDate(assessment.createdAt)}</Text>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#F7F7F7',
  },
  dateText: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 10,
    color: '#333',
    fontWeight: '500',
  },
  labelText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 7,
    fontWeight: '600',
  },
  infoTextFetched: {
    fontSize: 14,
    color: '#555',
    marginLeft: 7,
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 8,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 5,
    color: '#333',
  },
  infoText: {
    fontSize: 14,
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
    backgroundColor: '#FF6A6A',
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
});

