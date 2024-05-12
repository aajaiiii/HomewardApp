import { View,Text ,Image,TextInput,TouchableOpacity,ScrollView, Alert} from "react-native";
import styles from "./style";
import {useEffect, useState} from 'react';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Feather'

function LoginPage(props){
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit() {
    console.log(username, password);
    const userData = {
      username: username,
      password,
    };

    axios.post('http://192.168.2.43:5000/loginuser', userData)
    .then(res => {
      console.log(res.data);
      if (res.data.status == 'ok') {
        Alert.alert("Login success");
        AsyncStorage.setItem("token",res.data.data);
        AsyncStorage.setItem('isLoggedIn',JSON.stringify(true));
        navigation.navigate('Home')
      }
    })
    .catch(error => {
      console.error('Error:', error);
      Alert.alert("Login failed", "Please try again");
    });
  
  }

  return(
    <ScrollView
    contentContainerStyle={{flexGrow: 1}}
    keyboardShouldPersistTaps={'always'}>
    <View style={styles.pagelogin}>
        <View style={styles.logoContainer}>
          <Image style={styles.logo} source={require('../../assets/Logo.png')}/>
        </View>
        <View style={styles.loginContainer}>
          <Text style={styles.text_header}>เข้าสู่ระบบ</Text>    
          <View style={styles.action}>
          <Icon name="user" color="#87CEFA" style={styles.smallIcon}/>
          <TextInput placeholder="เลขประจำตัวบัตรประชาชน"
          style={styles.textInput}
          onChange={e =>setUsername(e.nativeEvent.text)}></TextInput>
          </View>    
          <View style={styles.action}>
          <Icon name="lock" color="#87CEFA" style={styles.smallIcon}/>
          <TextInput placeholder="รหัสผ่าน" 
          style={styles.textInput}
          
          onChange={e =>setPassword(e.nativeEvent.text)}
          secureTextEntry
          ></TextInput>
          </View>   
          <View
            style={{
              justifyContent: 'flex-end',
              alignItems: 'flex-end',
              marginTop: 8,
              marginRight: 10,
            }}>
            <Text style={{fontWeight: '500'}}>
              Forgot Password
            </Text>
          </View>
          <View style={styles.button}>
          <TouchableOpacity style={styles.inBut} onPress={() => handleSubmit()}>
            <View>
              <Text style={styles.textSign}>Log in</Text>
            </View>
          </TouchableOpacity>
          </View>
        </View>
 
    </View>
    </ScrollView>
  )
}
export default LoginPage;