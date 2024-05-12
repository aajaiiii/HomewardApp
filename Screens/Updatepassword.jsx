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

    useEffect(() => {
        const userData = route.params.data;
        setPassword(userData.password)
        setUsername(userData.username);
    }, []);


    const UpdatePassword = () => {
        const formdata = {
         username: username,
         password:password,
         newPassword,
         confirmNewPassword,
        };
    
        axios.post('http://192.168.2.43:5000/updatepassuser', formdata).then(res => {
          console.log(res.data);
          if (res.data.status == 'Ok') {
            Toast.show({
              type: 'success',
              text1: 'Updated',
            });
            navigation.navigate('Profile', { refresh: true });
          }else{
            setError(data.error);
          }
          
        });
      };
      return (
      <ScrollView
      keyboardShouldPersistTaps={'always'}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{paddingBottom: 40}}>
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
}