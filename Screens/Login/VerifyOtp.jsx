import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import styles from './style';
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Fontisto from 'react-native-vector-icons/Fontisto';

const VerifyOtp = ({route, navigation}) => {
  const {email} = route.params;
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [timer, setTimer] = useState(300);
  const [isOtpExpired, setIsOtpExpired] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    let countdown;
    if (timer > 0) {
      countdown = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else {
      setIsOtpExpired(true);
      setErrorMessage('OTP หมดอายุ');
      setSuccessMessage('');
    }
    return () => clearInterval(countdown);
  }, [timer]);

  const formatTime = time => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };
  const verifyOtp = async () => {
    try {
      const response = await axios.post('http://10.53.57.175:5000/verify-otp', {
        email,
        otp,
      });
      setMessage(response.data);
      navigation.navigate('ResetPassword', {email});
    } catch (error) {
      setMessage(error.response.data);
    }
  };

  const requestOtp = async () => {
    try {
      const response = await axios.post('http://10.53.57.175:5000/forgot-passworduser', { email });
      setMessage(response.data);
      setTimer(300);
      setIsOtpExpired(false);
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
          <Text style={stylei.text_header}>ยืนยันรหัส OTP</Text>
          <Text style={stylei.text}>กรุณากรอกรหัส OTP ที่ได้รับทางอีเมล</Text>
          <View style={stylei.innerContainer}>
            <View style={stylei.textInputContainer}>
              <TextInput
                placeholder="กรอกรหัสยืนยัน"
                value={otp}
                onChangeText={setOtp}
                style={stylei.textInput}
                // keyboardType="numeric"
              />
            </View>
          </View>
          {timer > 0 && (
            <Text style={stylei.timerText}>
              กรุณากรอก OTP ภายในเวลา {formatTime(timer)}
            </Text>
          )}
          {isOtpExpired && (
            <>
              <Text style={stylei.errorText}>{errorMessage}</Text>
              <TouchableOpacity
                style={stylei.button1}
                onPress={requestOtp}
                >
                <Text style={stylei.buttonText}>ขอ OTP ใหม่</Text>
              </TouchableOpacity>
            </>
          )}
          {/* {message ? <Text style={{marginTop: 20}}>{message}</Text> : null} */}

          <TouchableOpacity style={[stylei.button, isOtpExpired && stylei.buttonDisabled]} onPress={verifyOtp} disabled={isOtpExpired}>
            <View>
              <Text style={stylei.buttonText}>ยืนยัน OTP</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default VerifyOtp;

const stylei = StyleSheet.create({
  iconback: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  errorText:{
    fontSize: 14,
    color: '#666',
    marginVertical:8,
    marginLeft:1
  },
  timerText: {
    fontSize: 14,
    color: '#666',
    marginVertical:8,
    marginLeft:1
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
  button1: {
    backgroundColor: '#5AB9EA',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#5AB9EA',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#B0B0B0',
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
