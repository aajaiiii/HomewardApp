import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
} from 'react-native';
import {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {useRoute} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import DateTimePicker from '@react-native-community/datetimepicker';
import style from './style';

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
      .post('http://192.168.2.57:5000/userdata', {token: token})
      .then(res => {
        console.log(res.data);
        setUserData(res.data.data);

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

  const updateProfile = () => {
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
    axios.post('http://192.168.2.57:5000/updateuserapp', formdata).then(res => {
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

  return (
    <ScrollView
      keyboardShouldPersistTaps={'always'}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{paddingBottom: 40}}
      style={{backgroundColor: '#F7F7F7'}}>
      <View style={style.container}>
        <View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={style.text}>ชื่อผู้ใช้</Text>
            <TextInput
              style={[style.text]}
              onChangeText={text => setUsername(text)}
              value={username}
              readOnly
            />
          </View>

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={style.text}>เลขประจำตัวประชาชน</Text>
            <TextInput
              style={[style.text]}
              onChange={e => setIDCardNumber(e.nativeEvent.text)}
              defaultValue={ID_card_number}
              readOnly
            />
            {/* <TextInput
              style={[style.textInputRead, style.text]}
              onChange={e => setIDCardNumber(e.nativeEvent.text)}
              defaultValue={ID_card_number}
            /> */}
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={style.text}>อีเมล</Text>
            <TextInput
              style={[style.text]}
              onChange={e => setEmail(e.nativeEvent.text)}
              defaultValue={email}
              readOnly
            />
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={style.text}>ชื่อ</Text>
            <TextInput
              style={[style.textInputRead, style.text]}
              onChangeText={text => setName(text)}
              value={name}
            />
          </View>

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={style.text}>นามสกุล</Text>
            <TextInput
              style={[style.textInputRead, style.text]}
              onChange={e => setSurname(e.nativeEvent.text)}
              defaultValue={surname}
            />
          </View>

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={style.text}>เพศ</Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity
                style={styles.radio}
                onPress={() => setGender('ชาย')}>
                <View style={styles.radioButton}>
                  {gender === 'ชาย' && <View style={styles.radioButtonInner} />}
                </View>
                <Text style={styles.radioButtonText}>ชาย</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.radio}
                onPress={() => setGender('หญิง')}>
                <View style={styles.radioButton}>
                  {gender === 'หญิง' && (
                    <View style={styles.radioButtonInner} />
                  )}
                </View>
                <Text style={styles.radioButtonText}>หญิง</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.radio}
                onPress={() => setGender('ไม่ระบุ')}>
                <View style={styles.radioButton}>
                  {gender === 'ไม่ระบุ' && (
                    <View style={styles.radioButtonInner} />
                  )}
                </View>
                <Text style={styles.radioButtonText}>ไม่ระบุ</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={style.text}>วันเกิด</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <Text style={[style.textInputRead, style.text]}>
                {birthday
                  ? new Date(birthday).toLocaleDateString('en-GB')
                  : 'Select Birthday'}
              </Text>
            </TouchableOpacity>

            <Text style={style.text}>สัญชาติ</Text>
            <TextInput
              style={[style.textInputRead, style.text]}
              onChange={e => setNationality(e.nativeEvent.text)}
              defaultValue={nationality}
            />
          </View>
          {showDatePicker && (
            <DateTimePicker
              value={birthday ? new Date(birthday) : new Date()}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={style.text}>ที่อยู่</Text>
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
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={style.text}>เบอร์โทรศัพท์</Text>
            <TextInput
              style={[style.textInputRead, style.text]}
              onChange={e => setTel(e.nativeEvent.text)}
              defaultValue={tel}
            />
          </View>

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
});
