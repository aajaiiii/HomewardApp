import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { useFocusEffect } from '@react-navigation/native';

export default function UpdateOTP({route, navigation}) {
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const {username, email} = route.params || {};
  const [timer, setTimer] = useState(300);
  const [isOtpExpired, setIsOtpExpired] = useState(false);
  const inputRefs = useRef([]);
  useFocusEffect(
    React.useCallback(() => {
      // ซ่อน TabBar เมื่อเข้าหน้านี้
      navigation.getParent()?.setOptions({
        tabBarStyle: { display: 'none' },
      });
      return () => {
        // แสดง TabBar กลับมาเมื่อออกจากหน้านี้
        navigation.getParent()?.setOptions({
          tabBarStyle: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            elevation: 10, // สำหรับ Android
            backgroundColor: '#fff',
            borderTopColor: 'transparent',
            shadowColor: '#000', // สีเงา
            shadowOffset: { width: 0, height: -5 }, // ทิศทางเงา
            shadowOpacity: 0.15, // ความเข้มเงา
            shadowRadius: 10, // ความกระจายของเงา
            height: 65,
          },
        });
      };
    }, [navigation])
  );

  
  
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

  const verifyOtp = () => {
    if (isOtpExpired) {
      setErrorMessage('OTP หมดอายุ');
      return;
    }
    setErrorMessage('');
    setSuccessMessage('');
    const otp = otpDigits.join('');
    axios
      .post('http://10.0.2.2:5000/verify-otp3', {
        username,
        otp,
        newEmail: email,
      })
      .then(response => {
        if (response.data.success) {
          Toast.show({
            type: 'success',
            text1: 'เปลี่ยนอีเมลสำเร็จ',
            text2: 'อีเมลของคุณได้ถูกเปลี่ยนแปลงเรียบร้อยแล้ว',
          });

          navigation.getParent()?.setOptions({
            tabBarStyle: {   position: 'absolute',
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
              height: 60,  },
          });
          navigation.navigate('User', {refresh: true});
        } else {
          setErrorMessage("OTP ไม่ถูกต้องหรือหมดอายุ");
          setSuccessMessage("");
        }
      })
      .catch(error => {
        if (error.response) {
          // เมื่อมีการตอบกลับจากเซิร์ฟเวอร์
          setErrorMessage(error.response.data.error);
        } else {
          setErrorMessage('เกิดข้อผิดพลาด: ' + error.message);
        }
        // console.error('Error:', error);
      });
      
  };
  const handleRequestNewOtp = () => {
    setIsOtpExpired(false);
    setErrorMessage("");
    setSuccessMessage("");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('กรุณาใส่อีเมลที่ถูกต้อง');
      return;
    }

    axios
      .post('http://10.0.2.2:5000/send-otp3', {username, email})
      .then(res => {
        if (res.data.success) {
          setSuccessMessage('ส่ง OTP ใหม่เรียบร้อย');
          setTimer(300);
          setIsOtpExpired(false);
          setErrorMessage("");
        } else {
          setErrorMessage('เกิดข้อผิดพลาดในการส่ง OTP ใหม่');
        }
      })
      .catch(error => {
        setErrorMessage('เกิดข้อผิดพลาด');
        console.error('Error:', error);
      });
  };

  return (
    <ScrollView
      keyboardShouldPersistTaps={'always'}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
      style={styles.background}>
      <View style={styles.innerContainer}>
        <Text style={styles.headerText}>คุณจะได้รับรหัสยืนยันตัวตนที่:</Text>
        <Text style={styles.emailText}>{email}</Text>
        <View style={styles.otpContainer}>
          {otpDigits.map((digit, index) => (
            <TextInput
              key={index}
              ref={ref => (inputRefs.current[index] = ref)}
              style={styles.otpBox}
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
        {timer > 0 && (
          <Text style={styles.timerText}>
            กรุณากรอก OTP ภายในเวลา {formatTime(timer)}
          </Text>
        )}
        {/* {isOtpExpired && (
          <>
            <Text style={styles.errorText}>{errorMessage}</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={handleRequestNewOtp}>
              <Text style={styles.buttonText}>ขอ OTP ใหม่</Text>
            </TouchableOpacity>
          </>
        )} */}
          {isOtpExpired ? (
                   <>
                   <Text style={styles.errorText}>{errorMessage}</Text>
                   <TouchableOpacity
                     style={styles.button}
                     onPress={handleRequestNewOtp}>
                     <Text style={styles.buttonText}>ขอ OTP ใหม่</Text>
                   </TouchableOpacity>
                 </>
                   ) : (
                    <>
                    {errorMessage && !isOtpExpired &&(<Text style={styles.errorText}>{errorMessage}</Text>) }
                    </>
                   )}
        <TouchableOpacity
          onPress={verifyOtp}
          style={[styles.button, isOtpExpired && styles.buttonDisabled]}
          disabled={isOtpExpired}>
          <Text style={styles.buttonText}>ยืนยัน OTP</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 40,
    paddingHorizontal: 20,
    backgroundColor: '#F7F7F7',
  },
  background: {
    backgroundColor: '#F7F7F7',
  },
  innerContainer: {
    marginTop: 20,
  },
  headerText: {
    fontSize: 18,
    marginBottom: 5,
    color: '#333',
    fontFamily: 'Kanit-SemiBold',
  },
  emailText: {
    fontSize: 18,
    color: '#555',
    marginBottom: 20,
    fontFamily: 'Kanit-Regular',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
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
  timerText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: 'Kanit-Regular',
  },
  errorText: {
    textAlign: 'center',
    color: 'red',
    fontSize: 16,
    marginBottom: 10,
    fontFamily: 'Kanit-Regular',
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
});
