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
  import {useEffect, useState} from 'react';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  import axios from 'axios';
  import style from './style';
  import styles from './Login/style';
  import {useRoute} from '@react-navigation/native';
  import Toast from 'react-native-toast-message';
  import Icon from 'react-native-vector-icons/Feather';
  import Ionicons from 'react-native-vector-icons/Ionicons';


export default function UpdatePassword(props) {
    const navigation = useNavigation();
    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [username, setUsername] = useState('');
    const route = useRoute();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

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
      axios.post('http://192.168.2.38:5000/updatepassuser', formData).then(res => {
        setLoading(false);
        if (res.data.status === 'Ok') {
          Toast.show({
            type: 'success',
            text1: 'Updated',
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
      <ScrollView
      keyboardShouldPersistTaps={'always'}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{paddingBottom: 40}}
      style={{ backgroundColor: '#F7F7F7'}}>
      <View style={style.container}>

        <View>
          <View>
            <Text style={style.text}>รหัสผ่านเก่า</Text>
            <View style={style.textInputContainer}>
            <TextInput style={style.text}
              onChangeText={text => setPassword(text)}
              secureTextEntry
            />
            </View>

          </View>

          <View>
            <Text style={style.text}>รหัสผ่านใหม่</Text>
            <View style={style.textInputContainer}>
            <TextInput
            style={style.text}
              onChangeText={text => setNewPassword(text)}
              secureTextEntry
            />
            </View>

          </View>
          
          <View>
            <Text style={style.text}>ยืนยันรหัสผ่านใหม่</Text>
            <View style={style.textInputContainer}>
            <TextInput
            style={style.text}
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
  );
}const stylespass = StyleSheet.create({
  errorText: {
    color: 'red',
    marginTop: 5,
    marginLeft: 5,
  },
});