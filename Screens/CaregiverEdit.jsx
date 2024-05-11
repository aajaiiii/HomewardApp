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
import { ObjectId } from 'mongoose';

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
  }, []);

  const updateCaregiver = () => {
    const formdata = {
        user: user || '',
      name,
      surname,
      tel,
      Relationship,
    };

    console.log(formdata);
    axios
      .post('http://192.168.2.43:5000/updatecaregiver', formdata)
      .then(res => {
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
      <View>
        <Text>ข้อมูลผู้ดูแล</Text>
        <View>
          <Text>ชื่อ</Text>
          <TextInput
            placeholderTextColor={'#999797'}
            onChange={e => setName(e.nativeEvent.text)}
            defaultValue={name}
          />
        </View>
        <View>
          <Text>นามสกุล</Text>
          <TextInput
            placeholderTextColor={'#999797'}
            onChange={e => setSurname(e.nativeEvent.text)}
            defaultValue={surname}
          />
        </View>
        <View>
          <Text>เกี่ยวข้องเป็น</Text>
          <TextInput
            placeholderTextColor={'#999797'}
            onChange={e => setRelationship(e.nativeEvent.text)}
            defaultValue={Relationship}
          />
        </View>
        <View>
          <Text>เบอร์โทรศัพท์</Text>
          <TextInput
            placeholderTextColor={'#999797'}
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
