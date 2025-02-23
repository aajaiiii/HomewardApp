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
import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Fontisto from 'react-native-vector-icons/Fontisto';

const VerifyOtp = ({route, navigation}) => {
  const {email} = route.params;
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [message, setMessage] = useState('');
  const [timer, setTimer] = useState(300);
  const [isOtpExpired, setIsOtpExpired] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
const inputRefs = useRef([]);
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

  const handleOtpChange = (index, value) => {
    const newOtpDigits = [...otpDigits];

    if (value === '') {
      // หากลบค่าและไม่ใช่ช่องแรก ให้เลื่อนไปยังช่องก่อนหน้า
      if (index > 0) {
        inputRefs.current[index - 1].focus();
      }
      newOtpDigits[index] = '';
    } else {
      // กรอกค่าลงในช่องปัจจุบัน
      newOtpDigits[index] = value;
      // เลื่อนไปยังช่องถัดไปหากค่ามีความยาว 1 ตัว
      if (value.length === 1 && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }

    setOtpDigits(newOtpDigits);
    setErrorMessage('');
    setSuccessMessage('');
  };
  const formatTime = time => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };
  const verifyOtp = async () => {
    if (isOtpExpired) {
      setErrorMessage('OTP หมดอายุ');
      return;
    }
    setErrorMessage('');
    setSuccessMessage('');
    const otp = otpDigits.join('');
    try {
      const response = await axios.post('http://10.0.2.2:5000/verify-otp', {
        email,
        otp,
      });
      setMessage(response.data);
      navigation.navigate('ResetPassword', {email});
    } catch (error) {
      setErrorMessage("OTP ไม่ถูกต้องหรือหมดอายุ");
      setSuccessMessage("");
      setMessage(error.response.data);
    }
  };

  const requestOtp = async () => {
    setIsOtpExpired(false);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const response = await axios.post('http://10.0.2.2:5000/forgot-passworduser', { email });
      setMessage(response.data);
      setTimer(300);
      setIsOtpExpired(false);
      setErrorMessage("");
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
             <View style={stylei.otpContainer}>
                     {otpDigits.map((digit, index) => (
                       <TextInput
                         key={index}
                         ref={ref => (inputRefs.current[index] = ref)}
                         style={stylei.otpBox}
                         value={digit}
                         onChangeText={value => handleOtpChange(index, value)}
                         keyboardType="numeric"
                         maxLength={1}
                         returnKeyType="next"
                         onKeyPress={({nativeEvent}) => {
                           if (
                             nativeEvent.key === 'Backspace' &&
                             digit === '' &&
                             index > 0
                           ) {
                             // ลบโฟกัสไปยังช่องก่อนหน้าเมื่อกด Backspace
                             inputRefs.current[index - 1].focus();
                           }
                         }}
                       />
                     ))}
                   </View>
          </View>
          {timer > 0 && (
            <Text style={stylei.timerText}>
              กรุณากรอก OTP ภายในเวลา {formatTime(timer)}
            </Text>
          )}
        {isOtpExpired ? (
           <>
           <Text style={stylei.errorText}>{errorMessage}</Text>
           <TouchableOpacity
             style={stylei.button}
             onPress={requestOtp}>
             <Text style={stylei.buttonText}>ขอ OTP ใหม่</Text>
           </TouchableOpacity>
         </>
           ) : (
            <>
            {errorMessage && !isOtpExpired &&(<Text style={stylei.errorText}>{errorMessage}</Text>) }
            </>
           )}
          {/* {isOtpExpired && (
            <>
              <Text style={stylei.errorText}>{errorMessage}</Text>
              <TouchableOpacity
                style={stylei.button1}
                onPress={requestOtp}
                >
                <Text style={stylei.buttonText}>ขอ OTP ใหม่</Text>
              </TouchableOpacity>
            </>
          )} */}
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
    fontSize: 16,
    color: 'red',
    textAlign:'center',
    marginBottom: 10,
    fontFamily: 'Kanit-Regular',
  },
  timerText: {
    fontSize: 16,
    color: '#666',
    marginVertical:8,
    textAlign:'center',
    fontFamily: 'Kanit-Regular',
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
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  otpBox: {
    width: 45,
    height: 55,
    borderWidth: 1,
    borderColor: '#DCDCDC',
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 20,
    color: '#333',
    fontFamily: 'Kanit-Regular',
  },
  innerContainer: {
    marginTop: 20,
  },
  textInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#333',
    fontFamily: 'Kanit-Regular',
  },

});
