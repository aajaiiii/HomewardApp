import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {useRoute, useNavigation} from '@react-navigation/native';
import style from './style';
import Toast from 'react-native-toast-message';
import {Picker} from '@react-native-picker/picker';
import LinearGradient from 'react-native-linear-gradient';
import styles from './stylesCaregiver';

export default function CaregiverAdd(props) {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [Relationship, setRelationship] = useState('');
  const [tel, setTel] = useState('');
  const [ID_card_number, setIDCardNumber] = useState(''); // เพิ่มหมายเลขบัตรประชาชน
  const [customRelationship, setCustomRelationship] = useState('');
  const [isCustomRelationship, setIsCustomRelationship] = useState(false);
  const [userId, setUserId] = useState(''); // เก็บค่า user ID ของผู้ใช้ปัจจุบัน
  const [userData, setUserData] = useState('');
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [errorName, setErrorName] = useState(false);
  const [errorSurname, setErrorSurname] = useState(false);
  const [errorCustom, setErrorcustom] = useState(false);
  const [errorRelationship, setErrorRelationship] = useState(false);
  const [errorTel, setErrorTel] = useState(false);
  const [errorIDCardNumber, setErrorIDCardNumber] = useState(false);
  const [errorMessage, setErrorMessage] = useState({
    name: '',
    surname: '',
    tel: '',
    ID_card_number: '',
    customRelationship: '',
    Relationship: '',
  });

  const validateName = name => {
    if (name === '') {
      setErrorName(false); // ลบข้อผิดพลาดเมื่อช่องกรอกว่าง
    } else if (!name.match(/^[ก-๏a-zA-Z\s]+$/)) {
      setErrorName(true);
      setErrorMessage(prev => ({...prev, name: 'ชื่อควรเป็นตัวอักษรเท่านั้น'}));
    } else {
      setErrorName(false);
      setErrorMessage(prev => ({...prev, name: ''}));
    }
  };

  const validateSurname = surname => {
    if (surname === '') {
      setErrorSurname(false); // ลบข้อผิดพลาดเมื่อช่องกรอกว่าง
    } else if (!surname.match(/^[ก-๏a-zA-Z\s]+$/)) {
      setErrorSurname(true);
      setErrorMessage(prev => ({
        ...prev,
        surname: 'นามสกุลควรเป็นตัวอักษรเท่านั้น',
      }));
    } else {
      setErrorSurname(false);
      setErrorMessage(prev => ({...prev, surname: ''}));
    }
  };

  const validatecustomRelationship = customRelationship => {
    if (customRelationship === '') {
      setErrorcustom(false); // ลบข้อผิดพลาดเมื่อช่องกรอกว่าง
    } else if (!customRelationship.match(/^[ก-๏a-zA-Z\s]+$/)) {
      setErrorcustom(true);
      setErrorMessage(prev => ({
        ...prev,
        customRelationship: 'ความเกี่ยวข้องต้องเป็นตัวอักษรเท่านั้น',
      }));
    } else {
      setErrorcustom(false);
      setErrorMessage(prev => ({...prev, customRelationship: ''}));
    }
  };

  const validateTel = tel => {
    if (tel === '') {
      setErrorTel(false); // ลบข้อผิดพลาดเมื่อช่องกรอกว่าง
    } else if (!tel.match(/^\d{10}$/)) {
      setErrorTel(true);
      setErrorMessage(prev => ({
        ...prev,
        tel: 'เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลัก',
      }));
    } else {
      setErrorTel(false);
      setErrorMessage(prev => ({...prev, tel: ''}));
    }
  };

  const validateIDCardNumber = ID_card_number => {
    if (ID_card_number === '') {
      setErrorIDCardNumber(false);
    } else if (!ID_card_number.match(/^\d{13}$/)) {
      setErrorIDCardNumber(true);
      setErrorMessage(prev => ({
        ...prev,
        ID_card_number: 'กรุณากรอกเลขบัตรประชาชน 13 หลัก',
      }));
    } else {
      setErrorIDCardNumber(false);
      setErrorMessage(prev => ({...prev, ID_card_number: ''}));
    }
  };

  const handleNameChange = text => {
    setName(text);
    validateName(text);
  };

  const handleSurnameChange = text => {
    setSurname(text);
    validateSurname(text);
  };

  const handleTelChange = text => {
    setTel(text);
    validateTel(text);
  };
  const handleCustomChange = text => {
    setCustomRelationship(text);
    validatecustomRelationship(text);
  };

  const handleIDCardNumberChange = text => {
    setIDCardNumber(text);
    validateIDCardNumber(text);
  };

  async function getData() {
    const token = await AsyncStorage.getItem('token');
    axios.post('http://10.0.2.2:5000/userdata', {token: token}).then(res => {
      setUserData(res.data.data);
      setUserId(res.data.data._id);
    });
  }

  useEffect(() => {
    getData();
  }, []);

  const addCaregiver = async () => {
    let hasError = false;

    if (!name.trim()) {
      setErrorName(true);
      setErrorMessage(prev => ({...prev, name: 'กรุณากรอกชื่อ'}));
      hasError = true;
    } else if (!name.match(/^[ก-๏a-zA-Z\s]+$/)) {
      setErrorName(true);
      setErrorMessage(prev => ({...prev, name: 'ชื่อควรเป็นตัวอักษรเท่านั้น'}));
      hasError = true;
    } else {
      setErrorName(false);
      setErrorMessage(prev => ({...prev, name: ''}));
    }

    if (!surname.trim()) {
      setErrorSurname(true);
      setErrorMessage(prev => ({...prev, surname: 'กรุณากรอกนามสกุล'}));
      hasError = true;
    } else if (!surname.match(/^[ก-๏a-zA-Z\s]+$/)) {
      setErrorSurname(true);
      setErrorMessage(prev => ({
        ...prev,
        surname: 'นามสกุลควรเป็นตัวอักษรเท่านั้น',
      }));
      hasError = true;
    } else {
      setErrorSurname(false);
      setErrorMessage(prev => ({...prev, surname: ''}));
    }

    if (!tel.trim()) {
      setErrorTel(true);
      setErrorMessage(prev => ({...prev, tel: 'กรุณากรอกเบอร์โทรศัพท์'}));
      hasError = true;
    } else if (!tel.match(/^\d{10}$/)) {
      setErrorTel(true);
      setErrorMessage(prev => ({
        ...prev,
        tel: 'เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลัก',
      }));
      hasError = true;
    } else {
      setErrorTel(false);
      setErrorMessage(prev => ({...prev, tel: ''}));
    }

    if (!ID_card_number.trim()) {
      setErrorIDCardNumber(true);
      setErrorMessage(prev => ({
        ...prev,
        ID_card_number: 'กรุณากรอกเลขบัตรประชาชน',
      }));
      hasError = true;
    } else if (!ID_card_number.match(/^\d{13}$/)) {
      setErrorIDCardNumber(true);
      setErrorMessage(prev => ({
        ...prev,
        ID_card_number: 'กรุณากรอกเลขบัตรประชาชน 13 หลัก',
      }));
      hasError = true;
    } else {
      setErrorIDCardNumber(false);
      setErrorMessage(prev => ({...prev, ID_card_number: ''}));
    }

    if (isCustomRelationship) {
      if (!customRelationship.trim()) {
        setErrorcustom(true);
        setErrorMessage(prev => ({
          ...prev,
          customRelationship: 'กรุณากรอกความเกี่ยวข้อง',
        }));
        hasError = true;
      } else if (!customRelationship.match(/^[ก-๏a-zA-Z\s]+$/)) {
        setErrorcustom(true);
        setErrorMessage(prev => ({
          ...prev,
          customRelationship: 'ความเกี่ยวข้องต้องเป็นตัวอักษรเท่านั้น',
        }));
        hasError = true;
      } else {
        setErrorcustom(false);
        setErrorMessage(prev => ({...prev, customRelationship: ''}));
      }
    }

    if (!Relationship.trim() && !isCustomRelationship) {
      setErrorRelationship(true);
      Toast.show({type: 'error', text1: 'กรุณาเลือกความเกี่ยวข้อง'});
      hasError = true;
    } else {
      setErrorRelationship(false);
    }

    if (hasError) {
      Toast.show({
        type: 'error',
        text1: 'ข้อมูลไม่ถูกต้อง',
        text2: 'กรุณาตรวจสอบและกรอกข้อมูลให้ครบถ้วน',
      });
      return;
    }

    try {
      const response = await axios.post('http://10.0.2.2:5000/addcaregiver', {
        user: userId,
        name,
        surname,
        tel,
        Relationship: isCustomRelationship ? customRelationship : Relationship,
        ID_card_number,
      });

      if (response.data.status === 'Ok') {
        Toast.show({
          type: 'success',
          text1: 'เพิ่มข้อมูลสำเร็จ',
          text1: 'เพิ่มข้อมูลผู้ดูแลสำเร็จแล้ว',
        });
        navigation.goBack();
      } else {
        Toast.show({
          type: 'error',
          text1: response.data.error || 'เกิดข้อผิดพลาด',
        });
      }
    } catch (error) {
      // console.error('Error adding caregiver:', error);
      if (error.response && error.response.data && error.response.data.error) {
        Toast.show({
          type: 'error',
          text1: error.response.data.error || 'เกิดข้อผิดพลาด',
          text2: "ผู้ป่วยมีข้อมูลผู้ดูแลคนนี้แล้ว"|| 'เกิดข้อผิดพลาด',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'เกิดข้อผิดพลาดในการเพิ่มข้อมูล',
        });
      }
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      navigation.getParent()?.setOptions({
        tabBarStyle: {display: 'none'},
      });
      return () => {
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

  const getCaregiverData = async ID_card_number => {
    // หาก IDCardNumber ว่างให้เคลียร์ข้อมูล
    if (!ID_card_number || ID_card_number.length < 13) {
      setName('');
      setSurname('');
      setTel('');
      setRelationship('');
      setCustomRelationship('');
      setErrorcustom(false);
      setErrorRelationship(false);
      setIsDataFetched(false);
      return;
    }
    try {
      const response = await axios.get(
        `http://10.0.2.2:5000/getCaregiverById/${ID_card_number}`,
      );
      if (response.data.status === 'Ok') {
        const caregiver = response.data.caregiver;
        setName(caregiver.name);
        setSurname(caregiver.surname);
        setTel(caregiver.tel);
        setIsDataFetched(true);
        setErrorMessage('')  ;  
        setErrorIDCardNumber(false);
        setErrorName(false);
        setErrorSurname(false);
        setErrorTel(false);
        setErrorRelationship(false);
        setErrorcustom(false);
        setRelationship('');
        setCustomRelationship('');
      } else {
        setName('');
        setSurname('');
        setTel('');
        setRelationship('');
        setCustomRelationship('');
        setIsDataFetched(false);
      }
    } catch (error) {
      console.error('Error fetching caregiver data:', error);
      Toast.show({type: 'error', text1: 'ไม่สามารถดึงข้อมูลได้'});
    }
  };

  useEffect(() => {
    getCaregiverData(ID_card_number);
  }, [ID_card_number]);

  return (
    <View
      style={{flex: 1}}
    >
      <ScrollView
        keyboardShouldPersistTaps={'always'}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 40}}
        style={{backgroundColor: '#F5F5F5'}}>
        <View style={style.container}>
          <View style={styles.info}>
            <Text style={styles.textLabel}>เลขบัตรประชาชน:</Text>
            <TextInput
              keyboardType="numeric"
              maxLength={13}
              style={[
                style.textInputRead,
                styles.textValue,
                errorIDCardNumber && {borderColor: 'red', borderWidth: 1},
              ]}
              onChangeText={handleIDCardNumberChange}
              value={ID_card_number}
            />
            {errorIDCardNumber && (
              <Text style={styles.errorText}>
                {errorMessage.ID_card_number}
              </Text>
            )}
          </View>
          <View style={styles.info}>
            <Text style={styles.textLabel}>ชื่อ:</Text>
            <TextInput
              style={[
                style.textInputRead,
                styles.textValue,
                errorName && { borderColor: 'red', borderWidth: 1 },
                { backgroundColor: isDataFetched ? '#e0e0e0' : 'white' }
              ]}
              onChangeText={handleNameChange}
              value={name}
              editable={!isDataFetched}
            />
            {errorName && (
              <Text style={styles.errorText}>{errorMessage.name}</Text>
            )}
          </View>
          <View style={styles.info}>
            <Text style={styles.textLabel}>นามสกุล:</Text>
            <TextInput
              style={[
                style.textInputRead,
                styles.textValue,
                errorSurname && {borderColor: 'red', borderWidth: 1},
                { backgroundColor: isDataFetched ? '#e0e0e0' : 'white' }

              ]}
              onChangeText={handleSurnameChange}
              value={surname}
              editable={!isDataFetched}
            />
            {errorSurname && (
              <Text style={styles.errorText}>{errorMessage.surname}</Text>
            )}
          </View>
          <View style={styles.info}>
            <Text style={styles.textLabel}>ความสัมพันธ์กับผู้ป่วย:</Text>
            <View
              style={[
                style.pickerContainer,
                errorRelationship && {borderColor: 'red', borderWidth: 1},
              ]}>
              <Picker
                mode="dropdown"
                style={[style.Picker, styles.textValue]}
                selectedValue={isCustomRelationship ? 'อื่น ๆ' : Relationship}
                onValueChange={itemValue => {
                  setErrorRelationship(false);
                  if (itemValue === 'อื่น ๆ') {
                    setIsCustomRelationship(true);
                    setRelationship('อื่น ๆ');
                    setCustomRelationship('');
                  } else {
                    setIsCustomRelationship(false);
                    setRelationship(itemValue);
                    setCustomRelationship('');
                  }
                }}>
                <Picker.Item
                  label="เลือกความสัมพันธ์"
                  value=""
                  style={styles.pickerItemStyle}
                />
                <Picker.Item
                  label="พ่อ"
                  value="พ่อ"
                  style={styles.pickerItemStyle}
                />
                <Picker.Item
                  label="แม่"
                  value="แม่"
                  style={styles.pickerItemStyle}
                />
                <Picker.Item
                  label="ลูก"
                  value="ลูก"
                  style={styles.pickerItemStyle}
                />
                <Picker.Item
                  label="สามี"
                  value="สามี"
                  style={styles.pickerItemStyle}
                />
                <Picker.Item
                  label="ภรรยา"
                  value="ภรรยา"
                  style={styles.pickerItemStyle}
                />
                <Picker.Item
                  label="อื่น ๆ"
                  value="อื่น ๆ"
                  style={styles.pickerItemStyle}
                />
                {/* <Picker.Item label="ไม่มีความเกี่ยวข้อง" value="ไม่มีความเกี่ยวข้อง" /> */}
              </Picker>
            </View>
            {errorRelationship && (
              <Text style={styles.errorText}>กรุณาเลือกความสัมพันธ์</Text>
            )}
          </View>
          {isCustomRelationship && (
            <View style={styles.info}>
              <Text style={styles.textLabel}>กรุณาระบุความสัมพันธ์:</Text>
              <TextInput
                style={[
                  style.textInputRead,
                  styles.textValue,
                  errorCustom && {borderColor: 'red', borderWidth: 1},
                ]}
                // onChangeText={text => setCustomRelationship(text)}
                onChangeText={handleCustomChange}
                value={customRelationship}
              />
              {errorCustom && (
                <Text style={styles.errorText}>
                  {errorMessage.customRelationship}
                </Text>
              )}
            </View>
          )}
          <View style={styles.info}>
            <Text style={styles.textLabel}>เบอร์โทรศัพท์:</Text>
            <TextInput
              keyboardType="numeric"
              maxLength={10}
              style={[
                style.textInputRead,
                styles.textValue,
                errorTel && {borderColor: 'red', borderWidth: 1},
                { backgroundColor: isDataFetched ? '#e0e0e0' : 'white' }

              ]}
              onChangeText={handleTelChange}
              value={tel}
              editable={!isDataFetched}
            />
            {errorTel && (
              <Text style={styles.errorText}>{errorMessage.tel}</Text>
            )}
          </View>
          <TouchableOpacity style={style.inBut} onPress={addCaregiver}>
            <View>
              <Text style={style.textinBut}>บันทึก</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
