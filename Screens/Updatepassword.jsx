import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Modal,
  } from 'react-native';
  import {useNavigation} from '@react-navigation/native';
  import React, {useState, useEffect} from 'react';
  import { useFocusEffect } from '@react-navigation/native';

  import AsyncStorage from '@react-native-async-storage/async-storage';
  import axios from 'axios';
  import style from './style';
  import styles from './Login/style';
  import {useRoute} from '@react-navigation/native';
  import Toast from 'react-native-toast-message';
  import Icon from 'react-native-vector-icons/Feather';
  import Ionicons from 'react-native-vector-icons/Ionicons';
  import LinearGradient from 'react-native-linear-gradient';


export default function UpdatePassword(props) {
  console.log(props);
    const navigation = useNavigation();
    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [username, setUsername] = useState('');
    const route = useRoute();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useFocusEffect(
      React.useCallback(() => {
        // ซ่อน TabBar เมื่อเข้าหน้านี้
        navigation.getParent()?.setOptions({
          tabBarStyle: { display: 'none' },
        });
        return () => {
          // แสดง TabBar กลับมาเมื่อออกจากหน้านี้
          navigation.getParent()?.setOptions({
            tabBarStyle: {  position: 'absolute',
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
              height: 60,  }, // ปรับ 'flex' ให้ TabBar กลับมาแสดง
          });
        };
      }, [navigation])
    );

    useEffect(() => {
      const unsubscribe = navigation.addListener('focus', () => {
        setError(null);
      });
  
      return unsubscribe;
    }, [navigation]);

    useEffect(() => {
        const userData = route.params.data;
        setPassword(userData.password)
        setUsername(userData.username);
    }, []);


    const UpdatePassword = () => {

      // if (newPassword !== confirmNewPassword) {
      //   setConfirmNewPasswordError("รหัสผ่านใหม่ไม่ตรงกัน");
      //   valid = false;
      // }
 
      const formData = {
        username: username,
        password: password,
        newPassword: newPassword,
        confirmNewPassword: confirmNewPassword,
      };
  
      setLoading(true);
      axios.post('http://10.53.57.175:5000/updatepassuser', formData).then(res => {
        setLoading(false);
        if (res.data.status === 'Ok') {
          Toast.show({
            type: 'success',
            text1: 'แก้ไขสำเร็จ',
            text2: 'แก้ไขรหัสผ่านแล้ว',
          });
          navigation.navigate('Profile', { refresh: true });
        } else {
          setError(res.data.error);
          // Toast.show({
          //   type: 'error',
          //   text1: 'Error',
          //   text2: res.data.error,
          // });
        }
      }).catch(err => {
        setLoading(false);
        if (err.response && err.response.data && err.response.data.error) {
          setError(err.response.data.error);
        } else {
          setError("เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน โปรดลองใหม่อีกครั้ง");
        }
      });
    };
  

      return (
        <LinearGradient
        // colors={['#00A9E0', '#5AB9EA', '#E0FFFF', '#FFFFFF']}
        colors={['#fff', '#fff']}

        style={{flex: 1}} // ให้ครอบคลุมทั้งหน้าจอ
      >
      <ScrollView
      keyboardShouldPersistTaps={'always'}
      showsVerticalScrollIndicator={false}
      // contentContainerStyle={stylespass.container}
      style={stylespass.background}>
      <View style={style.container}>
        <View>
          <View>
            <Text style={style.text}>รหัสผ่านเก่า</Text>
            <View style={stylespass.textInputContainer}>
            <TextInput   style={stylespass.textInput}

              onChangeText={text => setPassword(text)}
              secureTextEntry
            />
            </View>

          </View>

          <View>
            <Text style={style.text}>รหัสผ่านใหม่</Text>
            <View style={stylespass.textInputContainer}>
            <TextInput
            style={stylespass.textInput}
            onChangeText={text => setNewPassword(text)}
              secureTextEntry
            />
            </View>

          </View>
          
          <View>
            <Text style={style.text}>ยืนยันรหัสผ่านใหม่</Text>
            <View style={stylespass.textInputContainer}>
            <TextInput
            style={stylespass.textInput}
              onChangeText={text => setConfirmNewPassword(text)}
              secureTextEntry
            />
            </View>

          </View>
          {error ? <Text style={stylespass.errorText}>{error}</Text> : null}

          <TouchableOpacity
            onPress={() => UpdatePassword()}
            style={style.inBut}>
            <View>
              <Text style={style.textinBut}>บันทึก</Text>
            </View>
          </TouchableOpacity>

        </View>
      </View>
    </ScrollView>
    </LinearGradient>
  );
}const stylespass = StyleSheet.create({
  container: {
    paddingBottom: 40,
    paddingHorizontal: 20,
    backgroundColor: '#F7F7F7',
  },
  background: {
    backgroundColor: 'transparent',
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
  textInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    color: 'red',
    marginTop: 5,
    marginLeft: 5,
  },
});