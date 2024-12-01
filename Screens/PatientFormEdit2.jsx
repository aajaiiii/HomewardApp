import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import {useNavigation, useIsFocused, useRoute} from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import style from './style';
import styleform from './styleform';
import RNPickerSelect from 'react-native-picker-select';
import Toast from 'react-native-toast-message';
import { useFocusEffect } from '@react-navigation/native';

export default function PatientFormEdit2(props) {
  const [userData, setUserData] = useState('');
  // const [formData, setFormData] = useState({});
  const navigation = useNavigation();
  const route = useRoute();
  const { id, formData } = route.params;
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
  const isFocused = useIsFocused();
  const [inputHeight, setInputHeight] = useState(40);
  const [patientForm,setpatientForm]= useState('');

  useFocusEffect(
    React.useCallback(() => {
      // ซ่อน TabBar เมื่อเข้าหน้านี้
      navigation.getParent()?.setOptions({
        tabBarStyle: { display: 'none' },
      });
      return () => {
        // แสดง TabBar กลับมาเมื่อออกจากหน้านี้
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
            height: 60,  }, // ปรับ 'flex' ให้ TabBar กลับมาแสดง
        });
      };
    }, [navigation])
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
      if (token) {
        try {
          const res = await axios.post('http://10.53.57.175:5000/userdata', {
            token,
          });
          setUserData(res.data.data);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
  
      try {
        const response = await axios.get(
          `http://10.53.57.175:5000/getpatientform/${id}`,
        );
        if (response.data.status === 'ok') {
          const patientForm = response.data.patientForm;
          setpatientForm(patientForm);
          console.log('Fetched Patient Form565:', patientForm); 
          
          setSBP(patientForm.SBP || '');
          setDBP(patientForm.DBP || '');
          setPulseRate(patientForm.PulseRate || '');
          setTemperature(patientForm.Temperature || '');
          setDTX(patientForm.DTX || '');
          setRespiration(patientForm.Respiration || '');
          setLevelSymptom(patientForm.LevelSymptom || '');
          setPainscore(patientForm.Painscore || '');
          setRequest_detail(patientForm.request_detail || '');
          setRecorder(patientForm.Recorder || '');
          console.log('Fetched SBP:', patientForm.SBP);
        } else {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Patient form not found.',
          });
        }
      } catch (error) {
        console.error('Error fetching patient form:', error);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2:
            'There was a problem fetching the patient form. Please try again.',
        });
      }
  
      // Load saved form data
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
  }, [id]);
  

  const UpdatepatientForm = async () => {
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
      user: formData.user,
    };
    console.log('Update Form Data565:', formdata1); 
    try {
      const response = await axios.put(
        `http://10.53.57.175:5000/updatepatientform/${id}`,
        formdata1,
      );
      if (response.data.status === 'ok') {
        // navigation.getParent()?.setOptions({
        //   tabBarStyle: {   position: 'absolute',
        //     bottom: 0,
        //     left: 0,
        //     right: 0,
        //     elevation: 0,
        //     backgroundColor: '#fff',
        //     borderTopColor: 'transparent',
        //     shadowColor: '#000',
        //     shadowOffset: { width: 0, height: -2 },
        //     shadowOpacity: 0.1,
        //     shadowRadius: 6,
        //     height: 60,  },
        // });
        Toast.show({
          type: 'success',
          text1: 'แก้ไขสำเร็จ',
          text2: 'แก้ไขสำเร็จแล้ว',
        });
        await AsyncStorage.removeItem('patientForm');

        const updatedPatientForm = await axios.get(
          `http://10.53.57.175:5000/getpatientform/${id}`
        );
        
        navigation.navigate('Assessmentitem', {
          selectedItem: updatedPatientForm.data.patientForm,
          refresh: true,
        });      
      }
    } catch (error) {
      console.error('Error updating patient form:', error);
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
      LevelSymptom,
      Painscore,
      request_detail,
      Recorder,
      user: formData.user,
    };
    await saveFormData(formdata1);
    navigation.goBack();
  };

  return (
    <ScrollView
      keyboardShouldPersistTaps={'always'}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{paddingBottom: 40}}
      style={{backgroundColor: '#F7F7F7'}}>
      <View style={[stylep.container, {flex: 1}]}>
        <Text style={styleform.sectionHeader}>สัญญาณชีพ</Text>
        <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
          <View style={stylep.texttitle}>
            <Text style={stylep.text}>ความดันบน(mmHg)</Text>
            <TextInput
              style={[style.textInputRead, style.text]}
              onChangeText={text => setSBP(text)}
              value={SBP.toString()}
              keyboardType="numeric"
            />
          </View>
          <View style={stylep.texttitle}>
            <Text style={stylep.text}>ความดันล่าง(mmHg)</Text>
            <TextInput
              style={[style.textInputRead, style.text]}
              onChangeText={text => setDBP(text)}
              value={DBP.toString()} 
              keyboardType="numeric"
            />
          </View>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
          <View style={stylep.texttitle}>
            <Text style={stylep.text}>ชีพจร(ครั้ง/นาที)</Text>
            <TextInput
              style={[style.textInputRead, style.text]}
              onChangeText={text => setPulseRate(text)}
              value={PulseRate.toString()}
              keyboardType="numeric"
            />
          </View>
          <View style={stylep.texttitle}>
            <Text style={stylep.text}>การหายใจ(ครั้ง/นาที)</Text>
            <TextInput
              style={[style.textInputRead, style.text]}
              onChangeText={text => setRespiration(text)}
              value={Respiration.toString()}
              keyboardType="numeric"
            />
          </View>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
          <View style={stylep.texttitle}>
            <Text style={stylep.text}>อุณหภูมิ(°C)</Text>
            <TextInput
              style={[style.textInputRead, style.text]}
              onChangeText={text => setTemperature(text)}
              value={Temperature.toString()}
              keyboardType="numeric"
            />
          </View>
          <View style={stylep.texttitle}>
            <Text style={stylep.text}>ระดับความเจ็บปวด</Text>
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
            />
          </View>
        </View>
        <View style={{alignItems: 'Left'}}>
          <View style={stylep.texttitle}>
            <Text style={stylep.text}>ความรุนแรงของอาการ</Text>
            <RNPickerSelect
              onValueChange={value => setLevelSymptom(value)}
              items={[
                {label: 'ดีขึ้น', value: 'ดีขึ้น'},
                {label: 'แย่ลง', value: 'แย่ลง'},
                {label: 'พอ ๆ เดิม', value: 'พอ ๆ เดิม'},
              ]}
              style={pickerSelectStyles}
              placeholder={{label: 'เลือกความรุนแรง', value: null}}
              useNativeAndroidPickerStyle={false}
              value={LevelSymptom}
            />
          </View>
          <View style={[stylep.texttitle]}>
            <Text style={stylep.text}>ระดับน้ำตาลในเลือด(mg/dL)</Text>
            <TextInput
              style={[style.textInputRead, style.text, {width: 175}]}
              onChangeText={text => setDTX(text)}
              value={DTX.toString()}
              keyboardType="numeric"
            />
          </View>
        </View>
        <View>
          <Text style={stylep.text}>
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
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={stylep.texttitle}>
            <Text style={stylep.text}>ผู้บันทึก</Text>
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
            />
          </View>
        </View>
      </View>
      <View style={stylep.buttonContainer}>
        <TouchableOpacity onPress={goBack} style={stylep.textCC}>
          <Text style={stylep.cancelButtonText}>ย้อนกลับ</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={UpdatepatientForm} style={stylep.textOk}>
          <Text style={stylep.buttonText}>บันทึก</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const stylep = StyleSheet.create({
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
    backgroundColor: '#5AB9EA',
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
    borderColor: '#5AB9EA',
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
    color: '#5AB9EA',
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
