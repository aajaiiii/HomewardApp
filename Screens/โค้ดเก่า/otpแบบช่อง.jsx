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

export default function VerifyOtpEmail({route, navigation}) {
  const {username, email} = route.params || {};
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [timer, setTimer] = useState(300);
  const [isOtpExpired, setIsOtpExpired] = useState(false);

  // Create refs for each TextInput
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

  const formatTime = time => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  const handleOtpChange = (index, value) => {
    const newOtpDigits = [...otpDigits];
    newOtpDigits[index] = value;
    setOtpDigits(newOtpDigits);

    // Move to the next input if the current one is filled
    if (value.length === 1 && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const verifyOtp = () => {
    if (isOtpExpired) {
      setErrorMessage('OTP หมดอายุ');
      return;
    }

    const otp = otpDigits.join('');
    axios
      .post('https://us-central1-homeward-422311.cloudfunctions.net/api/verify-otp3', {
        username,
        otp,
        newEmail: email,
      })
      .then(response => {
        if (response.data.success) {
          Toast.show({
            type: 'success',
            text1: 'ยืนยันอีเมลสำเร็จ',
            text2: 'การยืนยันอีเมลของคุณสำเร็จแล้ว',
          });
          navigation.navigate('User', {refresh: true});
        } else {
          setErrorMessage('OTP ไม่ถูกต้องหรือหมดอายุ');
        }
      })
      .catch(error => {
        setErrorMessage('เกิดข้อผิดพลาด: ' + error.message);
        console.error('Error:', error);
      });
  };

  const handleRequestNewOtp = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('กรุณาใส่อีเมลที่ถูกต้อง');
      return;
    }

    axios
      .post('https://us-central1-homeward-422311.cloudfunctions.net/api/send-otp3', {username, email})
      .then(res => {
        if (res.data.success) {
          setSuccessMessage('ส่ง OTP ใหม่เรียบร้อย');
          setTimer(300);
          setIsOtpExpired(false);
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

        {/* OTP input boxes */}
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
            />
          ))}
        </View>

        {timer > 0 && (
          <Text style={styles.timerText}>
            กรุณากรอก OTP ภายในเวลา {formatTime(timer)}
          </Text>
        )}
        {isOtpExpired && (
          <>
            <Text style={styles.errorText}>{errorMessage}</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={handleRequestNewOtp}>
              <Text style={styles.buttonText}>ขอ OTP ใหม่</Text>
            </TouchableOpacity>
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
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  emailText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  otpBox: {
    width: 45,
    height: 45,
    borderWidth: 1,
    borderColor: '#DCDCDC',
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 20,
    color: '#333',
  },
  timerText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
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
});
