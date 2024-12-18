import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  
} from 'react-native';
import styles from './style';
import {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Feather';
import Icon1 from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';

function LoginPage({ getData}) {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [passwordVisible, setPasswordVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setError(null);
    });

    return unsubscribe;
  }, [navigation]);

  async function handleSubmit() {
    console.log(username, password);
    const userData = {
      username: username,
      password,
    };
  
    try {
      const res = await axios.post('http://192.168.0.149:5000/loginuser', userData);
      // console.log(res.data);
      if (res.data.status === 'ok') {
        await AsyncStorage.setItem('token', res.data.data);
        await AsyncStorage.setItem('isLoggedIn', JSON.stringify(true));
        await AsyncStorage.setItem('addDataFirst', JSON.stringify(res.data.addDataFirst));
        
        await getData();

        if (res.data.addDataFirst) {
          navigation.navigate('TabNav');
        } else {
          navigation.navigate('Information');
        }
      }
    } catch (error) {
      setError(error.response?.data?.error);
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
          <Text style={styles.text_header}>เข้าสู่ระบบ</Text>
          <View style={styles.action}>
            <Icon name="user" color="#87CEFA" style={styles.smallIcon} />
            <TextInput
              placeholder="เลขประจำตัวบัตรประชาชน"
              style={styles.textInput}
              onChange={e => setUsername(e.nativeEvent.text)}></TextInput>
          </View>
          <View style={styles.action}>
              <Icon name="lock" color="#87CEFA" style={styles.smallIcon} />
              <TextInput
                placeholder="รหัสผ่าน"
                style={styles.textInput}
                value={password}
                onChange={e => setPassword(e.nativeEvent.text)}
                secureTextEntry={!passwordVisible}></TextInput>
              <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
                <Ionicons
                  name={passwordVisible ? 'eye' : 'eye-off'}
                  color="#87CEFA"
                  style={{ fontSize: 20,marginTop: 3}}
                />
              </TouchableOpacity>
            </View>

          <View style={{ flex: 1 }}>
  {error && (
    <View style={{ flexDirection: 'row', alignItems: 'center',marginTop:8, marginBottom: 5,marginLeft:18}}>
      <Icon1
        name="exclamationcircleo"
        color="red"
        style={{ marginRight: 5, fontSize: 18 }}
      />
      <Text style={{ color: 'red', marginVertical:'auto' }}>
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
    <Text style={{ fontWeight: '500' }} onPress={forgot}>
      ลืมรหัสผ่าน?
    </Text>
  </View>

  <View style={styles.button}>
    <TouchableOpacity
      style={styles.inBut}
      onPress={() => handleSubmit()}>
      <View>
        <Text style={styles.textSign}>เข้าสู่ระบบ</Text>
      </View>
    </TouchableOpacity>
  </View>
</View>

        </View>
      </View>
    </ScrollView>
  );
}
export default LoginPage;
