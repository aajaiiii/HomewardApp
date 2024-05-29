import { View, Text, Image, TextInput, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import styles from "./style";
import { useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Fontisto from 'react-native-vector-icons/Fontisto';

export default function ForgotPassword({ navigation }) {
  const [error, setError] = useState(null);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const requestOtp = async () => {
    try {
      const response = await axios.post('http://192.168.2.38:5000/forgot-passworduser', { email });
      setMessage(response.data);
      navigation.navigate('VerifyOtp', { email });
    } catch (error) {
      setMessage(error.response.data);
    }
  };

  const goBack = () => {
    navigation.goBack();
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps={'always'}
    >
      <View style={styles.pageforgot}>
        <TouchableOpacity style={stylei.iconback} onPress={goBack}>
          <Ionicons name={'arrow-back-outline'} size={22} color={'#000'} />
        </TouchableOpacity>
        <View style={styles.logoContainer}>
          <Image style={styles.logo} source={require('../../assets/Logoblue.png')} />
        </View>
        <View style={stylei.container}>
          <Text style={stylei.text_header}>ลืมรหัสผ่าน</Text>
          <Text style={stylei.text}>กรุณากรอกอีเมลเพื่อเปลี่ยนรหัสผ่าน</Text>
          <View style={styles.action}>
            <Fontisto name="email" color="#87CEFA" style={styles.smallIcon} />
            <TextInput
              placeholder="อีเมล"
              value={email}
              style={styles.textInput}
              onChange={e => setEmail(e.nativeEvent.text)}
            />
          </View>
          <View style={styles.button}>
            <TouchableOpacity style={stylei.inBut} onPress={requestOtp}>
              <View>
                <Text style={styles.textSign}>ส่ง OTP</Text>
              </View>
            </TouchableOpacity>
            {message ? <Text style={{ marginTop: 20 }}>{message}</Text> : null}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const stylei = StyleSheet.create({
   pageforgot: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  iconback: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  container: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4.65,
    elevation: 3,
    justifyContent: 'center',
    // marginTop:50,
  },
  inBut: {
    width: '70%',
    backgroundColor: '#87CEFA',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 50,
    marginLeft: 'auto',
    marginRight: 'auto',
    color: '#fff',
    marginTop: 5,
  },
  text_header: {
    fontSize: 20,
    textAlign: 'center',
    fontWeight: '700',
    marginBottom: 10,
  },
  text: {
    textAlign: 'center',
    fontSize: 16,
  },
});
