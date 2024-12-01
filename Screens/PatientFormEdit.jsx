import React, {useState, useEffect} from 'react';
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
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styleform from './styleform';
import { useFocusEffect } from '@react-navigation/native';

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

export default function PatientFormEdit() {
  const route = useRoute();  
  const { id } = route.params;
  const [userData, setUserData] = useState('');
  const navigation = useNavigation();
  const [symptoms, setSymptoms] = useState([]);
  const [newSymptom, setNewSymptom] = useState('');
  const [showNewSymptomInput, setShowNewSymptomInput] = useState(false);
  const [symptomsArray, setSymptomsArray] = useState([{ name: '' }]);
  const [userAge, setUserAge] = useState(0);
  const [userAgeInMonths, setUserAgeInMonths] = useState(0);
  const [selectedSymptoms, setSelectedSymptoms] = useState(['']);


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
  
  async function getData() {
    const token = await AsyncStorage.getItem('token');
    axios
      .post('http://10.53.57.175:5000/userdata', { token: token })
      .then(res => {
        setUserData(res.data.data);
      });
  }

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const fetchPatientForm = async () => {
      try {
        const response = await axios.get(`http://10.53.57.175:5000/getpatientform/${id}`);
        const data = response.data.patientForm;
        if (data && data.Symptoms) {
          setSymptomsArray(data.Symptoms.map(symptom => ({ name: symptom })));
          setSelectedSymptoms(data.Symptoms);
        } else {
          console.error('No symptoms data found');
        }
      } catch (error) {
        console.error('Error fetching patient form data:', error);
      }
    };
    if (id) fetchPatientForm();
  }, [id]);
  
  
  useEffect(() => {
    const getSymptoms = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get('http://10.53.57.175:5000/allSymptom', {
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
      const response = await axios.post('http://10.53.57.175:5000/addsymptom', formdata);
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

    navigation.navigate('PatientFormEdit2', { 
      formData: formdata, 
      id: id 
    });
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

    console.log('Updated Symptoms Array:', updatedSymptomsArray); 

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
                          <View style={styles.symptomHeader}>

            <Text style={styles.symptomTitle}>อาการที่ {index + 1}</Text>
           
            {index > 0 && (
              <TouchableOpacity
                onPress={() => removeSymptom(index)}
                style={styles.removeButton}>
                   <Ionicons
                    name="close"
                    color="white"
                    size={12} 
                  />
              </TouchableOpacity>
            )}
          </View>
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
          </View>
        ))}

<TouchableOpacity
            onPress={() => setSymptomsArray([...symptomsArray, {name: ''}])}
            style={styles.addButton}>
            <Text style={styles.addButtonText}>+ เพิ่มอาการ</Text>
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
                      handleValueChange('', symptomsArray.length - 1); 
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
    text: {
      fontSize: 16,
    color: '#333',
    marginBottom: 5,
    lineHeight: 22,
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
      borderRadius: 10,
      paddingVertical: 12,
      paddingHorizontal: 20,
      fontSize: 16,
      marginTop: 10,
      marginBottom: 10,
    },
    inputText: {
      fontSize: 16,
      color: '#2D3748',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
      padding: 20,
    },
    modalContent: {
      width: '90%',
      padding: 20,
      backgroundColor: 'white',
      borderRadius: 15,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.5,
      shadowRadius: 10,
      elevation: 10,
    },
    item: {
      fontSize: 16,
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
      backgroundColor: '#fff',
    },
    labelitem: {
      color: '#000',
      fontSize: 16,
    },
    cancelButton: {
      color: '#fff',
      marginTop: 10,
      padding: 10,
      fontSize: 16,
      textAlign: 'center',
      backgroundColor: '#d9534f',
    },
    buttonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
    },
    textInput: {
      height: 45,
      borderColor: '#ddd',
      borderWidth: 1,
      borderRadius: 10,
      paddingLeft: 15,
      paddingLeft: 10,
      marginBottom: 20,
      backgroundColor: '#f9f9f9',
      fontSize: 16,
    },
    buttonContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    textOk: {
      backgroundColor: '#5AB9EA',
      alignItems: 'center',
      paddingVertical: 12,
      borderRadius: 10,
      flex: 1,
      marginHorizontal: 5,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.3,
      shadowRadius: 5,
      elevation: 3,
    },
    textCC: {
      backgroundColor: '#fff',
      borderWidth: 1,
      borderColor: '#5AB9EA',
      alignItems: 'center',
      paddingVertical: 12,
      borderRadius: 10,
      flex: 1,
      marginHorizontal: 5,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.3,
      shadowRadius: 5,
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
      borderColor: '#5AB9EA',
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
      color: '#5AB9EA',
      fontWeight: 'bold',
    },
    modalContainersearch: {
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
  
    noResultsText: {
      textAlign: 'center',
      fontSize: 16,
      marginTop: 15,
    },
    addButton: {
      backgroundColor: '#5AB9EA',
      paddingVertical: 8,
      paddingHorizontal: 20,
      borderRadius: 10,
      marginTop: 10,
      marginLeft: 5,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.3,
      shadowRadius: 5,
      elevation: 3, 
    },
    addButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    symptomCard: {
      backgroundColor: '#fff', 
      borderRadius: 12, 
      padding: 15, 
      marginVertical: 10, 
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 5, 
      position: 'relative',
    },
    symptomHeader: {
      flexDirection: 'row', 
      justifyContent: 'space-between', 
      alignItems: 'center',
    },
    symptomTitle: {
      fontSize: 16,
      color: '#2D3748',
      fontWeight: 'bold', 
    },
    removeButton: {
      backgroundColor: '#FF6F61', 
      borderRadius: 50, 
      padding: 5, 
      margin:5,
    
    },
  
  });
  
  