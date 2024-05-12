import {
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import style from './style';
import styles from './Login/style';
// import Icon from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
function ProfileScreen(props) {
  const navigation = useNavigation();
  console.log(props);
  const [userData, setUserData] = useState('');

  async function getData() {
    const token = await AsyncStorage.getItem('token');
    console.log(token);
    axios
      .post('http://192.168.2.43:5000/userdata', {token: token})
      .then(res => {
        console.log(res.data);
        setUserData(res.data.data);
        console.log(userData);
      });
  }

  useEffect(() => {
    getData();
  }, []);

  async function logout() {
    try {
      await AsyncStorage.removeItem('token');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error while logging out:', error);
    }
  }
  return (
    <ScrollView
      keyboardShouldPersistTaps={'always'}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{paddingBottom: 40}}>
      <View style={style.container}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon name="user" color="black" style={styles.smallIcon} />
          <Text
            style={styles.textprofile}
            onPress={() => {
              navigation.navigate('User', {data: userData});
            }}>
            ข้อมูลส่วนตัว
          </Text>
        </View>

        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Ionicons
            name="headset-outline"
            color="black"
            style={styles.smallIcon}
          />
          <Text style={styles.textprofile}>ติดต่อเรา</Text>
        </View>
        
      </View>
      <TouchableOpacity style={styless.containerlogout} onPress={logout}>
          {/* <Ionicons
            name="log-out-outline"
            color="black"
            style={styles.smallIcon}
          /> */}
          <Text style={styless.textex} onPress={logout}>
            ออกจากระบบ
          </Text>
        </TouchableOpacity>

    </ScrollView>
  );
}
const styless = StyleSheet.create({
//   text: {
//     color: 'black',
//     fontSize: 18,
//     fontWeight: '500',
//     fontStyle: 'normal',
//     fontFamily: 'Open Sans',
//     marginBottom: 10,
//   },
  textex: {
    textAlign:'center',
    fontFamily: 'Arial',
    fontSize: 16,
    fontWeight: 'normal',
    // color:'red',
  },
  containerlogout: {
    backgroundColor: '#DCDCDC',
    padding: 10,
    borderRadius: 10,
    margin: 15,
    marginVertical:1,
    elevation: 2,
  },
});
export default ProfileScreen;
