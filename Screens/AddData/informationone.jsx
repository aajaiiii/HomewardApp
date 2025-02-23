import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Animated,
} from 'react-native';
// import style from '../style';
import {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import styles from '../Login/style';
import {Picker} from '@react-native-picker/picker';
import DatePicker from 'react-native-date-picker';
import Toast from 'react-native-toast-message';

function Informationone({route, props}) {
  const { acceptPDPA } = route.params;  // รับค่าจาก ConsentScreen
  
  console.log("acceptPDPA:", acceptPDPA);
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
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [initialBirthday, setInitialBirthday] = useState('');
  const [inputHeight, setInputHeight] = useState(40);
  const [userData, setUserData] = useState('');
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [nameError, setNameError] = useState("");
  const [surnameError, setSurnameError] = useState("");
  const [telError, setTelError] = useState("");
  const [nationalityError, setNationalityError] = useState("");

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const currentDay = currentDate.getDate();
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
    console.log("Selected Day:", day);
    console.log("Selected Month:", month);
    console.log("Selected Year:", year);
    
    if (day && month && year) {
      const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day
        .toString()
        .padStart(2, '0')}`;
      setBirthday(formattedDate);
      console.log("Formatted Birthday:", formattedDate);
    }
  };
  
  useEffect(() => {
    handleBirthdayChange();
  }, [day, month, year]);
  
  const handleContentSizeChange = event => {
    setInputHeight(event.nativeEvent.contentSize.height);
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || birthday;
    setBirthday(currentDate);
    setShowDatePicker(Platform.OS === 'ios');
  };

  async function getData() {
    const token = await AsyncStorage.getItem('token');
    console.log(token);
    axios
      .post('http://10.0.2.2:5000/userdata', {token: token})
      .then(res => {
        console.log(res.data);
        setUserData(res.data.data);
        // setUsername(userData.username);
        // setIDCardNumber(userData.ID_card_number);
        // setEmail(userData.email);
        // setName(userData.name);
        // setSurname(userData.surname);
        // setGender(userData.gender);
        // setBirthday(userData.birthday);
        // setInitialBirthday(userData.birthday);
        // setNationality(userData.nationality);
        // setAddress(userData.Address);
        // setTel(userData.tel);
      });
  }

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    setUsername(userData.username);
    setIDCardNumber(userData.ID_card_number);
    setEmail(userData.email);
    setName(userData.name);
    setSurname(userData.surname);
    setGender(userData.gender);
    setBirthday(userData.birthday);
    setInitialBirthday(userData.birthday);
    setNationality(userData.nationality);
    setAddress(userData.Address);
    setTel(userData.tel);
  }, [userData]);

  useEffect(() => {
    if (userData.birthday) {
      const birthDate = new Date(userData.birthday);
      setDay(birthDate.getDate());
      setMonth(birthDate.getMonth() + 1); // ดึงเดือน (บวก 1 เพราะ getMonth() นับจาก 0)
      setYear(birthDate.getFullYear());
    }
  }, [userData.birthday]);

  const Profile = () => {
    navigation.navigate('Profile');
  };

  const Nextpage = () => {
    if (!username || !name || !surname || !email || !tel || !gender || !birthday || !ID_card_number || !nationality || !Address) {
      Toast.show({
        type: 'error',
        text1: 'กรุณากรอกข้อมูลให้ครบทุกช่อง',
        text2: 'โปรดตรวจสอบว่าคุณกรอกทุกช่องก่อนดำเนินการต่อ',
        visibilityTime: 3000,
      });
      return;
    }
  
    const formdata = {
      user: userData._id,
      username,
      name,
      email,
      surname,
      tel,
      gender,
      birthday,
      ID_card_number,
      nationality,
      Address,
      acceptPDPA, 
    };
    console.log("Birthday before sending:", birthday);

    navigation.navigate('Informationtwo', {formData: formdata});
  };
  const handleNameChange = (text) => {
    setName(text);
    if (/[^ก-๏a-zA-Z\s]/.test(text)) {
      setNameError("ชื่อต้องเป็นตัวอักษรเท่านั้น");
    } else {
      setNameError("");
    }
  };

  const handleSurnameChange = (text) => {
    setSurname(text);
    if (/[^ก-๏a-zA-Z\s]/.test(text)) {
      setSurnameError("นามสกุลต้องเป็นตัวอักษรเท่านั้น");
    } else {
      setSurnameError("");
    }
  };

  const handleNationalityChange = (text) => {
    setNationality(text);
    if (/[^ก-๏a-zA-Z\s]/.test(text)) {
      setNationalityError("สัญชาติต้องเป็นตัวอักษรเท่านั้น");
    } else {
      setNationalityError("");
    }
  };

  const handleTelChange = (text) => {
    const numericText = text.replace(/[^0-9]/g, ""); // ลบทุกอย่างที่ไม่ใช่ตัวเลข
    setTel(numericText);
  
    if (!/^[0-9]{10}$/.test(numericText)) {
      setTelError("กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง (10 หลัก)");
    } else {
      setTelError("");
    }
  };
  
  return (
    <View style={{flex: 1}}>
      <ScrollView
        keyboardShouldPersistTaps={'always'}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 40}}
        style={{backgroundColor: '#F5F5F5'}}>
        <View>
          <View style={[style.headcontainer]}>
            <Text style={style.texthead}>ข้อมูลทั่วไป</Text>
          </View>
          <View style={style.container}>
            {/* <Text>1.ข้อมูลทั่วไป</Text> */}
            {/* <View style={style.inputContainer}>
            <Text style={style.textlabel}>ชื่อผู้ใช้</Text>
            <TextInput
              style={[style.text]}
              onChangeText={text => setUsername(text)}
              value={username}
              readOnly
            />
          </View> */}

            <View style={style.inputContainer}>
              <Text style={style.textlabel}>เลขบัตรประชาชน</Text>
              <TextInput
                style={[style.textOnlyRead, style.text]}
                onChange={e => setIDCardNumber(e.nativeEvent.text)}
                value={ID_card_number}
                readOnly
                spellCheck={false} 
                autoCorrect={false}
              />
              {/* <TextInput
              style={[style.textInputRead, style.text]}
              onChange={e => setIDCardNumber(e.nativeEvent.text)}
              value={ID_card_number}
            /> */}
            </View>
            <View style={style.inputContainer}>
              <Text style={style.textlabel}>อีเมล:</Text>
              <TextInput
                style={[style.textInputRead, style.text]}
                onChange={e => setEmail(e.nativeEvent.text)}
                value={email}
                spellCheck={false} 
                autoCorrect={false}
              />
            </View>
            <View style={style.inputContainer}>
              <Text style={style.textlabel}>ชื่อ:</Text>
              <TextInput
                style={[style.textInputRead, style.text,      
                  nameError ? { borderColor: 'red', borderWidth: 1 } : {}
                ]}
                onChangeText={handleNameChange}
                value={name}
                spellCheck={false} 
                autoCorrect={false}
              />
            </View>
            {nameError ? <Text  style={style.errortext}>{nameError}</Text> : null}
            <View style={style.inputContainer}>
              <Text style={style.textlabel}>นามสกุล:</Text>
              <TextInput
                style={[style.textInputRead, style.text,      
                  surnameError ? { borderColor: 'red', borderWidth: 1 } : {}]}
                onChangeText={handleSurnameChange}
                value={surname}
                spellCheck={false} 
                autoCorrect={false}
              />
            </View>
            {surnameError ? <Text  style={style.errortext}>{surnameError}</Text> : null}

            <View style={style.inputContainer}>
              <Text style={style.textlabel}>เพศ:</Text>
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
                      backgroundColor:
                        gender === 'หญิง' ? '#FF69B4' : '#f8bbd0',
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

            {/* <View style={style.inputContainer}>
            <Text style={style.textlabel}>วันเกิด:</Text>
            <Text style={[style.textInputRead, style.text]}>
              {birthday
                ? new Date(birthday).toLocaleDateString('en-GB')
                : 'เลือกวันเกิด'}
            </Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <Ionicons
                name="calendar-outline"
                color="black"
                style={[styles.smallIcon, {marginLeft: 5}]}
              />
            </TouchableOpacity>
          </View> */}
            <View style={style.inputContainer}>
              <Text style={style.textlabel}>วัน เดือน ปีเกิด (พ.ศ.):</Text>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <View style={[style.pickerWrapper]}>
                  <Picker
                    selectedValue={day}
                    // mode="dropdown"
                    style={[style.pickerContainer]} // กำหนด width ของวัน
                    onValueChange={itemValue => {
                      setDay(itemValue);
                      handleBirthdayChange();
                    }}>
                    <Picker.Item
                      label="วัน"
                      value=""
                      style={style.pickerItemStyle}
                    />
                    {generateDays().map(d => (
                      <Picker.Item
                        key={d}
                        label={String(d)}
                        value={d}
                        style={style.pickerItemStyle}
                      />
                    ))}
                  </Picker>
                </View>
                <View style={[style.pickerWrapper]}>
                  {/* เลือกเดือน */}
                  <Picker
                    selectedValue={month}
                    // mode="dropdown"
                    style={[style.pickerContainer]} // กำหนด width ของเดือน
                    onValueChange={itemValue => {
                      setMonth(itemValue);
                      handleBirthdayChange();
                    }}>
                    <Picker.Item
                      label="เดือน"
                      value=""
                      style={style.pickerItemStyle}
                    />
                    {generateMonths().map((m, index) => (
                      <Picker.Item
                        key={index}
                        label={m.label}
                        value={m.value}
                        style={style.pickerItemStyle}
                      />
                    ))}
                  </Picker>
                </View>
                {/* เลือกปี */}
                <View style={[style.pickerWrapper]}>
                  <Picker
                    selectedValue={year}
                    // mode="dropdown"
                    style={[style.pickerContainer]} // กำหนด width ของปี
                    onValueChange={itemValue => {
                      setYear(itemValue);
                      handleBirthdayChange();
                    }}>
                    <Picker.Item
                      label="ปี"
                      value=""
                      style={style.pickerItemStyle}
                    />
                    {generateYears().map((y, index) => (
                      <Picker.Item
                        key={index}
                        label={y.label}
                        value={y.value}
                        style={style.pickerItemStyle}
                      />
                    ))}
                  </Picker>
                </View>
              </View>
            </View>

            <View style={style.inputContainer}>
              <Text style={style.textlabel}>สัญชาติ:</Text>
              <TextInput
                style={[style.textInputRead, style.text,      
                  nationalityError ? { borderColor: 'red', borderWidth: 1 } : {}]}
                  onChangeText={handleNationalityChange}
                value={nationality}
                spellCheck={false} 
                autoCorrect={false}
              />
            </View>
            {nationalityError ? <Text  style={style.errortext}>{nationalityError}</Text> : null}

            {showDatePicker && (
              <DateTimePicker
                value={birthday ? new Date(birthday) : new Date()}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}

            <View style={style.inputContainer}>
              <Text style={style.textlabel}>ที่อยู่:</Text>
              <TextInput
                multiline={true}
                style={[
                  style.textInputAddress,
                  style.text,
                  {height: Math.max(40, inputHeight)},
                ]}
                onChange={e => setAddress(e.nativeEvent.text)}
                value={Address}
                textAlignVertical="top"
                onContentSizeChange={handleContentSizeChange}
                spellCheck={false} 
                autoCorrect={false}
              />
            </View>
            <View style={style.inputContainer}>
              <Text style={style.textlabel}>เบอร์โทรศัพท์:</Text>
              <TextInput
              keyboardType="numeric"
              maxLength={10}
                style={[style.textInputRead, style.text,      
                  telError ? { borderColor: 'red', borderWidth: 1 } : {}]}
                // onChange={e => setTel(e.nativeEvent.text)}
                onChangeText={handleTelChange} 
                value={tel}
                spellCheck={false} 
                autoCorrect={false}
              />
            </View>
            {telError ? <Text  style={style.errortext}>{telError}</Text> : null}
          </View>
        </View>
        {/* <TouchableOpacity onPress={Profile}>
        <Text title="Profile">Profile</Text>
      </TouchableOpacity> */}
      </ScrollView>
      {/* <View style={styleinfo.buttonnext}> */}
      <View style={styleinfo.buttonoutnext}>
        <TouchableOpacity onPress={Nextpage} style={styleinfo.next}>
          <View>
            <Text style={styleinfo.textnext}>ถัดไป</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
export default Informationone;

const styleinfo = StyleSheet.create({
  // disabled:{
  //   color:'#9e9e9e'
  // },
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
  //ปุ่มเต็มจอ
  // buttonoutnext: {
  //   width: '100%', 
  //   backgroundColor: '#fafafa', 
  //   paddingVertical: 16, 
  //   alignItems: 'center',
  //   position: 'absolute',
  //   bottom: 0, 
  //   left: 0,
  //   right: 0,
  // },
  // next: {
  //   backgroundColor: '#5AB9EA',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   width: '90%', 
  //   paddingVertical: 12,
  //   borderRadius: 10,
  //   shadowColor: '#000',
  //   shadowOffset: {width: 0, height: 2},
  //   shadowOpacity: 0.8,
  //   shadowRadius: 2,
  //   elevation: 3,
  // },
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
    shadowOffset: { width: 0, height: 2 },
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

const style = StyleSheet.create({
  pickerItemStyle: {
    fontSize: 16, // ขนาดฟอนต์ที่ใหญ่ขึ้น
    color: '#000', // สีของข้อความ
    fontFamily: 'Kanit-Regular', // กำหนดฟอนต์
    // paddingVertical: 8,
    alignItems: 'center',
  },
  inputContainer: {
    marginBottom: 8,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#DCDCDC',
    borderRadius: 10,
    marginTop: 1,
    // marginVertical: 4,
    height: 45,
    marginRight: 2,
    alignItems: 'center',
    justifyContent: 'center',
    width: '33%',
  },
  textOnlyRead: {
    borderWidth: 1,
    borderColor: '#DCDCDC',
    backgroundColor: '#eeeeee',
    borderRadius: 10,
    paddingHorizontal: 8,
    marginTop: 1,
    height: 45,
    // marginVertical:10,
    lineHeight: 24,
    flex: 1,
  },
  headcontainer: {
    padding: 5,
    marginVertical: 10,
    backgroundColor: 'white',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#5AB9EA',
    backgroundColor: '#fff',
    marginHorizontal: 10,
    marginBottom: 2,
    backgroundColor: '#5AB9EA',
    // borderLeftWidth:5,
    // borderLeftColor: '#5AB9EA',
    // padding: 10,
    // margin: 12,
  },
  container: {
    padding: 15,
    marginVertical: 10,
    marginHorizontal: 15,
    backgroundColor: 'white',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    marginHorizontal: 10,
    marginBottom: 40,
    // padding: 10,
    // margin: 12,
    backgroundColor: '#fff',
    // borderRadius: 15,
  },
  text: {
    color: 'black',
    fontFamily: 'Kanit-Regular',
    fontSize: 16,
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
    fontFamily: 'Kanit-Regular',
    fontSize: 16,
    padding: 10,
  },
  textInputContainer: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    paddingHorizontal: 8,
    marginTop: 1,
  },
  textInputRead: {
    // borderWidth: 1,
    // borderColor: '#DCDCDC',
    // borderRadius: 10,
    // paddingHorizontal: 8,
    // marginTop: 1,
    // height: 45,
    // marginVertical: 4,
    // flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    fontSize: 16,
    color: '#1E293B',
    height:45,
  },
  textInputAddress: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    paddingHorizontal: 8,
    marginTop: 1,
    height: 80,
    marginVertical: 4,
    flex: 1,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    // paddingHorizontal: 8,
    marginTop: 1,
    height: 50,
    // marginVertical: 4,
    width: '100%',
    // width: 150,
  },
  Picker: {
    padding: 20,
    borderRadius: 20,
  },
  texthead: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 20,
    padding: 1,
    fontFamily: 'Kanit-SemiBold',
    // fontWeight: '700',
  },
  textWidth: {
    flex: 1,
  },
  textlabel: {
    color: '#000',
    fontSize: 16,
    fontFamily: 'Kanit-Medium',
    // color: '#5AB9EA',
    marginBottom: 4,
    // padding: 7,
    // fontFamily: 'Kanit-Regular',
    // fontWeight: '600',
  },
  errortext:{
    color: 'red', 
    fontSize: 14,
    fontFamily: 'Kanit-Regular',
    marginBottom:2,
  },
});
