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

function Informationone({route, props}) {
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
      .post('http://10.53.57.175:5000/userdata', {token: token})
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

  const Profile = () => {
    navigation.navigate('Profile');
  };

  const Nextpage = () => {
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
    };
    navigation.navigate('Informationtwo', {formData: formdata});
  };

  return (
    <ScrollView
      keyboardShouldPersistTaps={'always'}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{paddingBottom: 40}}
      style={{backgroundColor: '#fff'}}>
      <View>
        <View style={style.container}>
          <Text style={style.texthead}>ข้อมูลทั่วไป</Text>
          {/* <Text>1.ข้อมูลทั่วไป</Text> */}
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={style.textlabel}>ชื่อผู้ใช้</Text>
            <TextInput
              style={[style.text]}
              onChangeText={text => setUsername(text)}
              value={username}
              readOnly
            />
          </View>

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={style.textlabel}>เลขประจำตัวประชาชน</Text>
            <TextInput
              style={[style.text]}
              onChange={e => setIDCardNumber(e.nativeEvent.text)}
              value={ID_card_number}
              readOnly
            />
            {/* <TextInput
              style={[style.textInputRead, style.text]}
              onChange={e => setIDCardNumber(e.nativeEvent.text)}
              value={ID_card_number}
            /> */}
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={style.textlabel}>อีเมล</Text>
            <TextInput
              style={[style.textInputRead, style.text]}
              onChange={e => setEmail(e.nativeEvent.text)}
              value={email}
            />
          </View>
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
            <Text style={style.textlabel}>เพศ</Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity
                style={styleinfo.radio}
                onPress={() => setGender('ชาย')}>
                <View style={styleinfo.radioButton}>
                  {gender === 'ชาย' && (
                    <View style={styleinfo.radioButtonInner} />
                  )}
                </View>
                <Text style={styleinfo.radioButtonText}>ชาย</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styleinfo.radio}
                onPress={() => setGender('หญิง')}>
                <View style={styleinfo.radioButton}>
                  {gender === 'หญิง' && (
                    <View style={styleinfo.radioButtonInner} />
                  )}
                </View>
                <Text style={styleinfo.radioButtonText}>หญิง</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styleinfo.radio}
                onPress={() => setGender('ไม่ระบุ')}>
                <View style={styleinfo.radioButton}>
                  {gender === 'ไม่ระบุ' && (
                    <View style={styleinfo.radioButtonInner} />
                  )}
                </View>
                <Text style={styleinfo.radioButtonText}>ไม่ระบุ</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={style.textlabel}>วันเกิด</Text>
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
          </View>

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={style.textlabel}>สัญชาติ</Text>
            <TextInput
              style={[style.textInputRead, style.text]}
              onChange={e => setNationality(e.nativeEvent.text)}
              value={nationality}
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
            <Text style={style.textlabel}>ที่อยู่</Text>
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
            />
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
      {/* <TouchableOpacity onPress={Profile}>
        <Text title="Profile">Profile</Text>
      </TouchableOpacity> */}

      <View style={styleinfo.buttonnext}>
        <TouchableOpacity onPress={Nextpage} style={styleinfo.next}>
          <View>
            <Text style={styleinfo.textnext}>ถัดไป</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
export default Informationone;

const styleinfo = StyleSheet.create({
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
  next: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#5AB9EA',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 70,
    borderRadius: 10,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 3,
  },
  textnext: {
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
    textAlign:'center',
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
