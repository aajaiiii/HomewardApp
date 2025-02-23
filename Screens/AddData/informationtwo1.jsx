import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
} from 'react-native';
import {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Feather';
import Icon1 from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import {useRoute} from '@react-navigation/native';
import {Picker} from '@react-native-picker/picker';
import Toast from 'react-native-toast-message';

function Informationtwo() {
  const navigation = useNavigation();
  const [userData, setUserData] = useState('');
  const [caregiverInfo, setCaregiverInfo] = useState(null);
  const [caregivername, setcaregiverName] = useState('');
  const [caregiversurname, setcaregiverSurname] = useState('');
  const [username, setUsername] = useState('');
  const [caregivertel, setcaregiverTel] = useState('');
  const [Relationship, setRelationship] = useState('');
  const [customRelationship, setCustomRelationship] = useState('');
  const [isCustomRelationship, setIsCustomRelationship] = useState(false);
  const route = useRoute();
  const {formData} = route.params;
  const [caregivers, setCaregivers] = useState([
    {
      _id: '',
      ID_card_number: '',
      caregivername: '',
      caregiversurname: '',
      caregivertel: '',
      Relationship: '',
      customRelationship: '',
    },
  ]);

  const addCaregiver = () => {
    setCaregivers([
      ...caregivers,
      {
        caregivername: '',
        caregiversurname: '',
        caregivertel: '',
        Relationship: '',
        customRelationship: '',
      },
    ]);
  };

  const saveFormData = async data => {
    try {
      await AsyncStorage.setItem('CaregiverInfo', JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save the form data.', e);
    }
  };

  const loadFormData = async () => {
    try {
      const jsonData = await AsyncStorage.getItem('CaregiverInfo');
      return jsonData ? JSON.parse(jsonData) : null;
    } catch (e) {
      console.error('Failed to load the form data.', e);
    }
  };
  useEffect(() => {
    async function getData() {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.post('http://192.168.0.68:5000/userdata', {
          token,
        });
        if (response.data.data) {
          setUserData(response.data.data);
        }
        const savedData = await loadFormData();
        if (savedData) {
          setcaregiverName(savedData.caregivername || '');
          setcaregiverSurname(savedData.caregiversurname || '');
          setcaregiverTel(savedData.caregivertel || '');
          setRelationship(savedData.caregiverRelationship || '');
          setIsCustomRelationship(savedData.caregiverRelationship === 'อื่น ๆ');
          setCustomRelationship(savedData.customRelationship || '');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }

    getData();
  }, [formData]);

  useEffect(() => {
    async function fetchCaregiverInfo() {
      try {
        if (userData) {
          const response = await axios.get(
            `http://192.168.0.68:5000/getcaregiver/${userData._id}`,
          );
          if (response.data.data) {
            const caregiversData = response.data.data.map(item => ({
              _id: item._id,
              ID_card_number: item.ID_card_number || '',
              caregivername: item.name || '',
              caregiversurname: item.surname || '',
              caregivertel: item.tel || '',
              Relationship: item.userRelationships?.[0]?.relationship || '',
              customRelationship: item.customRelationship || '',
            }));
            setCaregivers(caregiversData);
          }
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setCaregiverInfo(null);
        } else {
          console.error('Error fetching caregiver info:', error);
        }
      }
    }
    fetchCaregiverInfo();
  }, [userData]);

  const goBack = async () => {
    const formdata1 = {
      user: formData.user,
      caregivers: caregivers.map(caregiver => ({
        _id: caregiver._id,
        caregivername: caregiver.caregivername,
        caregiversurname: caregiver.caregiversurname,
        caregivertel: caregiver.caregivertel,
        Relationship: caregiver.Relationship,
        customRelationship: caregiver.customRelationship,
      })),
      ...formData,
    };
    await saveFormData(formdata1);
    navigation.goBack();
  };

  const updateCaregiver = (index, key, value) => {
    const updatedCaregivers = [...caregivers];
    updatedCaregivers[index][key] = value;
    setCaregivers(updatedCaregivers);
  };

  const AddInfo = async () => {
    const formdata1 = {
      //ส่งไป backend
      user: formData.user,
      caregivers: caregivers.map(caregiver => ({
        _id: caregiver._id,
        ID_card_number:caregiver.ID_card_number,
        caregivername: caregiver.caregivername,
        caregiversurname: caregiver.caregiversurname,
        caregivertel: caregiver.caregivertel,
        Relationship: caregiver.Relationship,
        customRelationship: caregiver.customRelationship,
      })),
      ...formData,
    };

    try {
      const response = await axios.post(
        'http://192.168.0.68:5000/updateuserinfo',
        formdata1,
      );
      console.log('เพิ่ม:', response.data);
      console.log('formdata1:', formdata1);
      if (response.data.status === 'Ok') {
        await AsyncStorage.removeItem('CaregiverInfo');
        // await AsyncStorage.setItem('addDataFirst', JSON.stringify(true));
        navigation.navigate('Success');
      }
    } catch (error) {
      console.error('Error adding Information:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2:
          'There was a problem updating the patient form. Please try again.',
      });
    }
  };

  //   const AddInfo = () => {
  //     navigation.navigate('Success');
  //   };
  // const removeCaregiver = (index) => {
  //   const updatedCaregivers = caregivers.filter((_, i) => i !== index);
  //   setCaregivers(updatedCaregivers);
  // };

  const removeCaregiver = async index => {
    const caregiverToDelete = caregivers[index]; // เก็บข้อมูลของ caregiver ที่จะลบ

    if (caregiverToDelete._id) {
      // ตรวจสอบว่า caregiver มี `_id` (มาจากฐานข้อมูล)
      try {
        const response = await axios.post(
          'http://192.168.0.68:5000/deletecaregiver',
          {
            _id: caregiverToDelete._id,
          },
        );
        if (response.data.status === 'Ok') {
          // หากลบสำเร็จ ให้ลบออกจาก State
          const updatedCaregivers = caregivers.filter((_, i) => i !== index);
          setCaregivers(updatedCaregivers);
          Toast.show({
            type: 'success',
            text1: 'สำเร็จ',
            text2: 'ลบผู้ดูแลสำเร็จแล้ว',
          });
        } else {
          // หากมีปัญหา ให้แจ้งผู้ใช้
          Toast.show({
            type: 'error',
            text1: 'เกิดข้อผิดพลาด',
            text2: 'ไม่สามารถลบผู้ดูแลได้',
          });
        }
      } catch (error) {
        console.error('Error removing caregiver:', error);
        Toast.show({
          type: 'error',
          text1: 'ข้อผิดพลาด',
          text2: 'ไม่สามารถลบผู้ดูแลได้ กรุณาลองใหม่อีกครั้ง',
        });
      }
    } else {
      // หาก caregiver ยังไม่มี `_id` (ยังไม่ถูกบันทึกในฐานข้อมูล)
      const updatedCaregivers = caregivers.filter((_, i) => i !== index);
      setCaregivers(updatedCaregivers);
    }
  };

  return (
    <ScrollView
      keyboardShouldPersistTaps={'always'}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{paddingBottom: 40}}
      style={{backgroundColor: '#fff'}}>
      <View>
        {caregivers.map((caregiver, index) => (
          <View key={index} style={style.container}>
            <Text style={style.texthead}>ข้อมูลผู้ดูแล {index + 1}</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={style.textlabel}>เลขประจำตัวประชาชน</Text>
              <TextInput
                style={[style.textInputRead, style.text]}
                onChangeText={text =>
                  updateCaregiver(index, 'ID_card_number', text)
                }
                value={caregiver.ID_card_number}
              />
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={style.textlabel}>ชื่อ</Text>
              <TextInput
                style={[style.textInputRead, style.text]}
                onChangeText={text =>
                  updateCaregiver(index, 'caregivername', text)
                }
                value={caregiver.caregivername}
              />
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={style.textlabel}>นามสกุล</Text>
              <TextInput
                style={[style.textInputRead, style.text]}
                onChangeText={text =>
                  updateCaregiver(index, 'caregiversurname', text)
                }
                value={caregiver.caregiversurname}
              />
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={style.textlabel}>เกี่ยวข้องเป็น</Text>
              <View style={style.pickerContainer}>
                <Picker
                  style={[style.Picker, style.text]}
                  selectedValue={
                    caregiver.Relationship === 'อื่น ๆ'
                      ? 'อื่น ๆ'
                      : caregiver.Relationship
                  }
                  onValueChange={itemValue => {
                    if (itemValue === 'อื่น ๆ') {
                      updateCaregiver(index, 'Relationship', 'อื่น ๆ');
                    } else {
                      updateCaregiver(index, 'Relationship', itemValue);
                    }
                  }}>
                  <Picker.Item label="เลือกความสัมพันธ์" value="" />
                  <Picker.Item label="พ่อ" value="พ่อ" />
                  <Picker.Item label="แม่" value="แม่" />
                  <Picker.Item label="ลูก" value="ลูก" />
                  <Picker.Item label="สามี" value="สามี" />
                  <Picker.Item label="ภรรยา" value="ภรรยา" />
                  <Picker.Item label="อื่น ๆ" value="อื่น ๆ" />
                </Picker>
              </View>
            </View>
            {caregiver.Relationship === 'อื่น ๆ' && (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={style.textlabel}>กรุณาระบุ</Text>
                <TextInput
                  style={[style.textInputRead, style.text]}
                  onChangeText={text =>
                    updateCaregiver(index, 'customRelationship', text)
                  }
                  value={caregiver.customRelationship}
                />
              </View>
            )}
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={style.textlabel}>เบอร์โทรศัพท์</Text>
              <TextInput
                style={[style.textInputRead, style.text]}
                onChangeText={text =>
                  updateCaregiver(index, 'caregivertel', text)
                }
                value={caregiver.caregivertel}
              />
            </View>
            {/* <TouchableOpacity onPress={() => removeCaregiver(index)}>
      <Text style={{ color: 'red', textAlign: 'center', marginVertical: 10 }}>ลบผู้ดูแล</Text>
    </TouchableOpacity> */}
            {index !== 0 || caregivers.length > 1 || caregiver._id ? (
              <TouchableOpacity onPress={() => removeCaregiver(index)}>
                <Text
                  style={{
                    color: 'red',
                    textAlign: 'center',
                    marginVertical: 10,
                  }}>
                  ลบผู้ดูแล
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
        ))}
        <TouchableOpacity onPress={addCaregiver} style={stylep.textadd}>
          <Text style={stylep.buttonText}>เพิ่มผู้ดูแล</Text>
        </TouchableOpacity>
      </View>

      <View style={stylep.buttonContainer}>
        <TouchableOpacity onPress={goBack} style={stylep.textCC}>
          <Text style={stylep.cancelButtonText}>ย้อนกลับ</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={AddInfo} style={stylep.textOk}>
          <Text style={stylep.buttonText}>บันทึก</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

export default Informationtwo;

const stylep = StyleSheet.create({
  text: {
    color: 'black',
    fontFamily: 'Arial',
    fontSize: 16,
    fontWeight: 'normal',
    padding: 5,
    paddingLeft: 8,
  },
  texttitle: {
    flex: 1,
    marginRight: 3,
  },
  select: {
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    marginTop: 10,
  },
  textadd: {
    backgroundColor: '#42bd41',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    marginHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 3,
  },
  textOk: {
    backgroundColor: '#5AB9EA',
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
    borderColor: '#5AB9EA',
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
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelButtonText: {
    color: '#5AB9EA',
    fontWeight: 'bold',
  },
});

const style = StyleSheet.create({
  container: {
    padding: 10,
    margin: 5,
  },
  text: {
    color: 'black',
    fontFamily: 'Arial',
    fontSize: 16,
    fontWeight: 'normal',
    padding: 10,
  },
  inBut: {
    width: '70%',
    backgroundColor: '#5AB9EA',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 1,
    borderRadius: 50,
    marginLeft: 'auto',
    marginRight: 'auto',
    color: '#fff',
    marginTop: 10,
  },
  textinBut: {
    color: '#fff',
    fontFamily: 'Arial',
    fontSize: 16,
    fontWeight: 'normal',
    padding: 10,
  },
  textInputContainer: {
    borderWidth: 1,
    borderColor: '#DCDCDC',
    borderRadius: 10,
    paddingHorizontal: 8,
    marginTop: 1,
  },
  textInputRead: {
    borderWidth: 1,
    borderColor: '#DCDCDC',
    borderRadius: 10,
    paddingHorizontal: 8,
    marginTop: 1,
    height: 45,
    marginVertical: 4,
    flex: 1,
  },
  textInputAddress: {
    borderWidth: 1,
    borderColor: '#DCDCDC',
    borderRadius: 10,
    paddingHorizontal: 8,
    marginTop: 1,
    height: 80,
    marginVertical: 4,
    flex: 1,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#DCDCDC',
    borderRadius: 10,
    paddingHorizontal: 8,
    marginTop: 1,
    height: 50,
    marginVertical: 4,
    flex: 1,
  },
  Picker: {
    padding: 20,
    borderRadius: 20,
  },
  texthead: {
    textAlign: 'center',
    color: 'black',
    fontSize: 18,
    padding: 7,
    fontFamily: 'Arial',
    fontWeight: '700',
  },
  textWidth: {
    flex: 1,
  },
  textlabel: {
    color: 'black',
    fontSize: 16,
    padding: 7,
    fontFamily: 'Arial',
    // fontWeight: '600',
  },
});
