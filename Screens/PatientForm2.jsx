import {
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import style from './style';
import styleform from './styleform';
import Icon from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import RNPickerSelect from 'react-native-picker-select';
import {useRoute} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import LinearGradient from 'react-native-linear-gradient';
import {useFocusEffect} from '@react-navigation/native';
import PageIndicator from './PageIndicator';
import DropDownPicker from 'react-native-dropdown-picker';
import {Picker} from '@react-native-picker/picker';

export default function PatientForm2(props) {
  console.log(props);
  const [userData, setUserData] = useState('');
  const navigation = useNavigation();
  const [SBP, setSBP] = useState('');
  const [DBP, setDBP] = useState('');
  const [PulseRate, setPulseRate] = useState('');
  const [Temperature, setTemperature] = useState('');
  const [DTX, setDTX] = useState('');
  const [Respiration, setRespiration] = useState('');
  const [LevelSymptom, setLevelSymptom] = useState('');
  const [Painscore, setPainscore] = useState('');
  const [request_detail, setRequest_detail] = useState('');
  const [Recorder, setRecorder] = useState('');
  const route = useRoute();
  const {formData} = route.params;
  const isFocused = useIsFocused();
  const [inputHeight, setInputHeight] = useState(40); // Initial height of TextInput

  useFocusEffect(
    React.useCallback(() => {
      // ซ่อน TabBar เมื่อเข้าหน้านี้
      navigation.getParent()?.setOptions({
        tabBarStyle: {display: 'none'},
      });
      return () => {
        // แสดง TabBar กลับมาเมื่อออกจากหน้านี้
        navigation.getParent()?.setOptions({
          tabBarStyle: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            elevation: 10,
            backgroundColor: '#fff',
            borderTopColor: 'transparent',
            shadowColor: '#000',
            shadowOffset: {width: 0, height: -5},
            shadowOpacity: 0.15,
            shadowRadius: 10,
            height: 65,
          },
        });
      };
    }, [navigation]),
  );

  const handleContentSizeChange = event => {
    setInputHeight(event.nativeEvent.contentSize.height);
  };

  const saveFormData = async data => {
    try {
      await AsyncStorage.setItem('patientForm', JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save the form data.', e);
    }
  };

  const loadFormData = async () => {
    try {
      const jsonData = await AsyncStorage.getItem('patientForm');
      return jsonData ? JSON.parse(jsonData) : null;
    } catch (e) {
      console.error('Failed to load the form data.', e);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = await AsyncStorage.getItem('token');
      axios.post('http://10.0.2.2:5000/userdata', {token: token}).then(res => {
        setUserData(res.data.data);
      });

      const savedData = await loadFormData();
      if (savedData) {
        setSBP(savedData.SBP || '');
        setDBP(savedData.DBP || '');
        setPulseRate(savedData.PulseRate || '');
        setTemperature(savedData.Temperature || '');
        setDTX(savedData.DTX || '');
        setRespiration(savedData.Respiration || '');
        setLevelSymptom(savedData.LevelSymptom || '');
        setPainscore(savedData.Painscore || '');
        setRequest_detail(savedData.request_detail || '');
        setRecorder(savedData.Recorder || '');
      }
    };

    fetchData();
  }, [formData]);

  const AddpatientForm = async () => {
    console.log('Symptoms:', formData.symptoms);

    if (
      !Array.isArray(formData.symptoms) ||
      formData.symptoms.length === 0 ||
      formData.symptoms.every(symptom => symptom.trim() === '')
    ) {
      Toast.show({
        type: 'error',
        text1: 'กรุณาเลือกอาการ',
        text2: 'กรุณาเลือกอาการอย่างน้อย 1 อย่าง',
      });
      return;
    }

    if (!formData.LevelSymptom || formData.LevelSymptom.trim() === '') {
      Toast.show({
        type: 'error',
        text1: 'กรุณาเลือกความรุนแรง',
        text2: 'กรุณาเลือกความรุนแรงของอาการ',
      });
      return;
    }

    if (!Recorder || Recorder.trim() === '') {
      Toast.show({
        type: 'error',
        text1: 'กรุณาเลือกผู้บันทึก',
        text2: 'กรุณาเลือกเลือกผู้บันทึกให้ครบถ้วน',
      });
      return;
    }

    const formdata1 = {
      Symptoms: formData.symptoms,
      SBP,
      DBP,
      PulseRate,
      Temperature,
      DTX,
      Respiration,
      LevelSymptom: formData.LevelSymptom,
      Painscore,
      request_detail,
      Recorder,
      user: formData.user,
    };

    try {
      const response = await axios.post(
        'http://10.0.2.2:5000/addpatientform',
        formdata1,
      );
      if (response.data.status === 'ok') {
        Toast.show({
          type: 'success',
          text1: 'บันทึกสำเร็จ',
          text2: 'บันทึกข้อมูลอาการแล้ว',
        });
        await AsyncStorage.removeItem('patientForm');
        navigation.getParent()?.setOptions({
          tabBarStyle: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            elevation: 10,
            backgroundColor: '#fff',
            borderTopColor: 'transparent',
            shadowColor: '#000',
            shadowOffset: {width: 0, height: -5},
            shadowOpacity: 0.15,
            shadowRadius: 10,
            height: 65,
          },
        });
        navigation.navigate('Home', {refresh: true});
      }
    } catch (error) {
      console.error('Error adding patient form:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2:
          'There was a problem updating the patient form. Please try again.',
      });
    }
  };

  const goBack = async () => {
    const formdata1 = {
      Symptoms: formData.symptoms,
      SBP,
      DBP,
      PulseRate,
      Temperature,
      DTX,
      Respiration,
      LevelSymptom: formData.LevelSymptom,
      Painscore,
      request_detail,
      Recorder,
      user: formData.user,
    };
    await saveFormData(formdata1);
    navigation.goBack();
  };

  return (
    <View
      style={{flex: 1}} // ให้ครอบคลุมทั้งหน้าจอ
    >
      <ScrollView
        keyboardShouldPersistTaps={'always'}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 50}}
        style={{backgroundColor: '#F5F5F5'}}>
        <PageIndicator currentPage={2} />
        <View style={[stylep.container, {flex: 1}]}>
          <Text style={styleform.sectionHeader}>สัญญาณชีพ</Text>
          <View style={style.inputContainer}>
            <View style={stylep.texttitle}>
              <Text style={stylep.symptomTitle}>อุณหภูมิ(°C)</Text>
              <TextInput
                style={[style.textInputRead, style.text]}
                onChange={e => setTemperature(e.nativeEvent.text)}
                value={Temperature}
                keyboardType="numeric"
              />
            </View>
          </View>
          <View style={style.inputContainer}>
            <View style={stylep.texttitle}>
              <Text style={stylep.symptomTitle}>ความดันบน(mmHg)</Text>
              {/* <Text style={stylep.text}>(mmHg)</Text> */}
              <TextInput
                style={[style.textInputRead, style.text]}
                onChangeText={text => setSBP(text)}
                value={SBP}
                keyboardType="numeric"
              />
            </View>
          </View>
          <View style={style.inputContainer}>
            <View style={stylep.texttitle}>
              <Text style={stylep.symptomTitle}>ความดันล่าง(mmHg)</Text>
              <TextInput
                style={[style.textInputRead, style.text]}
                onChangeText={text => setDBP(text)}
                value={DBP}
                keyboardType="numeric"
              />
            </View>
          </View>
          <View style={style.inputContainer}>
            <View style={stylep.texttitle}>
              <Text style={stylep.symptomTitle}>ชีพจร(ครั้ง/นาที)</Text>
              <TextInput
                style={[style.textInputRead, style.text]}
                onChange={e => setPulseRate(e.nativeEvent.text)}
                value={PulseRate}
                keyboardType="numeric"
              />
            </View>
          </View>
          <View style={style.inputContainer}>
            <View style={stylep.texttitle}>
              <Text style={stylep.symptomTitle}>การหายใจ(ครั้ง/นาที)</Text>
              <TextInput
                style={[style.textInputRead, style.text]}
                onChange={e => setRespiration(e.nativeEvent.text)}
                value={Respiration}
                keyboardType="numeric"
              />
            </View>
          </View>
          <View style={style.inputContainer}>
            <View style={stylep.texttitle}>
              <Text style={stylep.symptomTitle}>ระดับความเจ็บปวด</Text>
              <RNPickerSelect
                onValueChange={value => setPainscore(value)}
                items={[
                  {label: '0', value: '0'},
                  {label: '1', value: '1'},
                  {label: '2', value: '2'},
                  {label: '3', value: '3'},
                  {label: '4', value: '4'},
                  {label: '5', value: '5'},
                  {label: '6', value: '6'},
                  {label: '7', value: '7'},
                  {label: '8', value: '8'},
                  {label: '9', value: '9'},
                  {label: '10', value: '10'},
                ]}
                style={pickerSelectStyles}
                placeholder={{label: 'เลือกระดับ', value: null}}
                useNativeAndroidPickerStyle={false}
                value={Painscore}
                Icon={() => {
                  return <Icon name="chevron-down" size={20} color="gray" />;
                }}
              />
            </View>
          </View>
          <View style={style.inputContainer}>
            <View style={stylep.texttitle}>
              <Text style={stylep.symptomTitle}>ระดับน้ำตาลในเลือด(mg/dL)</Text>
              <TextInput
                style={[
                  style.textInputRead,
                  style.text,
                  {height: Math.max(40, inputHeight)},
                ]}
                onChange={e => setDTX(e.nativeEvent.text)}
                value={DTX}
                keyboardType="numeric"
              />
            </View>
          </View>
          <View style={style.inputContainer}>
            <View style={stylep.texttitle}>
              <Text style={stylep.symptomTitle}>
                สิ่งที่อยากให้ทีมแพทย์ช่วยเหลือเพิ่มเติม
              </Text>
              <TextInput
                style={[
                  style.textInputRead,
                  style.text,
                  {height: Math.max(40, inputHeight)},
                ]}
                value={request_detail}
                onChangeText={setRequest_detail}
                multiline={true}
                textAlignVertical="top"
                onContentSizeChange={handleContentSizeChange}
              />
            </View>
          </View>
          <View style={style.inputContainer}>
            <View style={stylep.texttitle}>
              <Text style={stylep.symptomTitle}>ผู้บันทึก</Text>
              <RNPickerSelect
                onValueChange={value => setRecorder(value)}
                items={[
                  {label: 'ผู้ป่วย', value: 'ผู้ป่วย'},
                  {label: 'ผู้ดูแล', value: 'ผู้ดูแล'},
                ]}
                style={pickerSelectStyles}
                placeholder={{label: 'เลือกผู้บันทึก', value: null}}
                useNativeAndroidPickerStyle={false}
                value={Recorder}
                Icon={() => {
                  return <Icon name="chevron-down" size={20} color="gray" />;
                }}
              />
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={stylep.buttonContainer}>
        <TouchableOpacity onPress={goBack} style={stylep.textCC}>
          <Text style={stylep.cancelButtonText}>ย้อนกลับ</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={AddpatientForm} style={stylep.textOk}>
          <Text style={stylep.buttonText}>บันทึก</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const stylep = StyleSheet.create({
  container: {
    padding: 15,
    marginTop: 105,
    marginVertical: 10,
    marginHorizontal: 15,
    backgroundColor: 'white',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#eee', // เปลี่ยนเป็นสีเทาอ่อน
    marginBottom: 40,
    shadowColor: '#bbb',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
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
    width: '100%',
    backgroundColor: '#fafafa',
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
  },
  textOk: {
    backgroundColor: '#42A5F5',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 3,
    marginLeft: 10,
  },
  textCC: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#42A5F5',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1, // ทำให้ปุ่มกว้างเท่ากัน
    paddingVertical: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 3,
    marginRight: 10,
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'Kanit-Medium',
    fontSize: 16,
  },
  cancelButtonText: {
    color: '#42A5F5',
    fontFamily: 'Kanit-Medium',
    fontSize: 16,
  },
  symptomTitle: {
    fontSize: 16,
    color: '#2D3748',
    fontFamily: 'Kanit-Medium',
    marginBottom: 4,
  },
});
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12, // ✅ ทำให้ dropdown มีขอบมน
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    marginTop: 5,
    marginBottom: 10,
    backgroundColor: '#fff',
    color: '#333',
  },
  inputAndroid: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12, // ✅ ทำให้ dropdown มีขอบมน
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    marginTop: 5,
    marginBottom: 10,
    backgroundColor: '#fff',
    color: '#333',
  },
  placeholder: {
    color: '#888',
    fontSize: 16,
    fontFamily: 'Kanit-Regular',
  },
  iconContainer: {
    top: 21,
    right: 12,
  },
});
