import {StyleSheet, Text, View, Button, TouchableOpacity,ScrollView,TextInput} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {useRoute} from '@react-navigation/native';
import { RadioButton } from 'react-native-radio-buttons-group'; 
export default function UserEditScreen(props) {
    const [gender, setGender] = useState('ชาย'); // ตั้งค่าเริ่มต้นเป็น 'ชาย' หรือค่าที่ต้องการ

  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [tel, setTel] = useState('');
//   const [gender, setGender] = useState('');
  const [birthday, setBirthday] = useState('');
  const [ID_card_number, setIDCardNumber] = useState('');
  const [nationality, setNationality] = useState('');
  const [Address, setAddress] = useState('');
  const route = useRoute();

  useEffect(() => {
    const userData = route.params.data;
    setUsername(userData.username);
    setName(userData.name);
    setEmail(userData.email);
    setSurname(userData.surname);
    setTel(userData.tel);
    setGender(userData.gender || 'ชาย'); // กำหนดค่าเริ่มต้นเป็น 'ชาย' หากไม่มีค่า gender ที่ถูกกำหนด
    setBirthday(userData.birthday);
    setIDCardNumber(userData.ID_card_number);
    setNationality(userData.nationality);
    setAddress(userData.Address);
  }, []);

  const updateProfile = () => {
    const formdata = {
      name: name,
      surname,
      tel,
      gender,
      birthday,
      ID_card_number,
      nationality,
      Address,
    };

    console.log(formdata);
    axios.post('http://192.168.2.40:5000//updateuser', formdata).then(res => {
      console.log(res.data);
      if (res.data.status == 'Ok') {
        Toast.show({
          type: 'success',
          text1: 'Updated',
        });
      }
    });
  };
  return (
    <ScrollView
      keyboardShouldPersistTaps={'always'}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{paddingBottom: 40}}>
      <View style={styles.container}>
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
              onChange={e => setUsername(e.nativeEvent.text)}
              defaultValue={username}
            />
          </View>
          <View style={styles.infoEditView}>
            <Text style={styles.infoEditFirst_text}>ชื่อ</Text>
            <TextInput
              placeholderTextColor={'#999797'}
              style={styles.infoEditSecond_text}
              onChange={e => setName(e.nativeEvent.text)}
              defaultValue={name}
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
            <Text style={styles.infoEditFirst_text}>Gender</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={styles.radioView}>
  <Text style={styles.radioText}>ชาย</Text>
  <RadioButton
    value="ชาย"
    status={gender === 'ชาย' ? 'checked' : 'unchecked'} // ตรวจสอบค่า gender เพื่อกำหนดสถานะ
    onPress={() => {
      setGender('ชาย');
    }}
  />
</View>

<View style={styles.radioView}>
  <Text style={styles.radioText}>หญิง</Text>
  <RadioButton
    value="หญิง"
    status={gender === 'หญิง' ? 'checked' : 'unchecked'} // ตรวจสอบค่า gender เพื่อกำหนดสถานะ
    onPress={() => {
      setGender('หญิง');
    }}
  />
</View>

            </View>
          </View>

          <View style={styles.infoEditView}>
            <Text style={styles.infoEditFirst_text}>วันเกิด</Text>
            <TextInput
              placeholderTextColor={'#999797'}
              style={styles.infoEditSecond_text}
              onChange={e => setBirthday(e.nativeEvent.text)}
              defaultValue={birthday}
            />
          </View>

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
            <Text style={styles.infoEditFirst_text}>เลขประจำตัวบัตรประชาชน</Text>
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
              <Text style={styles.textSign}>Update Profile</Text>
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
    padding: 15,
    borderRadius: 10,
    margin: 10,
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
    marginLeft:'auto',
    marginRight:'auto',
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
});
