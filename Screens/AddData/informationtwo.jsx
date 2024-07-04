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
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [username, setUsername] = useState('');
  const [tel, setTel] = useState('');
  const [Relationship, setRelationship] = useState('');
  const route = useRoute();
  const {formData} = route.params;

  const saveFormData = async (data) => {
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
        const response = await axios.post('http://192.168.2.43:5000/userdata', { token });
        if (response.data.data) {
          setUserData(response.data.data);
        }
        const savedData = await loadFormData();
        if (savedData) {
          setName(savedData.name || '');
          setSurname(savedData.surname || '');
          setTel(savedData.tel || '');
          setRelationship(savedData.Relationship || '');
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
            `http://192.168.2.43:5000/getcaregiver/${userData._id}`,
          );
          setCaregiverInfo(response.data.data);
          setName(response.data.data.name);
          setSurname(response.data.data.surname);
          setTel(response.data.data.tel);
          setRelationship(response.data.data.Relationship);
          console.log(name);
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
      name,
      surname,
      tel,
      Relationship,
      ...formData,
    };
    await saveFormData(formdata1);
    navigation.goBack();
  };

  const AddInfo = async () => {
    const formdata1 = {
      user: formData.user,
      name,
      surname,
      tel,
      Relationship,
      ...formData,
    };

    try {
      const response = await axios.post(
        'http://192.168.2.43:5000/updateuserinfo',
        formdata1,
      );
      if (response.data.status === 'Ok') {
        await AsyncStorage.removeItem('CaregiverInfo');
        navigation.navigate('Success', { refresh: true });      }
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

  return (
    <ScrollView
      keyboardShouldPersistTaps={'always'}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{paddingBottom: 40}}
      style={{backgroundColor: '#fff'}}>
      <View>
      <View style={style.container}>
      <Text style={style.texthead}>ข้อมูลผู้ดูแล</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={style.textlabel}>ชื่อ</Text>
            <TextInput
              style={[style.textInputRead, style.text]}
              onChangeText={text => setName(text)}
              value={name}
            />
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={style.textlabel}>นามสกุล</Text>
            <TextInput
              style={[style.textInputRead, style.text]}
              onChange={e => setSurname(e.nativeEvent.text)}
              value={surname}
            />
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>

            <Text style={style.textlabel}>เกี่ยวข้องเป็น</Text>
            <View style={style.pickerContainer}>
              <Picker
                style={[style.Picker, style.text]}
                selectedValue={Relationship}
                onValueChange={itemValue => setRelationship(itemValue)}>
                <Picker.Item label="เลือกความสัมพันธ์" value="" />
                <Picker.Item label="พ่อ" value="พ่อ" />
                <Picker.Item label="แม่" value="แม่" />
                <Picker.Item label="สามี" value="สามี" />
                <Picker.Item label="ภรรยา" value="ภรรยา" />
                <Picker.Item label="ลูก" value="ลูก" />
                <Picker.Item
                  label="ไม่มีความเกี่ยวข้อง"
                  value="ไม่มีความเกี่ยวข้อง"
                />
              </Picker>
            </View>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={style.textlabel}>เบอร์โทรศัพท์</Text>
            <TextInput
              style={[style.textInputRead, style.text]}
              onChange={e => setTel(e.nativeEvent.text)}
              value={tel}
            />
          </View>
        </View>
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
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelButtonText: {
    color: '#87CEFA',
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
      backgroundColor: '#87CEFA',
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
      color: 'black',
      fontSize: 18,
      padding: 7,
      fontFamily: 'Arial',
      fontWeight: '700',
    },
    textWidth: {
      flex: 1,
    },
    textlabel:{
        color: 'black',
        fontSize: 16,
        padding: 7,
        fontFamily: 'Arial',
        // fontWeight: '600',

    }
  });
  