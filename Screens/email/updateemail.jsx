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
  import {useEffect, useState} from 'react';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  import axios from 'axios';
  // import style from '../style';
  // import styles from '../Login/style';
  import Icon from 'react-native-vector-icons/Fontisto';
  import Ionicons from 'react-native-vector-icons/Ionicons';
  import {useRoute} from '@react-navigation/native';
  export default function UpdateEmail() {
    // const location = useLocation();
    // const data = location.state?.data;
    const navigation = useNavigation();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const route = useRoute();
    //   async function getData() {
    //     const token = await AsyncStorage.getItem('token');
    //     console.log(token);
    //     axios
    //       .post('http://192.168.2.57:5000/userdata', {token: token})
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
      setEmail(userData.email);
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
        .post('http://192.168.2.57:5000/send-otp3', formData)
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
            <Icon name="email" size={24} color="gray" style={styles.icon} />
            <TextInput
              style={styles.textInput}
              onChangeText={text => setEmail(text)}
              placeholder="กรอกอีเมลใหม่"
            />
          </View>
          {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : null}
  
          <TouchableOpacity onPress={() => handleSubmit()} style={styles.button}>
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
      height: 40,
      fontSize: 16,
      color: '#333',
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
  });
  