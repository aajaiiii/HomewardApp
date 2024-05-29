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

export default function PatientForm({ route }) {
  const [userData, setUserData] = useState('');
  const navigation = useNavigation();
  const [Symptom1, setSymptom1] = useState('');
  const [Symptom2, setSymptom2] = useState('');
  const [Symptom3, setSymptom3] = useState('');
  const [Symptom4, setSymptom4] = useState('');
  const [Symptom5, setSymptom5] = useState('');
  const [symptoms, setSymptoms] = useState([]);
  const [newSymptom, setNewSymptom] = useState('');
  const [showNewSymptomInput, setShowNewSymptomInput] = useState(false);
  // const [showNewSymptomInput2, setShowNewSymptomInput2] = useState(false);
  // const [showNewSymptomInput3, setShowNewSymptomInput3] = useState(false);
  // const [showNewSymptomInput4, setShowNewSymptomInput4] = useState(false);
  // const [showNewSymptomInput5, setShowNewSymptomInput5] = useState(false);
  const [selectedSymptom1, setSelectedSymptom1] = useState(null);
  const [selectedSymptom2, setSelectedSymptom2] = useState(null);
  const [selectedSymptom3, setSelectedSymptom3] = useState(null);
  const [selectedSymptom4, setSelectedSymptom4] = useState(null);
  const [selectedSymptom5, setSelectedSymptom5] = useState(null);
  const [PulseRate, setPulseRate] = useState('');
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
    const getSymptom = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get(
          `http://192.168.2.38:5000/allSymptom`,
          {headers: {Authorization: `Bearer ${token}`}},
        );
        const data = response.data;
        setSymptoms(data.data);
      } catch (error) {
        console.error('Error fetching care manual item data:', error);
      }
    };
    getSymptom();
  }, []);

  const AddSymptom = async () => {
    const formdata = {name: newSymptom};
    try {
      const response = await axios.post(
        'http://192.168.2.38:5000/addsymptom',
        formdata,
      );
      console.log(response.data);
      if (response.data.status === 'ok') {
        const updatedSymptoms = [...symptoms, {name: newSymptom}];
        setSymptoms(updatedSymptoms);
        setNewSymptom('');
        setShowNewSymptomInput(false);
        if (selectedSymptom1 === 'new_symptom1') {
          setSelectedSymptom1(null);
        }
        if (selectedSymptom2 === 'new_symptom2') {
          setSelectedSymptom2(null);
        }
        if (selectedSymptom3 === 'new_symptom3') {
          setSelectedSymptom3(null);
        }
        if (selectedSymptom4 === 'new_symptom4') {
          setSelectedSymptom4(null);
        }
        if (selectedSymptom5 === 'new_symptom5') {
          setSelectedSymptom5(null);
        }
      }
    } catch (error) {
      console.error('Error adding new symptom:', error);
    }
  };

  const Nextpage =  () => {
    const formdata = {
      Symptom1,
      Symptom2,
      Symptom3,
      Symptom4,
      Symptom5,
      user: userData._id,
    };
    navigation.navigate('PatientForm2', {formData: formdata});
  };

  const currentDate = new Date();

  useEffect(() => {
    if (userData && userData.birthday) {
      const userBirthday = new Date(userData.birthday);
      const ageDiff = currentDate.getFullYear() - userBirthday.getFullYear();
      const monthDiff = currentDate.getMonth() - userBirthday.getMonth();
      setUserAgeInMonths(monthDiff >= 0 ? monthDiff : 12 + monthDiff);

      if (monthDiff < 0 || (monthDiff === 0 && currentDate.getDate() < userBirthday.getDate())) {
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
      style={{ backgroundColor: '#F7F7F7'}}>
      <View style={[styleform.container, {flex: 1, textAlign: 'center'}]}>
      <Text style={styleform.sectionHeader}>ข้อมูลผู้ป่วย</Text>
        <Text style={[styleform.text]}>
         ชื่อ-นามสกุล: {userData.name} {userData.surname}
        </Text>
        {userData && userData.birthday ? (
        <Text style={[styleform.text]}>
        อายุ: {userAge} ปี {userAgeInMonths} เดือน 
        เพศ {userData.gender}
  </Text>
) : (
  <Text style={[styleform.text]}>0 ปี 0 เดือน  เพศ {userData.gender}</Text>
)}
      </View>
      <View style={[styleform.container, {flex: 1}]}>
        <Text style={styleform.sectionHeader}>อาการและอาการแสดง</Text>

        <View>
          <Text style={styleform.text}>อาการที่ 1</Text>
          <RNPickerSelect
            onValueChange={value => {
              setSelectedSymptom1(value);
              if (value === 'new_symptom1') {
                setShowNewSymptomInput(true);
              } else {
                setSymptom1(value);
              }
            }}
            value={selectedSymptom1}
            items={[
              ...symptoms
                .filter(
                  symptom =>
                    ![Symptom2, Symptom3, Symptom4, Symptom5].includes(
                      symptom.name,
                    ),
                )
                .map(symptom => ({
                  label: symptom.name,
                  value: symptom.name,
                })),
              {label: 'เพิ่มอาการใหม่', value: 'new_symptom1'},
            ]}
            style={pickerSelectStyles}
            placeholder={{label: 'เลือกอาการ', value: null}}
            useNativeAndroidPickerStyle={false}
            textStyle={pickerSelectStyles.itemStyle}

          />
        </View>

        <Modal
          visible={showNewSymptomInput}
          animationType="slide"
          transparent={true}>
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
                    if (selectedSymptom1 === 'new_symptom1') {
                      setSelectedSymptom1(null);
                    }
                    if (selectedSymptom2 === 'new_symptom2') {
                      setSelectedSymptom2(null);
                    }
                    if (selectedSymptom3 === 'new_symptom3') {
                      setSelectedSymptom3(null);
                    }
                    if (selectedSymptom4 === 'new_symptom4') {
                      setSelectedSymptom4(null);
                    }
                    if (selectedSymptom5 === 'new_symptom5') {
                      setSelectedSymptom5(null);
                    }
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

        <View>
          <Text style={styleform.text}>อาการที่ 2</Text>
          <RNPickerSelect
            onValueChange={value => {
              setSelectedSymptom2(value);
              if (value === 'new_symptom2') {
                setShowNewSymptomInput(true);
              } else {
                setSymptom2(value);
              }
            }}
            value={selectedSymptom2}
            items={[
              ...symptoms
                .filter(
                  symptom =>
                    ![Symptom1, Symptom3, Symptom4, Symptom5].includes(
                      symptom.name,
                    ),
                )
                .map(symptom => ({
                  label: symptom.name,
                  value: symptom.name,
                })),
              {label: 'เพิ่มอาการใหม่', value: 'new_symptom2'},
            ]}
            style={pickerSelectStyles}
            placeholder={{label: 'เลือกอาการ', value: null}}
            useNativeAndroidPickerStyle={false}
          />
        </View>
        <View>
          <Text style={styleform.text}>อาการที่ 3</Text>
          <RNPickerSelect
            onValueChange={value => {
              setSelectedSymptom3(value);
              if (value === 'new_symptom3') {
                setShowNewSymptomInput(true);
              } else {
                setSymptom3(value);
              }
            }}
            value={selectedSymptom3}
            items={[
              ...symptoms
                .filter(
                  symptom =>
                    ![Symptom1, Symptom2, Symptom4, Symptom5].includes(
                      symptom.name,
                    ),
                )
                .map(symptom => ({
                  label: symptom.name,
                  value: symptom.name,
                })),
              {label: 'เพิ่มอาการใหม่', value: 'new_symptom3'},
            ]}
            style={pickerSelectStyles}
            placeholder={{label: 'เลือกอาการ', value: null}}
            useNativeAndroidPickerStyle={false}
          />
        </View>
        <View>
          <Text style={styleform.text}>อาการที่ 4</Text>
          <RNPickerSelect
            onValueChange={value => {
              setSelectedSymptom4(value);
              if (value === 'new_symptom4') {
                setShowNewSymptomInput(true);
              } else {
                setSymptom4(value);
              }
            }}
            value={selectedSymptom4}
            items={[
              ...symptoms
                .filter(
                  symptom =>
                    ![Symptom1, Symptom3, Symptom2, Symptom5].includes(
                      symptom.name,
                    ),
                )
                .map(symptom => ({
                  label: symptom.name,
                  value: symptom.name,
                })),
              {label: 'เพิ่มอาการใหม่', value: 'new_symptom4'},
            ]}
            style={pickerSelectStyles}
            placeholder={{label: 'เลือกอาการ', value: null}}
            useNativeAndroidPickerStyle={false}
          />
        </View>
        <View>
          <Text style={styleform.text}>อาการที่ 5</Text>
          <RNPickerSelect
            onValueChange={value => {
              setSelectedSymptom5(value);
              if (value === 'new_symptom5') {
                setShowNewSymptomInput(true);
              } else {
                setSymptom5(value);
              }
            }}
            value={selectedSymptom5}
            items={[
              ...symptoms
                .filter(
                  symptom =>
                    ![Symptom1, Symptom3, Symptom4, Symptom2].includes(
                      symptom.name,
                    ),
                )
                .map(symptom => ({
                  label: symptom.name,
                  value: symptom.name,
                })),
              {label: 'เพิ่มอาการใหม่', value: 'new_symptom5'},
            ]}
            style={pickerSelectStyles}
            placeholder={{label: 'เลือกอาการ', value: null}}
            useNativeAndroidPickerStyle={false}
          />
        </View>
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
    shadowOffset: { width: 0, height: 2 },
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
    shadowOffset: { width: 0, height: 2 },
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
    shadowOffset: { width: 0, height: 2 },
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 3,
  },
  textnext: {
    color: '#87CEFA',
    fontWeight: 'bold',
  },


});
