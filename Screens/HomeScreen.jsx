import {StyleSheet,Image, Text, View, Button, TouchableOpacity,ScrollView, Linking ,BackHandler,Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import styless from './style';
import Swiper from 'react-native-swiper';
import {useFocusEffect} from '@react-navigation/native';
import React from 'react';

const googleUrl = "https://bangkokpattayahospital.com/th/health-articles-th/neuroscience-th/nine-risk-factors-in-cerebrovascular-accidents-th/";

function HomeScreen(props) {
  const navigation = useNavigation();
  console.log(props);
  const [userData, setUserData] = useState('');
  async function getData() {
    const token = await AsyncStorage.getItem('token');
    console.log(token);
    axios
      .post('http://192.168.2.38:5000/userdata', {token: token})
      .then(res => {
        console.log(res.data);
        setUserData(res.data.data);
        console.log(userData);
      });
  }
  const handleBackPress = () => {
    Alert.alert('ออกจากแอป', 'คถณต้องการออกจากแอปเราใช่ไหม?', [
      {
        text: 'ไม่',
        onPress: () => null,
        style: 'ไม่',
      },
      {
        text: 'ใช่',
        onPress: () => BackHandler.exitApp(),
      },
    ]);
    return true;
  };


 useFocusEffect(
    React.useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', handleBackPress);  
    
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
      };
 } ))

  useEffect(() => {
    getData();

   
  }, []);

  const Caremanual = () => {
    navigation.navigate('Caremanual', {userData: 'userData'});
  };
  const PatientForm = () => {
    navigation.navigate('PatientForm', {userData: 'userData'});
  };

  const Assessment = () => {
    navigation.navigate('Assessment', {userData: 'userData'});
  };

  async function logout() {
    AsyncStorage.setItem('isLoggedIn','');
    AsyncStorage.setItem('token','');
    navigation.navigate("LoginUser");
  }

  return (
    <ScrollView
    keyboardShouldPersistTaps={'always'}
    showsVerticalScrollIndicator={false}
    contentContainerStyle={{paddingBottom: 40}}
    style={{ backgroundColor: '#F7F7F7'}}>
        {/* <View >
        <Image style={styles.image} source={require('../assets/imagehome.png')}
       />
        </View> */}
        <Swiper style={styles.swiper}>
  <TouchableOpacity onPress={() => Linking.openURL(googleUrl)}>
    <Image
      style={styles.image}
      source={require('../assets/imagehome.png')}
    />
  </TouchableOpacity>
  <TouchableOpacity onPress={() => Linking.openURL(googleUrl)}>
    <Image
      style={styles.image}
      source={require('../assets/imagehome.png')}
    />
  </TouchableOpacity>
  <TouchableOpacity onPress={() => Linking.openURL(googleUrl)}>
    <Image
      style={styles.image}
      source={require('../assets/imagehome.png')}
    />
  </TouchableOpacity>
  </Swiper>
        <View style={styles.containerWrapper}>
      <TouchableOpacity style={styles.container} onPress={Caremanual}>
      <Image style={styles.buttonImage} source={require('../assets/training.png')} />
        <Text style={styles.text} title="Caremanual" onPress={Caremanual}>
          คู่มือดูแลผู้ป่วย
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.container} onPress={PatientForm}>
      <Image style={styles.buttonImage} source={require('../assets/personal-information.png')} />

        <Text style={styles.text} title="PatientForm">
          บันทึกอาการผู้ป่วย
        </Text>
      </TouchableOpacity>
      
      </View>
      <TouchableOpacity style={styles.container1} onPress={Assessment}>
      <Image style={styles.buttonImage} source={require('../assets/calendar.png')} />
        <Text style={styles.text} title="Caremanual">
        ผลการประเมินอาการ
        </Text>
      </TouchableOpacity>
      
    </ScrollView>
    

  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginHorizontal: 'auto',
    marginVertical:25,
    width: 165,
    height: 110,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
    width: 0,
    height: 4,
      },
      shadowOpacity: 0.5,
      shadowRadius: 4.65,
      elevation: 3,

  },
  container1: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginLeft:14,
    width: 165,
    height: 110,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
    width: 0,
    height: 4,
      },
      shadowOpacity: 0.5,
      shadowRadius: 4.65,
      elevation: 3,

  },
  text: {
    margin: 'auto',
    marginTop:5,
    textAlign:'center',
    color: 'black',
    fontFamily: 'Arial',
    fontSize: 16,
    fontWeight: 'normal',
  },
  swiper: {
    height: 220,
    marginTop: 10,
  },
  image:{
    height: 210,
    width: 360,
    marginTop: 10,
    marginLeft: 'auto',
    marginRight: 'auto',
    borderRadius: 10,
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
