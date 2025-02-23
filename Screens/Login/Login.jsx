import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import styles from './style';
import {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Feather';
import Icon1 from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';

function LoginPage({getData}) {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleInputUsernameChange = e => {
    let input = e.nativeEvent.text; // รับค่าจาก TextInput

    // เอาเฉพาะตัวเลขและจัดรูปแบบ
    input = input.replace(/\D/g, ''); // เอาเฉพาะตัวเลข
    if (input.length > 13) input = input.slice(0, 13); // จำกัดความยาวไม่เกิน 13 หลัก

    // ฟอร์แมตรูปแบบเลขประจำตัวประชาชน
    const formatted = input.replace(
      /^(\d{1})(\d{0,4})(\d{0,5})(\d{0,2})(\d{0,1})$/,
      (match, g1, g2, g3, g4, g5) => {
        let result = g1; // กลุ่มที่ 1
        if (g2) result += `-${g2}`; // กลุ่มที่ 2
        if (g3) result += `-${g3}`; // กลุ่มที่ 3
        if (g4) result += `-${g4}`; // กลุ่มที่ 4
        if (g5) result += `-${g5}`; // กลุ่มที่ 5
        return result;
      },
    );

    setUsername(formatted); // อัปเดตฟิลด์ข้อมูล
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setError(null);
    });

    return unsubscribe;
  }, [navigation]);

  async function handleSubmit() {
    setIsLoading(true);
    const cleanedUsername = username.replace(/-/g, '');
    console.log(username, password);
    const userData = {
      username: cleanedUsername,
      password,
    };

    try {
      const res = await axios.post('http://10.0.2.2:5000/loginuser', userData);
      // console.log(res.data);
      if (res.data.status === 'ok') {
        await AsyncStorage.setItem('token', res.data.data);
        await AsyncStorage.setItem('isLoggedIn', JSON.stringify(true));
        await AsyncStorage.setItem(
          'addDataFirst',
          JSON.stringify(res.data.addDataFirst),
        );

        await getData();

        if (res.data.addDataFirst) {
          navigation.navigate('TabNav');
        } else {
          // navigation.navigate('Informationone');
          navigation.navigate('ConsentScreen');

        }
      }
    } catch (error) {
      setError(error.response?.data?.error);
    } finally {
      setIsLoading(false); // หยุดสถานะโหลด
    }
  }

  const forgot = () => {
    navigation.navigate('ForgotPassword');
  };

  // async function getData() {
  //   const data = await AsyncStorage.getItem('isLoggedIn');

  //   console.log(data, 'at app.jsx');

  // }
  // useEffect(()=>{
  //   getData();
  //   console.log("Hii");
  // },[])

  return (
    <ScrollView
      contentContainerStyle={{flexGrow: 1}}
      keyboardShouldPersistTaps={'always'}>
      <View style={styles.pagelogin}>
        <View style={styles.logoContainer}>
          <Image
            style={styles.logo}
            source={require('../../assets/Logo.png')}
          />
        </View>

        <View style={styles.loginContainer}>
          <Text style={styles.text_header}>ลงชื่อเข้าใช้งาน</Text>
          <View style={styles.action}>
            <Icon name="user" color="#87CEFA" style={styles.smallIcon} />

            <TextInput
              placeholder="เลขประจำตัวประชาชน"
              style={[styles.textInput, {fontFamily: 'Kanit-Regular'}]}
              keyboardType="numeric" // ใช้คีย์บอร์ดตัวเลข
              maxLength={17} // ความยาวสูงสุดรวม "-"
              onChange={e => handleInputUsernameChange(e)} // เรียกฟังก์ชัน handleInputUsernameChange
              value={username}></TextInput>
          </View>
          <View style={styles.action}>
            <Icon name="lock" color="#87CEFA" style={styles.smallIcon} />
            <TextInput
              placeholder="รหัสผ่าน"
              style={[styles.textInput, {fontFamily: 'Kanit-Regular'}]}
              value={password}
              onChange={e => setPassword(e.nativeEvent.text)}
              secureTextEntry={!passwordVisible}></TextInput>
            <TouchableOpacity
              onPress={() => setPasswordVisible(!passwordVisible)}>
              <Ionicons
                name={passwordVisible ? 'eye' : 'eye-off'}
                color="#87CEFA"
                style={{fontSize: 20, marginTop: 3}}
              />
            </TouchableOpacity>
          </View>

          <View style={{flex: 1}}>
            {error && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 8,
                  marginBottom: 5,
                  marginLeft: 18,
                }}>
                <Icon1
                  name="exclamationcircleo"
                  color="red"
                  style={{marginRight: 5, fontSize: 18}}
                />
                <Text style={{color: 'red', marginVertical: 'auto',fontFamily: 'Kanit-Regular',fontSize: 14}}>
                  {error}
                </Text>
              </View>
            )}

            <View
              style={{
                justifyContent: 'flex-end',
                alignItems: 'flex-end',
                marginTop: 8,
                marginRight: 15,
              }}>
              <Text style={{fontFamily: 'Kanit-Regular'}} onPress={forgot}>
                ลืมรหัสผ่าน?
              </Text>
            </View>

            <View style={styles.button}>
              <TouchableOpacity
                style={styles.inBut}
                onPress={() => handleSubmit()}
                disabled={isLoading}>
                {isLoading ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text style={styles.textSign}>เข้าสู่ระบบ</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
export default LoginPage;
