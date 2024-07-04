import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Linking
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';
import { PDFView } from 'react-native-pdf';
import styles from './Login/style';
import moment from 'moment';
export default function Caremanualitem({route, navigation, props}) {
  console.log(props);
  const [caremanual_name, setCaremanualName] = useState('');
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);
  const [detail, setDetail] = useState('');
  const {id} = route.params;
  const [modalVisible, setModalVisible] = useState(false); // State สำหรับควบคุมการแสดง Modal
  const [updatedAt, setUpdatedAt] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get(
          `http://192.168.2.43:5000/getcaremanual/${id}`,
          {headers: {Authorization: `Bearer ${token}`}},
        );
        const data = response.data;
        setCaremanualName(data.caremanual_name);
        setImage(data.image);
        setDetail(data.detail);
        setFile(data.file);
        setUpdatedAt(formatDate(data.updatedAt));
      } catch (error) {
        console.error('Error fetching care manual item data:', error);
      }
    };

    fetchData();
  }, []);

  const goBack = () => {
    navigation.goBack();
  };
  const formatDate = dateTimeString => {
    const dateTime = new Date(dateTimeString);
    const day = dateTime.getDate();
    const month = dateTime.getMonth() + 1;
    const year = dateTime.getFullYear();
    const hours = dateTime.getHours();
    const minutes = dateTime.getMinutes();

    // ปรับเปลี่ยนเดือนเป็นภาษาไทย
    const thaiMonths = [
      'มกราคม',
      'กุมภาพันธ์',
      'มีนาคม',
      'เมษายน',
      'พฤษภาคม',
      'มิถุนายน',
      'กรกฎาคม',
      'สิงหาคม',
      'กันยายน',
      'ตุลาคม',
      'พฤศจิกายน',
      'ธันวาคม',
    ];

    // จัดรูปแบบให้อยู่ในรูปแบบ 'dd เดือน(ภาษาไทย) yyyy เวลา HH:MM น.'
    return `${day < 10 ? '0' + day : day} ${thaiMonths[month - 1]} ${
      year + 543
    }`;
  };

  return (
    <ScrollView
      keyboardShouldPersistTaps={'always'}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{paddingBottom: 40}}>
      <View style={stylei.pagelogin}>
        <TouchableOpacity style={stylei.iconback} onPress={goBack}>
          <Ionicons name={'arrow-back-outline'} size={22} color={'#fff'} />
        </TouchableOpacity>
        <Text style={stylei.heardCare}>{caremanual_name}</Text>
        <Text style={stylei.textCare}>อัปเดตล่าสุดเมื่อ: {updatedAt}</Text>
        <View style={stylei.loginContainer}>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Image
              source={{uri: image}}
              style={{
                width: 300,
                height: 400,
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            />
          </TouchableOpacity>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(false);
            }}>
            <View style={stylei.modalContainer}>
              <TouchableOpacity
                style={stylei.closeButton}
                onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={32} color="#fff" />
              </TouchableOpacity>
              <Image source={{uri: image}} style={stylei.modalImage} />
            </View>
          </Modal>

          <TouchableOpacity
  style={stylei.containerCarefile}
  onPress={() => {
    if (file) {
      Linking.openURL(file);
    } else {
      console.error('File URL is not available.');
    }
  }}>
  <Material name={'file-pdf-box'} color={'red'} size={24} />
  <Text style={stylei.fileText}>เปิดไฟล์ PDF</Text>
</TouchableOpacity>

{/* 
<PDFView
  fadeInDuration={250.0}
  style={{ flex: 1 }}
  resource={file} 
  resourceType={'url'}
/> */}

{/* <PDFView
  fadeInDuration={250.0}
  style={{ flex: 1 }}
  resource={file} 
  resourceType={'url'}
/> */}
          <View>
            <Text style={stylei.text}>รายละเอียด : {detail}</Text>
          </View>
        </View>
      </View>
      {/* <View style={stylei.containerCare}> */}

      {/* </View> */}
    </ScrollView>
  );
}

const stylei = StyleSheet.create({
  heardCare: {
    color: 'black',
    fontFamily: 'Arial',
    fontSize: 30,
    fontWeight: '700',
    padding: 5,
    textAlign: 'center',
    color: '#fff',
  },
  textCare: {
    color: 'black',
    fontFamily: 'Arial',
    fontSize: 16,
    fontWeight: 'normal',
    paddingTop: 1,
    padding: 10,
    textAlign: 'center',
    color: '#fff',
  },
  containerCare: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    margin: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4.65,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 400,
    borderRadius: 10,
    marginTop: 10,
  },
  containerCarefile: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    // borderWidth: 1,
    // borderColor: '#ccc',
    // borderRadius: 5,
    padding: 5,
  },
  fileText: {
    marginLeft: 10,
    fontSize: 16,
    // color: 'black',
    fontFamily: 'Arial',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalImage: {
    width: '90%',
    height: '90%',
    resizeMode: 'contain',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  text: {
    color: 'black',
    fontFamily: 'Arial',
    fontSize: 16,
    fontWeight: 'normal',
    padding: 10,
  },
  iconback: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  loginContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    paddingHorizontal: 20,
    paddingVertical: 30,
    height: '100%',
    flexDirection: 'column',
  },
  pagelogin: {
    // backgroundColor: '#19A7CE',
    // backgroundColor: '#4691D3',
    backgroundColor: '#87CEFA',
  },
});
