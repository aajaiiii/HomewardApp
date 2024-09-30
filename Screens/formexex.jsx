import {
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
} from 'react-native';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import style from './style';
import Icon from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import RNPickerSelect from 'react-native-picker-select';
import styleform from './styleform';

export default function PatientForm({route}) {
  const [userData, setUserData] = useState('');
  const navigation = useNavigation();
  const [symptoms, setSymptoms] = useState([]);
  const [newSymptom, setNewSymptom] = useState('');
  const [showNewSymptomInput, setShowNewSymptomInput] = useState(false);
  const [symptomsArray, setSymptomsArray] = useState([{name: ''}]); // Array to hold selected symptoms
  const [userAge, setUserAge] = useState(0);
  const [userAgeInMonths, setUserAgeInMonths] = useState(0);

  async function getData() {
    const token = await AsyncStorage.getItem('token');
    axios
      .post('http://192.168.2.43:5000/userdata', {token: token})
      .then(res => {
        setUserData(res.data.data);
      });
  }

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const getSymptoms = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get(
          `http://192.168.2.43:5000/allSymptom`,
          {headers: {Authorization: `Bearer ${token}`}},
        );
        const data = response.data;
        setSymptoms(data.data);
      } catch (error) {
        console.error('Error fetching symptoms data:', error);
      }
    };
    getSymptoms();
  }, []);

  const AddSymptom = async () => {
    if (!newSymptom.trim()) {
      alert('กรุณากรอกอาการใหม่');
      return;
    }
    const formdata = {name: newSymptom};

    try {
      const response = await axios.post(
        'http://192.168.2.43:5000/addsymptom',
        formdata,
      );
      console.log(response.data);
      if (response.data.status === 'ok') {
        const updatedSymptoms = [...symptoms, {name: newSymptom}];
        setSymptoms(updatedSymptoms);
        setNewSymptom('');
        setShowNewSymptomInput(false);
      }
    } catch (error) {
      console.error('Error adding new symptom:', error);
    }
  };

  const Nextpage = () => {
    const formdata = {
      symptoms: symptomsArray.map(symptom => symptom.name),
      user: userData._id,
    };
    navigation.navigate('PatientForm2', {formData: formdata});
  };

  const removeSymptom = indexToRemove => {
    const updatedSymptomsArray = symptomsArray.filter(
      (_, index) => index !== indexToRemove,
    );
    setSymptomsArray(updatedSymptomsArray);
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
    <ScrollView
      keyboardShouldPersistTaps={'always'}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{paddingBottom: 40}}
      style={{backgroundColor: '#F7F7F7'}}>
      <View style={[styleform.container, {flex: 1, textAlign: 'center'}]}>
        <Text style={styleform.sectionHeader}>ข้อมูลผู้ป่วย</Text>
        <Text style={[styleform.text]}>
          ชื่อ-นามสกุล: {userData.name} {userData.surname}
        </Text>
        {userData && userData.birthday ? (
          <Text style={[styleform.text]}>
            อายุ: {userAge} ปี {userAgeInMonths} เดือน เพศ {userData.gender}
          </Text>
        ) : (
          <Text style={[styleform.text]}>
            0 ปี 0 เดือน เพศ {userData.gender}
          </Text>
        )}
      </View>

      <View style={[styleform.container, {flex: 1}]}>
        <Text style={styleform.sectionHeader}>อาการและอาการแสดง</Text>
        {symptomsArray.map((symptom, index) => (
          <View key={index}>
            <Text style={styleform.text}>อาการที่ {index + 1}</Text>
            <RNPickerSelect
              onValueChange={value => {
                if (
                  value !== null &&
                  !symptomsArray.some(item => item.name === value)
                ) {
                  const updatedSymptomsArray = [...symptomsArray];
                  updatedSymptomsArray[index] = {name: value};
                  setSymptomsArray(updatedSymptomsArray);
                  setShowNewSymptomInput(value === 'new_symptom');
                }
              }}
              value={symptom.name || null}
              items={[
                ...symptoms
                  .filter(
                    sym => !symptomsArray.some(item => item.name === sym.name),
                  )
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map(symptom => ({
                    label: symptom.name,
                    value: symptom.name,
                  })),
                {label: '+ เพิ่มอาการใหม่', value: 'new_symptom'},
              ]}
              style={pickerSelectStyles}
              placeholder={{label: 'เลือกอาการ', value: null}}
              useNativeAndroidPickerStyle={true}
              textStyle={pickerSelectStyles.itemStyle}>
              <View
                style={[
                  styles.textContainer,
                  (!symptom.name || symptom.name === 'new_symptom') && {
                    borderColor: '#999999',
                  },
                ]}>
                <Text
                  style={[
                    styleform.text,
                    (!symptom.name || symptom.name === 'new_symptom') && {
                      color: '#999999',
                    },
                  ]}>
                  {symptom.name === 'new_symptom'
                    ? '+ เพิ่มอาการใหม่'
                    : symptom.name || 'เลือกอาการ'}
                </Text>
              </View>
            </RNPickerSelect>

            {index > 0 && (
              <TouchableOpacity
                onPress={() => removeSymptom(index)}
                style={{position: 'absolute', top: 5, right: 10}}>
                <Text style={{color: 'black', fontSize: 16}}>x</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}

        <TouchableOpacity
          onPress={() => setSymptomsArray([...symptomsArray, {name: ''}])}>
          <Text style={{color: '#007BFF', marginTop: 10, marginLeft: 5}}>
            + เพิ่มอาการ
          </Text>
        </TouchableOpacity>

        {showNewSymptomInput && (
          <Modal>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <TextInput
                  style={styles.textInput}
                  placeholder="กรอกอาการใหม่"
                  value={newSymptom}
                  onChangeText={text => setNewSymptom(text)}
                />
                <View style={styles.buttonContent}>
                  <TouchableOpacity
                    style={styles.textCC}
                    onPress={() => {
                      setShowNewSymptomInput(false);
                    }}>
                    <Text style={styles.cancelButtonText}>ยกเลิก</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.textOk} onPress={AddSymptom}>
                    <Text style={styles.buttonText}>เพิ่ม</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        )}
      </View>

      <View style={styles.buttonnext}>
        <TouchableOpacity onPress={Nextpage} style={styles.next}>
          <View>
            <Text style={styles.textnext}>ถัดไป</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    borderWidth: 1,
    borderColor: '#DCDCDC',
    borderRadius: 10,
    paddingHorizontal: 8,
    marginTop: 1,
    height: 45,
    marginVertical: 4,
  },
  inputAndroid: {
    borderWidth: 1,
    borderColor: '#DCDCDC',
    borderRadius: 10,
    paddingHorizontal: 8,
    marginTop: 1,
    height: 45,
    marginVertical: 4,
  },
  placeholder: {
    color: 'gray',
    fontSize: 14, // Adjust placeholder font size
  },
  itemStyle: {
    fontSize: 16,
    color: 'black',
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
});

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#DCDCDC',
    borderRadius: 10,
    paddingHorizontal: 8,
    marginVertical: 10,
    height: 40,
  },
  textOk: {
    backgroundColor: '#87CEFA',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 3,
  },
  textCC: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#87CEFA',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 3,
  },
  buttonContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelButtonText: {
    color: '#87CEFA',
    fontWeight: 'bold',
  },

  buttonnext: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginHorizontal: 10,
    marginTop: 10,
  },
  next: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#87CEFA',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 70,
    borderRadius: 10,
    // flex: 1,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 3,
  },
  textnext: {
    color: '#87CEFA',
    fontWeight: 'bold',
  },
  textContainer: {
    padding: 5,
    borderWidth: 1,
    borderColor: '#DCDCDC',
    borderRadius: 10,
    paddingHorizontal: 8,
    marginTop: 1,
    height: 45,
    marginVertical: 4,
    flex: 1,
  },





  
});
