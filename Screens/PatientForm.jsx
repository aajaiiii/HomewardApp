import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styleform from './styleform';

const CustomPicker = ({ items, onValueChange, placeholder, selectedValue }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState(items);

  useEffect(() => {
    setFilteredItems(
      items.filter(item =>
        item.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, items]);

  return (
    <View>
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.input}>
        <Text style={styles.inputText}>
          {selectedValue ? selectedValue : placeholder}
        </Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainersearch}>
          <View style={styles.searchBar}>
            <TextInput
              style={styles.searchInput}
              placeholder="ค้นหาอาการ"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {filteredItems.length > 0 ? (
            <FlatList
              data={filteredItems}
              keyExtractor={item => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.item}
                  onPress={() => {
                    onValueChange(item.value);
                    setModalVisible(false);
                  }}>
                  <Text style={styles.labelitem}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          ) : (
            <Text style={styles.noResultsText}>ไม่มีอาการ</Text>
          )}
          <TouchableOpacity onPress={() => setModalVisible(false)}>
            <Text style={styles.cancelButton}>ยกเลิก</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default function PatientForm({ route }) {
  const [userData, setUserData] = useState('');
  const navigation = useNavigation();
  const [symptoms, setSymptoms] = useState([]);
  const [newSymptom, setNewSymptom] = useState('');
  const [showNewSymptomInput, setShowNewSymptomInput] = useState(false);
  const [symptomsArray, setSymptomsArray] = useState([{ name: '' }]);
  const [userAge, setUserAge] = useState(0);
  const [userAgeInMonths, setUserAgeInMonths] = useState(0);
  const [selectedSymptoms, setSelectedSymptoms] = useState(['']);

  async function getData() {
    const token = await AsyncStorage.getItem('token');
    axios
      .post('http://192.168.2.43:5000/userdata', { token: token })
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
        const response = await axios.get('http://192.168.2.43:5000/allSymptom', {
          headers: { Authorization: `Bearer ${token}` },
        });
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
    if (symptoms.some(symptom => symptom.name.toLowerCase() === newSymptom.trim().toLowerCase())) {
      alert('อาการที่คุณเพิ่มมีอยู่แล้ว');
      return;
    }
    const formdata = { name: newSymptom };

    try {
      const response = await axios.post('http://192.168.2.43:5000/addsymptom', formdata);
      console.log(response.data);
      if (response.data.status === 'ok') {
        const updatedSymptoms = [...symptoms, { name: newSymptom }];
        setSymptoms(updatedSymptoms);
        const index = symptomsArray.length - 1;
        const updatedSymptomsArray = [...symptomsArray];
        updatedSymptomsArray[index] = { name: newSymptom };
        setSymptomsArray(updatedSymptomsArray);
        const updatedSelectedSymptoms = [...selectedSymptoms];
        updatedSelectedSymptoms[index] = newSymptom;
        setSelectedSymptoms(updatedSelectedSymptoms);
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
    navigation.navigate('PatientForm2', { formData: formdata });
  };

  const removeSymptom = indexToRemove => {
    const updatedSymptomsArray = symptomsArray.filter((_, index) => index !== indexToRemove);
    setSymptomsArray(updatedSymptomsArray);
    const updatedSelectedSymptoms = selectedSymptoms.filter((_, index) => index !== indexToRemove);
    setSelectedSymptoms(updatedSelectedSymptoms);
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

  const handleValueChange = (value, index) => {
    const updatedSymptomsArray = [...symptomsArray];
    updatedSymptomsArray[index] = { name: value };
    setSymptomsArray(updatedSymptomsArray);
    const updatedSelectedSymptoms = [...selectedSymptoms];
    updatedSelectedSymptoms[index] = value;
    setSelectedSymptoms(updatedSelectedSymptoms);
    if (value === 'new_symptom') {
      setShowNewSymptomInput(true);
    } else {
      setShowNewSymptomInput(false);
    }
  };
  return (
    <ScrollView
      keyboardShouldPersistTaps={'always'}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 40 }}
      style={{ backgroundColor: '#F7F7F7' }}>
      <View style={[styles.container, { flex: 1, textAlign: 'center' }]}>
        <Text style={styleform.sectionHeader}>ข้อมูลผู้ป่วย</Text>
        <Text style={[styles.text]}>
          ชื่อ-นามสกุล: {userData.name} {userData.surname}
        </Text>
        {userData && userData.birthday ? (
          <Text style={[styles.text]}>
            อายุ: {userAge} ปี {userAgeInMonths} เดือน เพศ {userData.gender}
          </Text>
        ) : (
          <Text style={[styles.text]}>
            0 ปี 0 เดือน เพศ {userData.gender}
          </Text>
        )}
      </View>

      <View style={[styles.container, { flex: 1 }]}>
        <Text style={styleform.sectionHeader}>อาการและอาการแสดง</Text>

        {symptomsArray.map((symptom, index) => (
          <View key={index}>
            <Text style={styles.text}>อาการที่ {index + 1}</Text>
            <CustomPicker
              items={[
                ...symptoms
                  .filter(sym => !symptomsArray.some(item => item.name === sym.name))
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map(symptom => ({
                    label: symptom.name,
                    value: symptom.name,
                  })),
                { label: '+ เพิ่มอาการใหม่', value: 'new_symptom' },
              ]}
              onValueChange={(value) => handleValueChange(value, index)}
              placeholder="เลือกอาการ"
              selectedValue={selectedSymptoms[index]}
              index={index}
            />
            {index > 0 && (
              <TouchableOpacity
                onPress={() => removeSymptom(index)}
                style={{ position: 'absolute', top: 5, right: 10 }}>
                <Text style={{ color: 'black', fontSize: 16 }}>x</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}

        <TouchableOpacity onPress={() => setSymptomsArray([...symptomsArray, { name: '' }])}>
          <Text style={{ color: '#007BFF', marginTop: 10, marginLeft: 5 }}>
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
                      setNewSymptom('');
                      handleValueChange('', symptomsArray.length - 1);  // Reset the placeholder
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

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginVertical: 10,
    marginHorizontal: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  text: {
    fontSize: 16,
    color: 'black',
    marginBottom: 5,
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  inputText: {
    fontSize: 16,
    color: '#000',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
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
  item: {
    fontSize: 16,
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  labelitem:{
    color: '#000',
  },
  cancelButton: {
    color: 'red',
    marginTop: 10,
    padding: 8,
    fontSize: 16,
    textAlign: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  textInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 20,
  },
  buttonContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  cancelButtonText: {
    color: 'black',
  },
  confirmButtonText: {
    color: 'white',
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
  modalContainersearch:{
    color: 'black',
    flex: 1,
  },
  searchBar: {
    width: '100%',
    padding: 10,
    backgroundColor: '#fff',
  },
  searchInput: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    paddingHorizontal: 8,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
 
  noResultsText:{
    textAlign:'center',
    fontSize: 16,
  }
});

