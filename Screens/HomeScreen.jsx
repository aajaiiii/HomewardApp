import {StyleSheet,Image, Text, View, Button, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import CaremanualScreen from './CaremanualScreen';
import styless from './style';
function HomeScreen(props) {
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

  const Caremanual = () => {
    navigation.navigate('Caremanual', {userData: 'userData'});
  };

  return (
    <View>
        <View >
        <Image style={styles.image} source={require('../assets/imagehome.png')}
       />
        </View>
        <View style={styles.containerWrapper}>

      <TouchableOpacity style={styless.container} onPress={Caremanual}>
      <Image style={styles.buttonImage} source={require('../assets/training.png')} />
        <Text style={styles.text} title="Caremanual" onPress={Caremanual}>
          คู่มือดูแลผู้ป่วย
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styless.container} >
      <Image style={styles.buttonImage} source={require('../assets/personal-information.png')} />

        <Text style={styles.text} title="Caremanual">
          บันทึกอาการผู้ป่วย
        </Text>
      </TouchableOpacity>
      
      </View>
      <TouchableOpacity style={styles.container1}>
      <Image style={styles.buttonImage} source={require('../assets/calendar.png')} />
        <Text style={styles.text} title="Caremanual">
        ผลการประเมินอาการ
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginHorizontal: 'auto',
    marginVertical:25,
    width: 170,
    height: 100,
    elevation: 2,
    alignItems: 'center',
  },
  container1: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginLeft:14,
    width: 170,
    height: 100,
    elevation: 2,
    alignItems: 'center',
  },
  text: {
    color: 'black',
    fontSize: 15,
    fontWeight: '500',
    margin: 'auto',
    marginTop:5,
    textAlign:'center',
  },
  image:{
    height: 200,
    width: 360,
    marginTop: 10,
    marginLeft: 'auto',
    marginRight: 'auto',

  },
  containerWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonImage: {
    height: 40,
    width: 40,
    margin:'auto',
  },
});

export default HomeScreen;
