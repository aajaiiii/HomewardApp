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
import {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import style from './style';
import styleform from './styleform';
import Icon from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import RNPickerSelect from 'react-native-picker-select';
import {useRoute} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
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
  const { formData } = route.params;
  const isFocused = useIsFocused();
  const [inputHeight, setInputHeight] = useState(40); // Initial height of TextInput

  const handleContentSizeChange = event => {
    setInputHeight(event.nativeEvent.contentSize.height);
  };

  const saveFormData = async (data) => {
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
      axios
        .post('http://192.168.2.57:5000/userdata', { token: token })
        .then(res => {
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
    // if (formData.symptoms.includes('') || formData.symptoms.includes('new_symptom')) {
    //   Toast.show({
    //     type: 'error',
    //     text1: 'Error',
    //     text2: 'กรุณาเลือกอาการให้ครบถ้วน',
    //   });
    //   return;
    // }
    const formdata1 = {
      Symptoms: formData.symptoms,
      SBP,
      DBP,
      PulseRate,
      Temperature,
      DTX,
      Respiration,
      LevelSymptom,
      Painscore,
      request_detail,
      Recorder,
      user: formData.user
    };

    try {
      const response = await axios.post(
        'http://192.168.2.57:5000/addpatientform',
        formdata1,
      );
      if (response.data.status === 'ok') {
        Toast.show({
          type: 'success',
          text1: 'บันทึกสำเร็จ',
          text2: 'บันทึกอาการแล้ว',
        });
        await AsyncStorage.removeItem('patientForm');
        navigation.navigate('Home', { refresh: true });
      }
    } catch (error) {
      console.error('Error adding patient form:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'There was a problem updating the patient form. Please try again.',
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
      LevelSymptom,
      Painscore,
      request_detail,
      Recorder,
      user: formData.user
    };
    await saveFormData(formdata1);
    navigation.goBack();
  };

  return (
    <ScrollView
      keyboardShouldPersistTaps={'always'}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 40 }}
      style={{ backgroundColor: '#F7F7F7' }}>
      <View style={[styleform.container, { flex: 1 }]}>
        <Text style={styleform.sectionHeader}>สัญญาณชีพ</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <View style={stylep.texttitle}>
            <Text style={stylep.text}>ความดันตัวบน(mmHg)</Text>
            <TextInput
              style={[style.textInputRead, style.text]}
              onChangeText={text => setSBP(text)}
              value={SBP}
              keyboardType="numeric"
            />
          </View>
          <View style={stylep.texttitle}>
            <Text style={stylep.text}>ความดันตัวล่าง(mmHg)</Text>
            <TextInput
              style={[style.textInputRead, style.text]}
              onChangeText={text => setDBP(text)}
              value={DBP}
              keyboardType="numeric"
            />
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <View style={stylep.texttitle}>
            <Text style={stylep.text}>ชีพจร(ครั้ง/นาที)</Text>
            <TextInput
              style={[style.textInputRead, style.text]}
              onChange={e => setPulseRate(e.nativeEvent.text)}
              value={PulseRate}
              keyboardType="numeric"
            />
          </View>
          <View style={stylep.texttitle}>
            <Text style={stylep.text}>การหายใจ(ครั้ง/นาที)</Text>
            <TextInput
              style={[style.textInputRead, style.text]}
              onChange={e => setRespiration(e.nativeEvent.text)}
              value={Respiration}
              keyboardType="numeric"
            />
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <View style={stylep.texttitle}>
            <Text style={stylep.text}>อุณหภูมิ(°C)</Text>
            <TextInput
              style={[style.textInputRead, style.text]}
              onChange={e => setTemperature(e.nativeEvent.text)}
              value={Temperature}
              keyboardType="numeric"
            />
          </View>
          <View style={stylep.texttitle}>
            <Text style={stylep.text}>ระดับความเจ็บปวด</Text>
            <RNPickerSelect
              onValueChange={value => setPainscore(value)}
              items={[
                { label: '0', value: '0' },
                { label: '1', value: '1' },
                { label: '2', value: '2' },
                { label: '3', value: '3' },
                { label: '4', value: '4' },
                { label: '5', value: '5' },
                { label: '6', value: '6' },
                { label: '7', value: '7' },
                { label: '8', value: '8' },
                { label: '9', value: '9' },
                { label: '10', value: '10' },
              ]}
              style={pickerSelectStyles}
              placeholder={{ label: 'เลือกระดับ', value: null }}
              useNativeAndroidPickerStyle={false}
              value={Painscore}
            />
          </View>
        </View>
        <View style={{ alignItems: 'Left' }}>
          <View style={stylep.texttitle}>
            <Text style={stylep.text}>ความรุนแรงของอาการ</Text>
            <RNPickerSelect
              onValueChange={value => setLevelSymptom(value)}
              items={[
                { label: 'ดีขึ้น', value: 'ดีขึ้น' },
                { label: 'แย่ลง', value: 'แย่ลง' },
                { label: 'พอ ๆ เดิม', value: 'พอ ๆ เดิม' },
              ]}
              style={pickerSelectStyles}
              placeholder={{ label: 'เลือกความรุนแรง', value: null }}
              useNativeAndroidPickerStyle={false}
              value={LevelSymptom}
            />
          </View>
          <View style={[stylep.texttitle]}>
            <Text style={stylep.text}>ระดับน้ำตาลในเลือด(mg/dL)</Text>
            <TextInput
              style={[style.textInputRead, style.text, { width: 175 }]}
              onChange={e => setDTX(e.nativeEvent.text)}
              value={DTX}
              keyboardType="numeric"
            />
          </View>
        </View>
        <View>
          <Text style={stylep.text}>สิ่งที่อยากให้ทีมแพทย์ช่วยเหลือเพิ่มเติม</Text>
          <TextInput
            style={[
              style.textInputRead,
              style.text,
              { height: Math.max(40, inputHeight) },
            ]}
            value={request_detail}
            onChangeText={setRequest_detail}
            multiline={true}
            textAlignVertical="top"
            onContentSizeChange={handleContentSizeChange}
          />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={stylep.texttitle}>
            <Text style={stylep.text}>ผู้บันทึก</Text>
            <RNPickerSelect
              onValueChange={value => setRecorder(value)}
              items={[
                { label: 'ผู้ป่วย', value: 'ผู้ป่วย' },
                { label: 'ผู้ดูแล', value: 'ผู้ดูแล' },
              ]}
              style={pickerSelectStyles}
              placeholder={{ label: 'เลือกผู้บันทึก', value: null }}
              useNativeAndroidPickerStyle={false}
              value={Recorder}
            />
          </View>
        </View>
      </View>
      <View style={stylep.buttonContainer}>
        <TouchableOpacity onPress={goBack} style={stylep.textCC}>
          <Text style={stylep.cancelButtonText}>ย้อนกลับ</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={AddpatientForm} style={stylep.textOk}>
          <Text style={stylep.buttonText}>บันทึก</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

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
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelButtonText: {
    color: '#87CEFA',
    fontWeight: 'bold',
  },
});

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
});
