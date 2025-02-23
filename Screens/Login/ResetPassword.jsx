import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from './style';
import Toast from 'react-native-toast-message';

const ResetPasswordScreen = ({route, navigation}) => {
  const {email} = route.params;
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const handleNewPasswordChange = (text) => {
    setNewPassword(text);
    if (text.length < 8) {
      setMessage('รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร');
    } else {
      setMessage('');
    }
  };

  const handleConfirmPasswordChange = (text) => {
    setConfirmPassword(text);
    if (newPassword && text !== newPassword) {
      setMessage('รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน');
    } else {
      setMessage('');
    }
  };

  const resetPassword = async () => {
    if (newPassword === '' || confirmPassword === '') {
      setMessage('กรุณากรอกข้อมูลให้ครบทั้งสองช่อง');
      return;
    }
    if (newPassword.length < 8) {
      setMessage('รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร');
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage('รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน');
      return;
    }
    try {
      const response = await axios.post(
        'http://10.0.2.2:5000/reset-password',
        {email, newPassword, confirmpassword: confirmPassword},
      );
      if (response.data === 'เปลี่ยนรหัสสำเร็จ') {
          Toast.show({
          type: 'success',
          text1: 'แก้ไขสำเร็จ',
          text2: 'เปลี่ยนรหัสผ่านแล้ว',
       });
        navigation.navigate('Login');
      } else {
        setMessage(response.data);
      }
    } catch (error) {
      setMessage(error.response.data);
    }
  };

  const goBack = () => {
    navigation.goBack();
  };
  const isButtonDisabled = newPassword === '' || confirmPassword === '';

  return (
    <ScrollView
      contentContainerStyle={{flexGrow: 1}}
      keyboardShouldPersistTaps={'always'}
      style={{backgroundColor: '#F7F7F7'}}>
      <View style={styles.pageforgot}>
        <TouchableOpacity style={stylei.iconback} onPress={goBack}>
          <Ionicons name={'arrow-back-outline'} size={22} color={'#000'} />
        </TouchableOpacity>
        <View style={styles.logoContainer}>
          <Image
            style={styles.logo}
            source={require('../../assets/Logoblue.png')}
          />
        </View>
        <View style={stylei.container}>
          <Text style={stylei.text_header}>เปลี่ยนรหัสผ่าน</Text>
          <View style={stylei.innerContainer}>
            <View style={stylei.textInputContainer}>
              <TextInput
                placeholder="รหัสผ่านใหม่"
                value={newPassword}
                onChangeText={handleNewPasswordChange}
                secureTextEntry={!showNewPassword}
                style={stylei.textInput}
              />
               <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
                <Ionicons
                  name={showNewPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color="#5AB9EA"
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={stylei.innerContainer}>
            <View style={stylei.textInputContainer}>
              <TextInput
                placeholder="ยืนยันรหัสผ่าน"
                value={confirmPassword}
                onChangeText={handleConfirmPasswordChange}
                secureTextEntry={!showConfirmPassword}
                style={stylei.textInput}
              />
                  <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                <Ionicons
                  name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color="#000"
                />
              </TouchableOpacity>
            </View>
          </View>
          {message ? (
            <Text style={{marginTop: 8,marginLeft:5, color: 'red',fontFamily: 'Kanit-Regular'}}>{message}</Text>
          ) : null}
        <TouchableOpacity
          style={[stylei.button, { backgroundColor: isButtonDisabled ? '#D3D3D3' : '#5AB9EA' }]} 
          onPress={resetPassword}
          disabled={isButtonDisabled}
        >
          <View>
            <Text style={stylei.buttonText}>เปลี่ยนรหัสผ่าน</Text>
          </View>
        </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default ResetPasswordScreen;

const stylei = StyleSheet.create({
  iconback: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  container: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4.65,
    elevation: 3,
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#5AB9EA',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Kanit-Regular',
  },
  text_header: {
    fontSize: 20,
    textAlign: 'center',
    fontFamily: 'Kanit-SemiBold',
    marginBottom: 10,
    color:'#000'
  },
  text: {
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'Kanit-Regular',
  },
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DCDCDC',
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 2,
    height: 45,
  },
  innerContainer: {
    marginTop: 20,
  },
  textInput: {
    flex: 1,
    height: 45,
    fontSize: 16,
    color: '#333',
    fontFamily: 'Kanit-Regular',
  },
});
