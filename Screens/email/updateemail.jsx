import {
    StyleSheet,
    Text,
    TextInput,
    View,
    Button,
    TouchableOpacity,
    ScrollView,
  } from 'react-native';
  import {useNavigation} from '@react-navigation/native';
  import React, {useState, useEffect} from 'react';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  import axios from 'axios';
  // import style from '../style';
  // import styles from '../Login/style';
  import Icon from 'react-native-vector-icons/Fontisto';
  import Ionicons from 'react-native-vector-icons/Ionicons';
  import {useRoute} from '@react-navigation/native';
  import { useFocusEffect } from '@react-navigation/native';

  export default function UpdateEmail() {
    // const location = useLocation();
    // const data = location.state?.data;
    const navigation = useNavigation();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const route = useRoute();

    useFocusEffect(
      React.useCallback(() => {
        // ซ่อน TabBar เมื่อเข้าหน้านี้
        navigation.getParent()?.setOptions({
          tabBarStyle: { display: 'none' },
        });
        // return () => {
        //   // แสดง TabBar กลับมาเมื่อออกจากหน้านี้
        //   navigation.getParent()?.setOptions({
        //     tabBarStyle: { display: 'flex' }, // ปรับ 'flex' ให้ TabBar กลับมาแสดง
        //   });
        // };
      }, [navigation])
    );
    
    useEffect(() => {
      const unsubscribe = navigation.addListener('beforeRemove', (e) => {
        if (e.data.action.type === 'POP') {
          navigation.getParent()?.setOptions({
            tabBarStyle: {
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              elevation: 10,
              backgroundColor: '#fff',
              borderTopColor: 'transparent',
              shadowColor: '#000', 
              shadowOffset: { width: 0, height: -5 }, 
              shadowOpacity: 0.15, 
              shadowRadius: 10,
              height: 65,
            },         
           });
        } else {
          // ซ่อน TabBar ถ้ากลับด้วยวิธีอื่นๆ เช่น navigation.goBack()
          navigation.getParent()?.setOptions({
            tabBarStyle: { display: 'none' },
          });
        }
      });
  
      return unsubscribe;
    }, [navigation]);
    
    //   async function getData() {
    //     const token = await AsyncStorage.getItem('token');
    //     console.log(token);
    //     axios
    //       .post('http://10.0.2.2:5000/userdata', {token: token})
    //       .then(res => {
    //         console.log(res.data);
    //         setUserData(res.data.data);
    //         console.log(userData);
    //       });
    //   }
  
    //   useEffect(() => {
    //     getData();
    //   }, []);
  
    useEffect(() => {
      const userData = route.params.data;
      setUsername(userData.username);
      // setEmail(userData.email);
      console.log('เมล:', email);
      console.log('usermname:', username);
    }, []);
  
    const handleSubmit = () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setErrorMessage('กรุณาใส่อีเมลที่ถูกต้อง');
        return;
      }
  
      const formData = {
        username,
        email,
      };
  
      // setLoading(true);
      axios
        .post('http://10.0.2.2:5000/send-otp3', formData)
        .then(res => {
          //   setLoading(false);
          if (res.data.success) {
            navigation.navigate('UpdateOTP', {email, username});
          } else {
            setErrorMessage(res.data.error || 'เกิดข้อผิดพลาดในการส่ง OTP');
          }
        })
        .catch(error => {
          //   setLoading(false);
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
          {/* <Text style={style.text}>อีเมล</Text> */}
          <View style={styles.textInputContainer}>
            <Icon name="email" size={24} color="#5AB9EA" style={styles.icon} />
            <TextInput
              style={styles.textInput}
              onChangeText={text => setEmail(text)}
              placeholder="กรอกอีเมลใหม่"
            />
          </View>
          {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : null}
  
  <TouchableOpacity 
  onPress={() => handleSubmit()} 
  style={[styles.button, email.trim() === '' && styles.buttonDisabled]} 
  disabled={email.trim() === ''}
>
  <View>
    <Text style={styles.buttonText}>ส่ง OTP</Text>
  </View>
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
    textInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#DCDCDC',
      borderRadius: 10,
      paddingHorizontal: 12,
      marginBottom: 2,
      height:45,
    },
    innerContainer: {
      marginTop: 20,
    },
    icon: {
      marginRight: 1,
    },
    textInput: {
      flex: 1,
      height: 45,
      fontSize: 16,
      color: '#333',
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
    buttonText: {
      color: '#FFF',
      fontSize: 16,
      fontFamily: 'Kanit-Regular',
    },
    buttonDisabled: {
      backgroundColor: '#D3D3D3', // สีอ่อนลงเมื่อปิดใช้งาน
    },
    errorText:{
      color: 'red', 
      fontSize: 14,
      fontFamily: 'Kanit-Regular',
      paddingVertical:3,
      paddingLeft:4,
    }
  });
  