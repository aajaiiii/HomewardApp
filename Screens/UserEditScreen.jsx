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
  const [showRadio, setShowRadio] = useState(false);

  const toggleRadio = () => {
    setShowRadio(!showRadio);
  };

  const handleGenderSelection = selectedGender => {
    setGender(selectedGender);
    setShowRadio(false);
  };
  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toLocaleDateString();
      setBirthday(formattedDate);
    } else {
      setBirthday(initialBirthday);
    }
  };

  const formatDate = date => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear() % 100;

    const formattedDay = day < 10 ? `0${day}` : `${day}`;
    const formattedMonth = month < 10 ? `0${month}` : `${month}`;
    const formattedYear = year < 10 ? `0${year}` : `${year}`;

    return `${formattedDay}/${formattedMonth}/${formattedYear}`;
  };

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
      tel,
      gender,
      birthday,
      ID_card_number,
      nationality,
      Address,
    };

    console.log(formdata);
    axios.post('http://192.168.2.43:5000/updateuser', formdata).then(res => {
      console.log(res.data);
      if (res.data.status == 'Ok') {
        Toast.show({
          type: 'success',
          text1: 'Updated',
        });
        navigation.navigate('User', {refresh: true});
      }
    });
  };

  return (
    <ScrollView
      keyboardShouldPersistTaps={'always'}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{paddingBottom: 40}}>
      <View style={style.container}>
        <View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={style.texthead}>ชื่อผู้ใช้</Text>
            <TextInput
              style={[style.text]}
              onChangeText={text => setUsername(text)}
              value={username}
              readOnly
            />
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={style.texthead}>อีเมล</Text>
            <TextInput
              style={[style.text]}
              onChange={e => setEmail(e.nativeEvent.text)}
              defaultValue={email}
              readOnly
            />
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={style.texthead}>เลขประจำตัวประชาชน</Text>
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
            <Text style={style.texthead}>ชื่อ</Text>
            <TextInput
              style={[style.textInputRead, style.text]}
              onChangeText={text => setName(text)}
              value={name}
            />
          </View>

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={style.texthead}>นามสกุล</Text>
            <TextInput
              style={[style.textInputRead, style.text]}
              onChange={e => setSurname(e.nativeEvent.text)}
              defaultValue={surname}
            />
          </View>

<View style={{flexDirection: 'row', alignItems: 'center'}}>
  <Text style={style.texthead}>เพศ</Text>
  <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
  <TouchableOpacity style={styles.radio} onPress={() => setGender('ชาย')}>
    <View style={styles.radioButton}>
      {gender === 'ชาย' && <View style={styles.radioButtonInner} />}
    </View>
    <Text style={styles.radioButtonText}>ชาย</Text>
  </TouchableOpacity>
  <TouchableOpacity style={styles.radio}  onPress={() => setGender('หญิง')}>
    <View style={styles.radioButton}>
      {gender === 'หญิง' && <View style={styles.radioButtonInner} />}
    </View>
    <Text style={styles.radioButtonText}>หญิง</Text>
  </TouchableOpacity>
  <TouchableOpacity style={styles.radio}   onPress={() => setGender('ไม่ระบุ')}>
    <View style={styles.radioButton}>
      {gender === 'ไม่ระบุ' && <View style={styles.radioButtonInner} />}
    </View>
    <Text style={styles.radioButtonText}>ไม่ระบุ</Text>
  </TouchableOpacity>
</View>

</View>


          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={style.texthead}>วันเกิด</Text>

            <TouchableOpacity
              onPress={() => !showDatePicker && setShowDatePicker(true)}>
              <Text style={[style.textInputRead, style.text]}>
                {birthday &&
                  (showDatePicker
                    ? formatDate(new Date(birthday))
                    : formatDate(new Date(initialBirthday)))}
              </Text>
            </TouchableOpacity>
            <Text style={style.texthead}>สัญชาติ</Text>
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
            <Text style={style.texthead}>ที่อยู่</Text>
            <TextInput
              multiline={true}
              numberOfLines={4}
              style={[style.textInputAddress, style.text]}
              onChange={e => setAddress(e.nativeEvent.text)}
              defaultValue={Address}
            />
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={style.texthead}>เบอร์โทรศัพท์</Text>
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
  radio:{
    flexDirection: 'row', 
    alignItems: 'center',
    marginRight: 10
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
