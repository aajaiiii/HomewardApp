import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {useRoute} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import DateTimePicker from '@react-native-community/datetimepicker';
import style from './style';
import LinearGradient from 'react-native-linear-gradient';
import DatePicker from 'react-native-date-picker';
import {Picker} from '@react-native-picker/picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

export default function UserEditScreen(props) {
  console.log(props);
  const navigation = useNavigation();
  const [gender, setGender] = useState('');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [tel, setTel] = useState('');
  const [birthday, setBirthday] = useState('');
  const [ID_card_number, setIDCardNumber] = useState('');
  const [nationality, setNationality] = useState('');
  const [Address, setAddress] = useState('');
  const route = useRoute();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [initialBirthday, setInitialBirthday] = useState('');
  const [inputHeight, setInputHeight] = useState(40);
  const [userData, setUserData] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [nameError, setNameError] = useState('');
  const [surnameError, setSurnameError] = useState('');
  const [telError, setTelError] = useState('');
  const [nationalityError, setNationalityError] = useState('');

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const currentDay = currentDate.getDate();

  useFocusEffect(
    React.useCallback(() => {
      // ซ่อน TabBar เมื่อเข้าหน้านี้
      navigation.getParent()?.setOptions({
        tabBarStyle: {display: 'none'},
      });
      // return () => {
      //   navigation.getParent()?.setOptions({
      //     tabBarStyle: {display: 'none'},
      //   });
      // };
    }, [navigation]),
  );

  const generateDays = () => {
    let maxDays = 31;
    if (year == currentYear && month == currentMonth) {
      maxDays = currentDay; // จำกัดแค่วันที่ปัจจุบัน
    } else if (month) {
      maxDays = new Date(year, month, 0).getDate(); // หาจำนวนวันของเดือนที่เลือก
    }
    return Array.from({length: maxDays}, (_, i) => i + 1);
  };

  // const thaiMonths = [
  //   'มกราคม',
  //   'กุมภาพันธ์',
  //   'มีนาคม',
  //   'เมษายน',
  //   'พฤษภาคม',
  //   'มิถุนายน',
  //   'กรกฎาคม',
  //   'สิงหาคม',
  //   'กันยายน',
  //   'ตุลาคม',
  //   'พฤศจิกายน',
  //   'ธันวาคม',
  // ];
  const thaiMonths = [
    'ม.ค.',
    'ก.พ.',
    'มี.ค.',
    'เม.ย.',
    'พ.ค.',
    'มิ.ย.',
    'ก.ค.',
    'ส.ค.',
    'ก.ย.',
    'ต.ค.',
    'พ.ย.',
    'ธ.ค.',
  ];
  const generateMonths = () => {
    let availableMonths = thaiMonths.map((month, index) => ({
      label: month,
      value: index + 1,
    }));

    if (year == currentYear) {
      availableMonths = availableMonths.slice(0, currentMonth); // จำกัดแค่เดือนที่ถึงปัจจุบัน
    }

    return availableMonths;
  };
  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 100; // ย้อนหลังไป 100 ปี
    let years = [];

    for (let year = currentYear; year >= startYear; year--) {
      years.push({label: `${year + 543}`, value: year}); // แปลง ค.ศ. -> พ.ศ.
    }

    return years;
  };

  // เมื่อเลือกวัน, เดือน, ปีครบแล้วให้รวมเป็นวันเกิด
  const handleBirthdayChange = () => {
    if (day && month && year) {
      const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day
        .toString()
        .padStart(2, '0')}`;
      setBirthday(formattedDate); // เซ็ตค่าลง state
    }
  };

  const handleContentSizeChange = event => {
    setInputHeight(event.nativeEvent.contentSize.height);
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || birthday;
    setBirthday(currentDate);
    setShowDatePicker(Platform.OS === 'ios');
    setShowDatePicker(false);
  };

  async function getData() {
    const token = await AsyncStorage.getItem('token');
    console.log(token);
    axios.post('http://10.0.2.2:5000/userdata', {token: token}).then(res => {
      console.log(res.data);
      setUserData(res.data.data);
      setIsEmailVerified(res.data.data.isEmailVerified);
      console.log(userData);
    });
  }

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const userData = route.params.data;
    setUsername(userData.username);
    setName(userData.name);
    setEmail(userData.email);
    setSurname(userData.surname);
    setTel(userData.tel);
    setGender(userData.gender);
    setBirthday(userData.birthday);
    setInitialBirthday(userData.birthday);
    setIDCardNumber(userData.ID_card_number);
    setNationality(userData.nationality);
    setAddress(userData.Address);
    console.log('Birthday:', birthday);
    console.log('Initial Birthday:', initialBirthday);
  }, []);

  useEffect(() => {
    if (userData.birthday) {
      const birthDate = new Date(userData.birthday);
      setDay(birthDate.getDate());
      setMonth(birthDate.getMonth() + 1); // ดึงเดือน (บวก 1 เพราะ getMonth() นับจาก 0)
      setYear(birthDate.getFullYear());
    }
  }, [userData.birthday]);

  const updateProfile = () => {
    if (
      !name ||
      !surname ||
      !tel ||
      !gender ||
      !birthday ||
      !nationality ||
      !Address
    ) {
      // if (!name) {
      //   setNameError("กรุณากรอกชื่อ");
      // }
      // if (!surname) {
      //   setSurnameError("กรุณากรอกนามสกุล");
      // }
      Toast.show({
        type: 'error',
        text1: 'กรุณากรอกข้อมูลให้ครบทุกช่อง',
        text2: 'โปรดตรวจสอบว่าคุณกรอกทุกช่องก่อนดำเนินการต่อ',
        visibilityTime: 3000,
      });
      return;
    }

    if (nameError || surnameError || telError || nationalityError) {
      Toast.show({
        type: 'error',
        text1: 'ข้อมูลไม่ถูกต้อง',
        text2: 'โปรดแก้ไขข้อผิดพลาดก่อนดำเนินการต่อ',
        visibilityTime: 3000,
      });
      return;
    }
    
    setNameError('');
    setSurnameError('');
    const formdata = {
      username: username,
      name,
      surname,
      email,
      tel,
      gender,
      birthday,
      ID_card_number,
      nationality,
      Address,
    };

    console.log(formdata);
    axios.post('http://10.0.2.2:5000/updateuserapp', formdata).then(res => {
      console.log(res.data);
      if (res.data.status == 'Ok') {
        Toast.show({
          type: 'success',
          text1: 'แก้ไขสำเร็จ',
          text2: 'แก้ไขข้อมูลทั่วไปแล้ว',
        });
        navigation.navigate('User', {refresh: true});
      }
    });
  };

  const handleNameChange = text => {
    setName(text);
    if (/[^ก-๏a-zA-Z\s]/.test(text)) {
      setNameError('ชื่อต้องเป็นตัวอักษรเท่านั้น');
    } else {
      setNameError('');
    }
  };

  const handleSurnameChange = text => {
    setSurname(text);
    if (/[^ก-๏a-zA-Z\s]/.test(text)) {
      setSurnameError('นามสกุลต้องเป็นตัวอักษรเท่านั้น');
    } else {
      setSurnameError('');
    }
  };

  const handleNationalityChange = text => {
    setNationality(text);
    if (/[^ก-๏a-zA-Z\s]/.test(text)) {
      setNationalityError('สัญชาติต้องเป็นตัวอักษรเท่านั้น');
    } else {
      setNationalityError('');
    }
  };

  const handleTelChange = text => {
    const numericText = text.replace(/[^0-9]/g, '');
    setTel(numericText);

    if (!/^[0-9]{10}$/.test(numericText)) {
      setTelError('กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง (10 หลัก)');
    } else {
      setTelError('');
    }
  };

  return (
    <ScrollView
      keyboardShouldPersistTaps={'always'}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{paddingBottom: 40}}
      style={{backgroundColor: '#F5F5F5'}}>
      <View style={style.container}>
        <View>
          <View style={styles.info}>
            <Text style={styles.textLabel}>ชื่อผู้ใช้:</Text>
            <TextInput
              style={[style.textOnlyRead, styles.textValue]}
              onChangeText={text => setUsername(text)}
              value={username}
              readOnly
            />
          </View>

          <View style={styles.info}>
            <Text style={styles.textLabel}>เลขบัตรประชาชน:</Text>
            <TextInput
              style={[style.textOnlyRead, styles.textValue]}
              onChange={e => setIDCardNumber(e.nativeEvent.text)}
              defaultValue={ID_card_number}
              readOnly
            />
            {/* <TextInput
              style={[style.textInputRead, styles.textValue]}
              onChange={e => setIDCardNumber(e.nativeEvent.text)}
              defaultValue={ID_card_number}
            /> */}
          </View>
          <View style={styles.info}>
            <Text style={styles.textLabel}>อีเมล:</Text>
            <TouchableOpacity
              style={styles.inputContainer}
              onPress={() => {
                if (!isEmailVerified) {
                  navigation.navigate('EmailVerification', {data: userData});
                } else {
                  navigation.navigate('UpdateEmail', {data: userData});
                }
              }}>
              <TextInput
                style={[styles.textValue]}
                onChange={e => setEmail(e.nativeEvent.text)}
                value={email}
                editable={false}
              />
              <View style={styles.emailActions}>
                {!isEmailVerified ? (
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('EmailVerification', {data: userData})
                    }
                    style={styles.verifyEmailButton}>
                    <Ionicons name="chevron-forward" size={24} color="black" />
                    {/* <Text style={styles.verifyEmailText}>ยืนยันอีเมล</Text> */}
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('UpdateEmail', {data: userData})
                    }
                    style={styles.editEmailButton}>
                    <Ionicons name="chevron-forward" size={24} color="black" />
                    {/* <Text style={styles.editEmailText}>เปลี่ยนอีเมล</Text> */}
                  </TouchableOpacity>
                )}
              </View>
            </TouchableOpacity>
          </View>
          {!isEmailVerified && (
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
                ⚠ กรุณายืนยันอีเมลของคุณเพื่อความปลอดภัย
              </Text>
            </View>
          )}
          <View style={styles.info}>
            <Text style={styles.textLabel}>ชื่อ:</Text>
            <TextInput
              style={[
                style.textInputRead,
                styles.textValue,
                nameError ? {borderColor: 'red', borderWidth: 1} : {},
              ]}
              // onChangeText={text => setName(text)}
              onChangeText={handleNameChange}
              value={name}
            />
          </View>
          {nameError ? <Text style={styles.errortext}>{nameError}</Text> : null}

          <View style={styles.info}>
            <Text style={styles.textLabel}>นามสกุล:</Text>
            <TextInput
              style={[
                style.textInputRead,
                styles.textValue,
                surnameError ? {borderColor: 'red', borderWidth: 1} : {},
              ]}
              onChangeText={handleSurnameChange}
              defaultValue={surname}
            />
          </View>
          {surnameError ? (
            <Text style={styles.errortext}>{surnameError}</Text>
          ) : null}

          <View style={style.inputContainer}>
            <Text style={styles.textLabel}>เพศ:</Text>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <TouchableOpacity
                style={[
                  styleinfo.genderButton,
                  {backgroundColor: gender === 'ชาย' ? '#5677fc' : '#d0d9ff'}, // สีฟ้า
                ]}
                onPress={() => setGender('ชาย')}>
                <Ionicons name="male" size={24} color="#fff" />
                <Text style={styleinfo.genderButtonText}>ชาย</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styleinfo.genderButton,
                  {
                    backgroundColor: gender === 'หญิง' ? '#FF69B4' : '#f8bbd0',
                  }, // สีชมพู
                ]}
                onPress={() => setGender('หญิง')}>
                <Ionicons name="female" size={24} color="#fff" />
                <Text style={styleinfo.genderButtonText}>หญิง</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styleinfo.genderButton,
                  {
                    backgroundColor:
                      gender === 'ไม่ระบุ' ? '#4CAF50' : '#A5D6A7',
                  }, // สีเขียวอ่อน
                ]}
                onPress={() => setGender('ไม่ระบุ')}>
                <Ionicons name="help-circle" size={24} color="#fff" />
                <Text style={styleinfo.genderButtonText}>ไม่ระบุ</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.info}>
            <Text style={styles.textLabel}>วัน เดือน ปีเกิด (พ.ศ.):</Text>
            <View style={styles.datePickerRow}>
              {/* เลือกวัน */}
              <View style={[styles.pickerWrapper, {flex: 1}]}>
                <Picker
                  selectedValue={day}
                  style={[
                    styles.pickerContainer,
                    styles.dayPicker,
                    {width: '100%'},
                  ]}
                  mode="dropdown"
                  onValueChange={itemValue => {
                    setDay(itemValue);
                    handleBirthdayChange();
                  }}>
                  <Picker.Item
                    label="วัน"
                    value=""
                    style={styles.pickerItemStyle}
                  />
                  {generateDays().map(d => (
                    <Picker.Item
                      key={d}
                      label={String(d)}
                      value={d}
                      style={styles.pickerItemStyle}
                    />
                  ))}
                </Picker>
              </View>
              <View style={[styles.pickerWrapper, {flex: 1}]}>
                <Picker
                  selectedValue={month}
                  mode="dropdown"
                  style={[
                    styles.pickerContainer,
                    styles.monthPicker,
                    {width: '100%'},
                  ]}
                  onValueChange={itemValue => {
                    setMonth(itemValue);
                    handleBirthdayChange();
                  }}>
                  <Picker.Item
                    label="เดือน"
                    value=""
                    style={styles.pickerItemStyle}
                  />
                  {generateMonths().map((m, index) => (
                    <Picker.Item
                      key={index}
                      label={m.label}
                      value={m.value}
                      style={styles.pickerItemStyle}
                    />
                  ))}
                </Picker>
              </View>
              <View style={[styles.pickerWrapper, {flex: 1.1}]}>
                <Picker
                  selectedValue={year}
                  mode="dropdown"
                  style={[
                    styles.pickerContainer,
                    styles.YearPicker,
                    {width: '100%'},
                  ]}
                  onValueChange={itemValue => {
                    setYear(itemValue);
                    handleBirthdayChange();
                  }}>
                  <Picker.Item
                    label="ปี"
                    value=""
                    style={styles.pickerItemStyle}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  />
                  {generateYears().map((y, index) => (
                    <Picker.Item
                      key={index}
                      label={y.label}
                      value={y.value}
                      style={styles.pickerItemStyle}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    />
                  ))}
                </Picker>
              </View>
            </View>
          </View>

          <View style={styles.info}>
            <Text style={styles.textLabel}>สัญชาติ:</Text>
            <TextInput
              style={[
                style.textInputRead,
                style.text,
                nationalityError ? {borderColor: 'red', borderWidth: 1} : {},
              ]}
              onChangeText={handleNationalityChange}
              defaultValue={nationality}
            />
            
          </View>
          {nationalityError ? (
              <Text style={styles.errortext}>{nationalityError}</Text>
            ) : null}
          {showDatePicker && (
            <DateTimePicker
              value={birthday ? new Date(birthday) : new Date()}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}

          <View style={styles.info}>
            <Text style={styles.textLabel}>ที่อยู่:</Text>
            <TextInput
              multiline={true}
              style={[
                style.textInputAddress,
                style.text,
                {height: Math.max(40, inputHeight)},
              ]}
              onChange={e => setAddress(e.nativeEvent.text)}
              defaultValue={Address}
              textAlignVertical="top"
              onContentSizeChange={handleContentSizeChange}
            />
          </View>
          <View style={styles.info}>
            <Text style={styles.textLabel}>เบอร์โทรศัพท์:</Text>
            <TextInput
              keyboardType="numeric"
              maxLength={10}
              style={[
                style.textInputRead,
                styles.textValue,
                telError ? {borderColor: 'red', borderWidth: 1} : {},
              ]}
              onChangeText={handleTelChange}
              defaultValue={tel}
            />
          </View>
          {telError ? <Text style={styles.errortext}>{telError}</Text> : null}

          <TouchableOpacity onPress={() => updateProfile()} style={style.inBut}>
            <View>
              <Text style={style.textinBut}>บันทึก</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  info: {
    marginVertical: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center', // จัดให้อยู่ตรงกลางแนวตั้ง
    borderWidth: 1,
    borderColor: '#DCDCDC',
    borderRadius: 10,
    paddingHorizontal: 8,
    marginTop: 1,
    height: 45,
    flex: 1,
  },
  // emailActions: {
  //   marginLeft: 8
  // },
  verifyEmailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: '#00A9E0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  verifyEmailText: {
    color: 'white',
    // marginLeft: 5,
    fontFamily: 'Kanit-Regular',
  },
  editEmailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: 'lightgray',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  editEmailText: {
    color: 'black',
    // marginLeft: 5,
    fontFamily: 'Kanit-Regular',
  },
  pickerItemStyle: {
    fontSize: 16,
    color: '#000',
    fontFamily: 'Kanit-Regular',
    paddingVertical: 8,
    alignItems: 'center',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#DCDCDC',
    borderRadius: 10,
    marginTop: 1,
    // marginVertical: 4,
    flex: 1,
    height: 45,
    marginRight: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  datePickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pickerContainer: {
    flex: 1, // ทำให้ picker ขยายเต็มพื้นที่
    height: 45, // ความสูงของ picker
    width: '100%',
  },

  textLabel: {
    fontSize: 16,
    color: '#616161',
    fontFamily: 'Kanit-Regular',
    lineHeight: 24,
    marginVertical: 2,
  },
  textValue: {
    fontFamily: 'Kanit-Regular',
    fontSize: 16,
    color: 'black',
    // textAlign: 'right',
    flex: 1,
    lineHeight: 24,
  },
  radio: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'black',
  },
  radioButtonText: {
    fontSize: 16,
    color: 'black',
  },
  warningBox: {
    marginTop: 8,
    padding: 10,
    // borderWidth: 1,
    // borderColor: 'orange',
    backgroundColor: '#ffe0b2', // สีส้มอ่อน
    borderRadius: 8,
  },
  warningText: {
    color: '#f57c00',
    fontSize: 16,
    fontFamily: 'Kanit-Regular',
    // fontWeight: 'bold',
    textAlign: 'center',
  },
  errortext: {
    color: 'red',
    fontSize: 14,
    fontFamily: 'Kanit-Regular',
    marginBottom: 2,
  },
});

const styleinfo = StyleSheet.create({
  genderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
  },
  genderButtonText: {
    fontFamily: 'Kanit-Regular',
    fontSize: 16,
    // fontWeight: 'bold',
    color: '#fff',
    marginLeft: 5,
  },
  radio: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'black',
  },
  radioButtonText: {
    fontSize: 16,
    color: 'black',
  },
  buttonnext: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginHorizontal: 10,
    marginTop: 10,
  },
  buttonoutnext: {
    width: '100%',
    backgroundColor: '#fafafa',
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
  },
  next: {
    backgroundColor: '#5AB9EA',
    alignItems: 'center',
    justifyContent: 'center',
    width: '45%',
    paddingVertical: 12,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 3,
  },
  textnext: {
    color: '#fff',
    fontFamily: 'Kanit-Medium',
    fontSize: 16,
  },
});
