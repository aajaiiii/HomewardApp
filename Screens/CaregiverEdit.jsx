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
import styles from './stylesCaregiver';
import Toast from 'react-native-toast-message';
import {Picker} from '@react-native-picker/picker';
import LinearGradient from 'react-native-linear-gradient';

export default function CaregiverEdit(props) {
  console.log(props);
  const [user, setUser] = useState('');
  const [IDcardnumber, setIDcardnumber] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [tel, setTel] = useState('');
  const [Relationship, setRelationship] = useState('');
  const [customRelationship, setCustomRelationship] = useState('');
  const [isCustomRelationship, setIsCustomRelationship] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
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
  });

  const validateName = (name) => {
    if (name === '') {
      setErrorName(false); // ลบข้อผิดพลาดเมื่อช่องกรอกว่าง
    } else if (!name.match(/^[ก-๏a-zA-Z\s]+$/)) {
      setErrorName(true);
      setErrorMessage((prev) => ({ ...prev, name: 'ชื่อควรเป็นตัวอักษรเท่านั้น' }));
    } else {
      setErrorName(false);
      setErrorMessage((prev) => ({ ...prev, name: '' }));
    }
  };
  
  const validateSurname = (surname) => {
    if (surname === '') {
      setErrorSurname(false); // ลบข้อผิดพลาดเมื่อช่องกรอกว่าง
    } else if (!surname.match(/^[ก-๏a-zA-Z\s]+$/)) {
      setErrorSurname(true);
      setErrorMessage((prev) => ({
        ...prev,
        surname: 'นามสกุลควรเป็นตัวอักษรเท่านั้น',
      }));
    } else {
      setErrorSurname(false);
      setErrorMessage((prev) => ({ ...prev, surname: '' }));
    }
  };
  
  const validatecustomRelationship = (customRelationship) => {
    if (customRelationship === '') {
      setErrorcustom(false); // ลบข้อผิดพลาดเมื่อช่องกรอกว่าง
    } else if (!customRelationship.match(/^[ก-๏a-zA-Z\s]+$/)) {
      setErrorcustom(true);
      setErrorMessage((prev) => ({
        ...prev,
        customRelationship: 'ความเกี่ยวข้องต้องเป็นตัวอักษรเท่านั้น',
      }));
    } else {
      setErrorcustom(false);
      setErrorMessage((prev) => ({ ...prev, customRelationship: '' }));
    }
  };
  
  const validateTel = (tel) => {
    if (tel === '') {
      setErrorTel(false); // ลบข้อผิดพลาดเมื่อช่องกรอกว่าง
    } else if (!tel.match(/^\d{10}$/)) {
      setErrorTel(true);
      setErrorMessage((prev) => ({
        ...prev,
        tel: 'เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลัก',
      }));
    } else {
      setErrorTel(false);
      setErrorMessage((prev) => ({ ...prev, tel: '' }));
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

  // const handleIDCardNumberChange = text => {
  //   setIDCardNumber(text);
  //   validateIDCardNumber(text);
  // };

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
            shadowOffset: { width: 0, height: -5 }, 
            shadowOpacity: 0.15,
            shadowRadius: 10, 
            height: 65,
          },
        });
      };
    }, [navigation]),
  );

  useEffect(() => {
    const caregiverData = route.params.data;
    setUser(caregiverData.userRelationships?.[0]?.user || ''); // ป้องกัน undefined
    setIDcardnumber(caregiverData.ID_card_number || '');

    setName(caregiverData.name || '');
    setSurname(caregiverData.surname || '');
    setTel(caregiverData.tel || '');
    const relationship =
      caregiverData.userRelationships?.[0]?.relationship || '';

    const predefinedRelationships = ['พ่อ', 'แม่', 'ลูก', 'สามี', 'ภรรยา'];

    if (predefinedRelationships.includes(relationship)) {
      setIsCustomRelationship(false);
      setRelationship(relationship);
      setCustomRelationship(''); 
    } else {
      setIsCustomRelationship(true);
      setRelationship('อื่น ๆ');
      setCustomRelationship(relationship); 
    }
    console.log('sss', user);
  }, []);

  const updateCaregiver = async () => {
    try {
      if (!user || !route.params?.data?._id) {
        Toast.show({
          type: 'error',
          text1: 'เกิดข้อผิดพลาด',
          text2: 'ไม่มีข้อมูลผู้ดูแล',
        });
        return;
      }
        let hasError = false;
      
          // ตรวจสอบชื่อ
          if (!name.trim()) {
            setErrorName(true);
            setErrorMessage(prev => ({ ...prev, name: 'กรุณากรอกชื่อ' }));
            hasError = true;
          } else if (!name.match(/^[ก-๏a-zA-Z\s]+$/)) {
            setErrorName(true);
            setErrorMessage(prev => ({ ...prev, name: 'ชื่อควรเป็นตัวอักษรเท่านั้น' }));
            hasError = true;
          } else {
            setErrorName(false);
            setErrorMessage(prev => ({ ...prev, name: '' }));
          }
        
          // ตรวจสอบนามสกุล
          if (!surname.trim()) {
            setErrorSurname(true);
            setErrorMessage(prev => ({ ...prev, surname: 'กรุณากรอกนามสกุล' }));
            hasError = true;
          } else if (!surname.match(/^[ก-๏a-zA-Z\s]+$/)) {
            setErrorSurname(true);
            setErrorMessage(prev => ({ ...prev, surname: 'นามสกุลควรเป็นตัวอักษรเท่านั้น' }));
            hasError = true;
          } else {
            setErrorSurname(false);
            setErrorMessage(prev => ({ ...prev, surname: '' }));
          }
        
          // ตรวจสอบเบอร์โทรศัพท์
          if (!tel.trim()) {
            setErrorTel(true);
            setErrorMessage(prev => ({ ...prev, tel: 'กรุณากรอกเบอร์โทรศัพท์' }));
            hasError = true;
          } else if (!tel.match(/^\d{10}$/)) {
            setErrorTel(true);
            setErrorMessage(prev => ({ ...prev, tel: 'เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลัก' }));
            hasError = true;
          } else {
            setErrorTel(false);
            setErrorMessage(prev => ({ ...prev, tel: '' }));
          }
        
      
          // ตรวจสอบความเกี่ยวข้อง (ถ้าเลือกกำหนดเอง)
          if (isCustomRelationship) {
            if (!customRelationship.trim()) {
              setErrorcustom(true);
              setErrorMessage(prev => ({ ...prev, customRelationship: 'กรุณากรอกความเกี่ยวข้อง' }));
              hasError = true;
            } else if (!customRelationship.match(/^[ก-๏a-zA-Z\s]+$/)) {
              setErrorcustom(true);
              setErrorMessage(prev => ({ ...prev, customRelationship: 'ความเกี่ยวข้องต้องเป็นตัวอักษรเท่านั้น' }));
              hasError = true;
            } else {
              setErrorcustom(false);
              setErrorMessage(prev => ({ ...prev, customRelationship: '' }));
            }
          }
        
      
          // ตรวจสอบความเกี่ยวข้อง
      if (!Relationship.trim() && !isCustomRelationship) {
        setErrorRelationship(true);
        Toast.show({ type: 'error', text1: 'กรุณาเลือกความเกี่ยวข้อง' });
        hasError = true;
      } else {
        setErrorRelationship(false);
      }
      
          // ถ้ามีข้อผิดพลาด ไม่ให้ส่งข้อมูล
          if (hasError) {
            Toast.show({ type: 'error',   text1: 'ข้อมูลไม่ถูกต้อง', 
              text2: 'กรุณาตรวจสอบและกรอกข้อมูลให้ครบถ้วน'  });
            return;
          }
        
      const formdata = {
        _id: route.params.data._id,
        user,
        name,
        surname,
        tel,
        Relationship: isCustomRelationship ? customRelationship : Relationship,
      };

      console.log(formdata);

      const res = await axios.post(
        'http://10.0.2.2:5000/updatecaregiver',
        formdata,
      );
      console.log(res.data);
      if (res.data.status === 'Ok') {
        Toast.show({
          type: 'success',
          text1: 'แก้ไขสำเร็จ',
          text2: 'แก้ไขข้อมูลผู้ดูแลแล้ว',
        });
        navigation.navigate('Caregiver', {refresh: true});
      }
    } catch (error) {
      console.error('Error updating caregiver:', error);
    }
  };
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
            <Text style={styles.textLabel}>เลขบัตรประชาชน</Text>
            <TextInput
              style={[style.textOnlyRead, styles.textValue]}
              // onChangeText={text => setName(text)}
              defaultValue={IDcardnumber}
              readOnly
            />
          </View>

          <View style={styles.info}>
            <Text style={styles.textLabel}>ชื่อ</Text>
            <TextInput
              style={[
                style.textInputRead,
                styles.textValue,
                errorName && {borderColor: 'red', borderWidth: 1},
              ]}
              onChangeText={handleNameChange}             
               defaultValue={name}
            />
               {errorName && (
                          <Text style={styles.errorText}>{errorMessage.name}</Text>
                        )}
          </View>
          <View style={styles.info}>
            <Text style={styles.textLabel}>นามสกุล</Text>
            <TextInput
               style={[
                style.textInputRead,
                styles.textValue,
                errorSurname && {borderColor: 'red', borderWidth: 1},
              ]}
              onChangeText={handleSurnameChange}
              defaultValue={surname}
            />
            {errorSurname && (
              <Text style={styles.errorText}>{errorMessage.surname}</Text>
            )}
          </View>
          <View style={styles.info}>
            <Text style={styles.textLabel}>ความสัมพันธ์กับผู้ป่วย:</Text>
            <View style={[style.pickerContainer, errorRelationship && { borderColor: 'red', borderWidth: 1 }]}>
              <Picker
                style={[style.Picker, styles.textValue]}
                selectedValue={isCustomRelationship ? 'อื่น ๆ' : Relationship}
                onValueChange={itemValue => {
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
                <Picker.Item label="เลือกความสัมพันธ์" value="" style={styles.pickerItemStyle} />
                <Picker.Item label="พ่อ" value="พ่อ" style={styles.pickerItemStyle}/>
                <Picker.Item label="แม่" value="แม่" style={styles.pickerItemStyle}/>
                <Picker.Item label="ลูก" value="ลูก" style={styles.pickerItemStyle}/>
                <Picker.Item label="สามี" value="สามี" style={styles.pickerItemStyle}/>
                <Picker.Item label="ภรรยา" value="ภรรยา" style={styles.pickerItemStyle}/>
                <Picker.Item label="อื่น ๆ" value="อื่น ๆ" style={styles.pickerItemStyle}/>
                {/* <Picker.Item label="ไม่มีความเกี่ยวข้อง" value="ไม่มีความเกี่ยวข้อง" /> */}
              </Picker>
            </View>
            {errorRelationship && <Text style={styles.errorText}>กรุณาเลือกความสัมพันธ์</Text>}

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
              <Text style={styles.errorText}>{errorMessage.customRelationship}</Text>
            )}
            </View>
          )}
          <View style={styles.info}>
            <Text style={styles.textLabel}>เบอร์โทรศัพท์</Text>
            <TextInput
             keyboardType="numeric"
             maxLength={10}
             style={[
               style.textInputRead,
               styles.textValue,
               errorTel && {borderColor: 'red', borderWidth: 1},
             ]}
             onChangeText={handleTelChange}
              defaultValue={tel}
            />
            {errorTel && (
              <Text style={styles.errorText}>{errorMessage.tel}</Text>
            )}
          </View>
          <TouchableOpacity
            style={style.inBut}
            onPress={() => updateCaregiver()}>
            <View>
              <Text style={style.textinBut}>บันทึก</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
