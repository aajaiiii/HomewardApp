import {
  StyleSheet,
  Image,
  Text,
  View,
  Button,
  TouchableOpacity,
  ScrollView,
  Linking,
  FlatList,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import styless from './style';
import {format} from 'date-fns';
export default function Assessment() {
  const navigation = useNavigation();
  const [userData, setUserData] = useState('');
  const [patientForms, setPatientForms] = useState('');
  const [assessments, setAssessments] = useState([]);
  const [sortOrder, setSortOrder] = useState('latest');

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
    if (userData) {
      fetchpatientForms();
      fetchAssessments();
    }
  }, [userData, sortOrder]);

  const fetchpatientForms = async () => {
    try {
      if (userData) {
        const response = await axios.get(
          `http://192.168.2.38:5000/getpatientforms/${userData._id}`,
        );
        const sortedForms = sortForms(response.data.data, sortOrder);
        setPatientForms(sortedForms);
      }
    } catch (error) {
      console.error('Error fetching caregiver info:', error);
    }
  };

  const fetchAssessments = async () => {
    try {
      const response = await axios.get(
        `http://192.168.2.38:5000/allAssessment`,
      );
      setAssessments(response.data.data);
    } catch (error) {
      console.error('Error fetching assessments:', error);
    }
  };

  const sortForms = (forms, order) => {
    return forms.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return order === 'latest' ? dateB - dateA : dateA - dateB;
    });
  };

  const toggleSortOrder = order => {
    setSortOrder(order);
  };
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
  const hasAssessment = patientFormId => {
    return assessments.some(
      assessment => assessment.PatientForm === patientFormId,
    );
  };

  const getAssessment = patientFormId => {
    return assessments.find(
      assessment => assessment.PatientForm === patientFormId,
    );
  };
  const renderItem = ({item}) => (
    <TouchableOpacity onPress={() => handlePress(item)} activeOpacity={0.7}>
      <View style={styles.listItem}>
        <Text style={styles.listItemText}>{formatDate(item.createdAt)}</Text>
        {/* <Text style={hasAssessment(item._id) ? styles.assessed : styles.notAssessed}>
                    <Text style={styles.statusLabel}>สถานะ:</Text> <Text>{hasAssessment(item._id) ? 'ประเมินแล้ว' : 'ยังไม่ได้ประเมิน'}</Text>
                </Text> */}
<Text style={getAssessment(item._id) ? getStatusStyle(getAssessment(item._id).status_name) : styles.notAssessed}>
  <Text style={styles.statusLabel}>ผลการประเมิน: </Text>
  <Text style={styles.statusText}>
    {getAssessment(item._id)
      ? getAssessment(item._id).status_name
      : 'ยังไม่ได้ประเมิน'}
  </Text>
</Text>

      </View>
    </TouchableOpacity>
  );

  const getStatusStyle = (status) => {
    switch (status) {
      case "ปกติ":
        return styles.normalStatus;
      case "ผิดปกติ":
        return styles.abnormalStatus;
      case "จบการรักษา":
        return styles.completedStatus;
      default:
        return styles.defaultStatus;
    }
  };

  
  const handlePress = (item) => {
      navigation.navigate('Assessmentitem', { selectedItem: item });
  };

  return (
    <View style={styles.container}>
      <View style={styles.sortOptions}>
        <TouchableOpacity onPress={() => toggleSortOrder('latest')}>
          <Text
            style={[
              styles.sortOption,
              sortOrder === 'latest' && styles.activeSort,
            ]}>
            ล่าสุด
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => toggleSortOrder('oldest')}>
          <Text
            style={[
              styles.sortOption,
              sortOrder === 'oldest' && styles.activeSort,
            ]}>
            เก่าสุด
          </Text>
        </TouchableOpacity>
      </View>
      {patientForms.length > 0 ? (
        <FlatList
          data={patientForms}
          keyExtractor={item => item._id}
          renderItem={renderItem}
        />
      ) : (
        <Text style={styles.noDataText}>ยังไม่มีการบันทึกอาการ</Text>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F7F7F7',
  },
  sortOptions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 16,
  },
  sortOption: {
    fontSize: 14,
    color: '#333',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 5,
  },
  activeSort: {
    backgroundColor: '#87CEFA',
    color: '#fff',
    borderWidth: 1,
    borderColor: '#87CEFA',
  },
  // list: {
  //     paddingBottom: 5,
  // },
  listItem: {
    marginBottom: 10,
    padding: 16,
    backgroundColor: '#fff',
    borderColor: '#6c757d',
    borderRadius: 8,
    shadowColor: '#6c757d',
    shadowOpacity: 2,
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 3,
    elevation: 1,
  },
  listItemText: {
    fontSize: 16,
    marginBottom: 8,
  },
  normalStatus: {
    color: 'green', // Color for normal status
  },
  abnormalStatus: {
    color: 'red', // Color for abnormal status
  },
  completedStatus: {
    color: 'blue', // Color for completed status
  },
  defaultStatus: {
    color: '#808080', // Default color if status is not recognized
  },
  statusLabel: {
    color: 'black',
    fontSize: 14,
  },

  noDataText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#6c757d',
  },
});