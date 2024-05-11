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
        navigation.navigate('User', { refresh: true });
      }
      
    });
  };

  return (
    <ScrollView
      keyboardShouldPersistTaps={'always'}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{paddingBottom: 40}}>
      <View style={styles.container}>
        <Text style={styles.infoEditFirst_text}>ข้อมูลทั่วไป</Text>

        <View
          style={{
            // marginTop: 10,
            marginHorizontal: 22,
          }}>
          <View style={styles.infoEditView}>
            <Text style={styles.infoEditFirst_text}>ชื่อผู้ใช้</Text>
            <TextInput
              placeholderTextColor={'#999797'}
              style={styles.infoEditSecond_text}
              onChangeText={text => setUsername(text)}
              value={username}
            />
          </View>

          <View style={styles.infoEditView}>
            <Text style={styles.infoEditFirst_text}>ชื่อ</Text>
            <TextInput
              placeholderTextColor={'#999797'}
              style={styles.infoEditSecond_text}
              onChangeText={text => setName(text)}
              value={name}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="default"
            />
          </View>
          <View style={styles.infoEditView}>
            <Text style={styles.infoEditFirst_text}>นามสกุล</Text>
            <TextInput
              placeholderTextColor={'#999797'}
              style={styles.infoEditSecond_text}
              onChange={e => setSurname(e.nativeEvent.text)}
              defaultValue={surname}
            />
          </View>

          <View style={styles.infoEditView}>
            <Text style={styles.infoEditFirst_text}>เพศ</Text>
            <TouchableOpacity onPress={toggleRadio}>
              <TextInput
                placeholderTextColor={'#999797'}
                style={styles.infoEditSecond_text}
                editable={false}
                value={gender}
              />
            </TouchableOpacity>
          </View>
          <Modal
            visible={showRadio}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setShowRadio(false)}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <TouchableOpacity onPress={() => handleGenderSelection('ชาย')}>
                  <View style={styles.radioButton}>
                    {gender === 'ชาย' && (
                      <View style={styles.radioButtonInner} />
                    )}
                  </View>
                  <Text style={styles.modalItem}>{'ชาย'}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleGenderSelection('หญิง')}>
                  <View style={styles.radioButton}>
                    {gender === 'หญิง' && (
                      <View style={styles.radioButtonInner} />
                    )}
                  </View>
                  <Text style={styles.modalItem}>{'หญิง'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleGenderSelection('ไม่ระบุ')}>
                  <View style={styles.radioButton}>
                    {gender === 'ไม่ระบุ' && (
                      <View style={styles.radioButtonInner} />
                    )}
                  </View>
                  <Text style={styles.modalItem}>{'ไม่ระบุ'}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowRadio(false)}>
                  <Text style={styles.modalItemCancel}>{'ยกเลิก'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <View style={styles.infoEditView}>
            <Text style={styles.infoEditFirst_text}>วันเกิด</Text>

            <TouchableOpacity
              onPress={() => !showDatePicker && setShowDatePicker(true)}>
              <Text style={styles.infoEditSecond_text}>
                {birthday &&
                  (showDatePicker
                    ? formatDate(new Date(birthday))
                    : formatDate(new Date(initialBirthday)))}
              </Text>
            </TouchableOpacity>
          </View>
          {showDatePicker && (
            <DateTimePicker
              value={birthday ? new Date(birthday) : new Date()}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}

          <View style={styles.infoEditView}>
            <Text style={styles.infoEditFirst_text}>สัญชาติ</Text>
            <TextInput
              placeholderTextColor={'#999797'}
              style={styles.infoEditSecond_text}
              onChange={e => setNationality(e.nativeEvent.text)}
              defaultValue={nationality}
            />
          </View>

          <View style={styles.infoEditView}>
            <Text style={styles.infoEditFirst_text}>
              เลขประจำตัวบัตรประชาชน
            </Text>
            <TextInput
              placeholderTextColor={'#999797'}
              style={styles.infoEditSecond_text}
              onChange={e => setIDCardNumber(e.nativeEvent.text)}
              defaultValue={ID_card_number}
            />
          </View>

          <View style={styles.infoEditView}>
            <Text style={styles.infoEditFirst_text}>ที่อยู่</Text>
            <TextInput
              placeholderTextColor={'#999797'}
              style={styles.infoEditSecond_text}
              onChange={e => setAddress(e.nativeEvent.text)}
              defaultValue={Address}
            />
          </View>
          <View style={styles.infoEditView}>
            <Text style={styles.infoEditFirst_text}>เบอร์โทรศัพท์</Text>
            <TextInput
              placeholderTextColor={'#999797'}
              style={styles.infoEditSecond_text}
              onChange={e => setTel(e.nativeEvent.text)}
              defaultValue={tel}
            />
          </View>
          <View style={styles.infoEditView}>
            <Text style={styles.infoEditFirst_text}>อีเมล</Text>
            <TextInput
              placeholderTextColor={'#999797'}
              style={styles.infoEditSecond_text}
              onChange={e => setEmail(e.nativeEvent.text)}
              defaultValue={email}
              readOnly
            />
          </View>
          <TouchableOpacity
            onPress={() => updateProfile()}
            style={styles.inBut}>
            <View>
              <Text style={styles.textSign}>บันทึก</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    margin: 15,
    elevation: 2,
  },
  textStyle: {
    color: 'black',
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 10,
  },
  textSign: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  inBut: {
    width: '70%',
    backgroundColor: '#87CEFA',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 50,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  textSign: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  nameText: {
    color: 'white',
    fontSize: 24,

    fontStyle: 'normal',
    fontFamily: 'Open Sans',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  infoEditView: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: '#e6e6e6',
    borderBottomWidth: 1,
    paddingBottom: 5,
  },
  infoEditFirst_text: {
    color: '#7d7c7c',
    fontSize: 16,
    fontWeight: '400',
  },
  infoEditSecond_text: {
    color: 'black',
    fontStyle: 'normal',
    fontFamily: 'Open Sans',
    fontSize: 15,
    textAlignVertical: 'center',
    textAlign: 'right',
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: 300,
  },
  modalItem: {
    fontSize: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#000',
  },
});
