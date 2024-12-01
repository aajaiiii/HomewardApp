import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {useRoute, useNavigation} from '@react-navigation/native';
import style from './style';
import Toast from 'react-native-toast-message';
import {Picker} from '@react-native-picker/picker';
import LinearGradient from 'react-native-linear-gradient';

export default function CaregiverEdit(props) {
  console.log(props);
  const [user, setUser] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [tel, setTel] = useState('');
  const [Relationship, setRelationship] = useState('');
  const [customRelationship, setCustomRelationship] = useState('');
  const [isCustomRelationship, setIsCustomRelationship] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();

  useFocusEffect(
    React.useCallback(() => {
      // ซ่อน TabBar เมื่อเข้าหน้านี้
      navigation.getParent()?.setOptions({
        tabBarStyle: { display: 'none' },
      });
      return () => {
        // แสดง TabBar กลับมาเมื่อออกจากหน้านี้
        navigation.getParent()?.setOptions({
          tabBarStyle: {  position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            elevation: 0,
            backgroundColor: '#fff',
            borderTopColor: 'transparent',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 6,
            height: 60,  }, // ปรับ 'flex' ให้ TabBar กลับมาแสดง
        });
      };
    }, [navigation])
  );

  useEffect(() => {
    const caregiverData = route.params.data;
    setUser(caregiverData.user);
    setName(caregiverData.name);
    setSurname(caregiverData.surname);
    setTel(caregiverData.tel);
    setRelationship(caregiverData.Relationship);
    if (caregiverData.Relationship === 'อื่น ๆ') {
      setIsCustomRelationship(true);
      setCustomRelationship(caregiverData.customRelationship || '');
    } else {
      setIsCustomRelationship(false);
      setRelationship(caregiverData.Relationship);
    }
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
        Relationship: isCustomRelationship ? customRelationship : Relationship,
      };

      console.log(formdata);

      const res = await axios.post(
        'http://10.53.57.175:5000/updatecaregiver',
        formdata,
      );
      console.log(res.data);
      if (res.data.status === 'Ok') {
        Toast.show({
          type: 'success',
          text1: 'แก้ไขสำเร็จ',
          text2: 'แก้ไขรหัสผ่านแล้ว',
        });
        navigation.navigate('User', {refresh: true});
      }
    } catch (error) {
      console.error('Error updating caregiver:', error);
    }
  };
  return (
    <LinearGradient
    // colors={['#00A9E0', '#5AB9EA', '#E0FFFF', '#FFFFFF']}
    colors={['#FFFFFF', '#FFFFFF']}
    style={{flex: 1}} // ให้ครอบคลุมทั้งหน้าจอ
  >
    <ScrollView
      keyboardShouldPersistTaps={'always'}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{paddingBottom: 40}}
      style={{backgroundColor: 'transparent'}}>
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
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={style.text}>เกี่ยวข้องเป็น</Text>
          <View style={style.pickerContainer}>
            <Picker
              style={[style.Picker, style.text]}
              selectedValue={isCustomRelationship ? 'อื่น ๆ' : Relationship}
              onValueChange={itemValue => {
                if (itemValue === 'อื่น ๆ') {
                  setIsCustomRelationship(true);
                } else {
                  setIsCustomRelationship(false);
                  setRelationship(itemValue);
                }
              }}>
              <Picker.Item label="เลือกความสัมพันธ์" value="" />
              <Picker.Item label="พ่อ" value="พ่อ" />
              <Picker.Item label="แม่" value="แม่" />
              <Picker.Item label="ลูก" value="ลูก" />
              <Picker.Item label="สามี" value="สามี" />
              <Picker.Item label="ภรรยา" value="ภรรยา" />
              <Picker.Item label="อื่น ๆ" value="อื่น ๆ" />
              {/* <Picker.Item label="ไม่มีความเกี่ยวข้อง" value="ไม่มีความเกี่ยวข้อง" /> */}

            </Picker>
          </View>
        </View>
        {isCustomRelationship && (
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={style.text}>กรุณาระบุ</Text>
            <TextInput
              style={[style.textInputRead, style.text]}
              onChangeText={text => setCustomRelationship(text)}
              value={customRelationship}
            />
          </View>
        )}
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
    </LinearGradient>
  );
}
