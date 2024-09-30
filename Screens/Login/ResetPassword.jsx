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

const ResetPasswordScreen = ({route, navigation}) => {
  const {email} = route.params;
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const resetPassword = async () => {
    try {
      const response = await axios.post(
        'http://192.168.2.57:5000/reset-password',
        {email, newPassword, confirmpassword: confirmPassword},
      );
      if (response.data === 'เปลี่ยนรหัสสำเร็จ') {
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
                onChangeText={setNewPassword}
                secureTextEntry
                style={stylei.textInput}
              />
            </View>
          </View>
          <View style={stylei.innerContainer}>
            <View style={stylei.textInputContainer}>
              <TextInput
                placeholder="ยืนยันรหัสผ่าน"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                style={stylei.textInput}
              />
            </View>
          </View>
          <TouchableOpacity style={stylei.button} onPress={resetPassword}>
            <View>
              <Text style={stylei.buttonText}>เปลี่ยนรหัสผ่าน</Text>
            </View>
          </TouchableOpacity>
          {message ? (
            <Text style={{marginTop: 20, color: 'red'}}>{message}</Text>
          ) : null}
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
    backgroundColor: '#87CEFA',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
  },
  text_header: {
    fontSize: 20,
    textAlign: 'center',
    fontWeight: '700',
    marginBottom: 10,
  },
  text: {
    textAlign: 'center',
    fontSize: 16,
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
    height: 40,
    fontSize: 16,
    color: '#333',
  },
});
