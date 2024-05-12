import { Text, View, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRoute, useNavigation } from '@react-navigation/native';
import style from './style';
import Toast from 'react-native-toast-message';
import { Picker } from '@react-native-picker/picker'; // นำเข้า Picker ให้ถูกต้อง

export default function CaregiverEdit() {
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
    console.log("sss",user)
  }, []);

  const updateCaregiver = async () => {
    try {
      if (!user) {
        console.error("User is null or undefined");
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
  
      const res = await axios.post('http://192.168.2.43:5000/updatecaregiver', formdata);
      console.log(res.data);
      if (res.data.status === 'Ok') {
        Toast.show({
          type: 'success',
          text1: 'Updated',
        });
        navigation.navigate('User', { refresh: true });
      }
    } catch (error) {
      console.error("Error updating caregiver:", error);
    }

  
  };
  return (
    <ScrollView
      keyboardShouldPersistTaps={'always'}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{paddingBottom: 40}}>
      <View style={style.container}>
        <Text>ข้อมูลผู้ดูแล</Text>
        <View>
          <Text>ชื่อ</Text>
          <TextInput
            // placeholderTextColor={'#999797'}
            onChange={e => setName(e.nativeEvent.text)}
            defaultValue={name}
          />
        </View>
        <View>
          <Text>นามสกุล</Text>
          <TextInput
            // placeholderTextColor={'#999797'}
            onChange={e => setSurname(e.nativeEvent.text)}
            defaultValue={surname}
          />
        </View>
        <View>
          <Text>เกี่ยวข้องเป็น</Text>
          <Picker
            selectedValue={Relationship}
            onValueChange={(itemValue) => setRelationship(itemValue)}
          >
            <Picker.Item label="เลือกความสัมพันธ์" value="" />
            <Picker.Item label="พ่อ" value="พ่อ" />
            <Picker.Item label="แม่" value="แม่" />
            <Picker.Item label="สามี" value="สามี" />
            <Picker.Item label="ภรรยา" value="ภรรยา" />
            <Picker.Item label="ลูก" value="ลูก" />
            <Picker.Item label="ไม่มีความเกี่ยวข้อง" value="ไม่มีความเกี่ยวข้อง"/>
          </Picker>
        </View>
        <View>
          <Text>เบอร์โทรศัพท์</Text>
          <TextInput
            // placeholderTextColor={'#999797'}
            onChange={e => setTel(e.nativeEvent.text)}
            defaultValue={tel}
          />
        </View>
        <TouchableOpacity onPress={() => updateCaregiver()}>
          <View>
            <Text>บันทึก</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
