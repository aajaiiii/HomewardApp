import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {useRoute, useNavigation} from '@react-navigation/native';
import style from './style';
import Toast from 'react-native-toast-message';
import {Picker} from '@react-native-picker/picker'; // นำเข้า Picker ให้ถูกต้อง

export default function CaregiverEdit(props) {
  console.log(props);
  const [user, setUser] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [tel, setTel] = useState('');
  const [Relationship, setRelationship] = useState('');
  const navigation = useNavigation();
  const route = useRoute();

  useEffect(() => {
    const caregiverData = route.params.data;
    setUser(caregiverData.user);
    setName(caregiverData.name);
    setSurname(caregiverData.surname);
    setTel(caregiverData.tel);
    setRelationship(caregiverData.Relationship);
    console.log('sss', user);
  }, []);

  const updateCaregiver = async () => {
    try {
      if (!user) {
        console.error('User is null or undefined');
        return;
      }
      const formdata = {
        user: user,
        name,
        surname,
        tel,
        Relationship,
      };

      console.log(formdata);

      const res = await axios.post(
        'http://192.168.2.38:5000/updatecaregiver',
        formdata,
      );
      console.log(res.data);
      if (res.data.status === 'Ok') {
        Toast.show({
          type: 'success',
          text1: 'Updated',
          text2: 'แก้ไขรหัสผ่านแล้ว',
        });
        navigation.navigate('User', {refresh: true});
      }
    } catch (error) {
      console.error('Error updating caregiver:', error);
    }
  };
  return (
    <ScrollView
      keyboardShouldPersistTaps={'always'}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{paddingBottom: 40}}
      style={{ backgroundColor: '#F7F7F7'}}>
      <View style={style.container}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={style.text}>ชื่อ</Text>
          <TextInput
  style={[style.textInputRead, style.text]}
  onChangeText={text => setName(text)}           
  defaultValue={name}
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
        <View >
          <Text style={style.text}>เกี่ยวข้องเป็น</Text>
          <View style={style.pickerContainer}>
          <Picker
            style={[style.Picker, style.text]}
            selectedValue={Relationship}
            onValueChange={itemValue => setRelationship(itemValue)}>
            {/* <Picker.Item label="เลือกความสัมพันธ์" value="" /> */}
            <Picker.Item label="พ่อ" value="พ่อ" />
            <Picker.Item label="แม่" value="แม่" />
            <Picker.Item label="สามี" value="สามี" />
            <Picker.Item label="ภรรยา" value="ภรรยา" />
            <Picker.Item label="ลูก" value="ลูก" />
            <Picker.Item
              label="ไม่มีความเกี่ยวข้อง"
              value="ไม่มีความเกี่ยวข้อง"
            />
          </Picker>
          </View>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={style.text}>เบอร์โทรศัพท์</Text>
          <TextInput
            style={[style.textInputRead, style.text]}
            onChange={e => setTel(e.nativeEvent.text)}
            defaultValue={tel}
          />
        </View>
        <TouchableOpacity style={style.inBut} onPress={() => updateCaregiver()}>
          <View>
            <Text style={style.textinBut}>บันทึก</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
