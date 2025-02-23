import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  // Modal,
  Linking,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';
import {PDFView} from 'react-native-pdf';
import styles from './Login/style';
import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient';
import {useFocusEffect} from '@react-navigation/native';
import ImageViewer from 'react-native-image-zoom-viewer';
import Modal from 'react-native-modal'; // ใช้ react-native-modal

export default function Caremanualitem({route, navigation, props}) {
  console.log(props);
  const [caremanual_name, setCaremanualName] = useState('');
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);
  const [detail, setDetail] = useState('');
  const {id} = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [updatedAt, setUpdatedAt] = useState('');
  const [createAt, setCreatedAt] = useState('');

   useFocusEffect(
     React.useCallback(() => {
       // ซ่อน TabBar เมื่อเข้าหน้านี้
       navigation.getParent()?.setOptions({
         tabBarStyle: { display: 'none' },
       });
       // return () => {
       //   // แสดง TabBar กลับมาเมื่อออกจากหน้านี้
       //   navigation.getParent()?.setOptions({
       //     tabBarStyle: { display: 'flex' }, // ปรับ 'flex' ให้ TabBar กลับมาแสดง
       //   });
       // };
     }, [navigation])
   );
   
 
  //  useEffect(() => {
  //    // ฟัง event ของการกดปุ่ม Header Back (Navigate Up)
  //    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
  //      if (e.data.action.type === 'POP') {
  //        // แสดง TabBar เมื่อกดปุ่ม Navigate Up
  //        navigation.getParent()?.setOptions({
  //          tabBarStyle: {
  //            position: 'absolute',
  //            bottom: 0,
  //            left: 0,
  //            right: 0,
  //            elevation: 10, 
  //            backgroundColor: '#fff',
  //            borderTopColor: 'transparent',
  //            shadowColor: '#000',
  //            shadowOffset: { width: 0, height: -5 }, 
  //            shadowOpacity: 0.15,
  //            shadowRadius: 10, 
  //            height: 65,
  //          },       
  //        });
  //      } else {
  //        // ซ่อน TabBar ถ้ากลับด้วยวิธีอื่นๆ เช่น navigation.goBack()
  //        navigation.getParent()?.setOptions({
  //          tabBarStyle: { display: 'none' },
  //        });
  //      }
  //    });
 
  //    return unsubscribe;
  //  }, [navigation]);
 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get(
          `http://10.0.2.2:5000/getcaremanual/${id}`,
          {headers: {Authorization: `Bearer ${token}`}},
          // {
          //   headers: {
          //     Accept: 'application/json',
          //     'Content-Type': 'application/json',
          //   },
          // },
        );
        const data = response.data;
        setCaremanualName(data.caremanual_name);
        setImage(data.image);
        setDetail(data.detail);
        setFile(data.file);
        setUpdatedAt(formatDate(data.updatedAt));
        setCreatedAt(formatDate(data.createdAt));
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
      // 'ม.ค.',
      // 'ก.พ.',
      // 'มี.ค.',
      // 'เม.ษ.',
      // 'พ.ค.',
      // 'มิ.ย',
      // 'ก.ค.',
      // 'ส.ค.',
      // 'ก.ย.',
      // 'ต.ค.',
      // 'พ.ย.',
      // 'ธ.ค.',
    ];
    const formattedHours = hours < 10 ? '0' + hours : hours;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    // จัดรูปแบบให้อยู่ในรูปแบบ 'dd เดือน(ภาษาไทย) yyyy เวลา HH:MM น.'
    return `${day < 10 ? '0' + day : day} ${thaiMonths[month - 1]} ${
      year + 543
    }`;
  };

  return (
    <View
      style={{flex: 1}} 
    >


      <ScrollView
        keyboardShouldPersistTaps={'always'}
        showsVerticalScrollIndicator={false}
        style={{backgroundColor: 'transparent'}}>
        <View style={stylei.pagelogin}>
          <View style={stylei.dateContainer}>
            <Material
              name="calendar-month-outline"
              size={30}
              color="#5AB9EA"
              style={stylei.dateIcon}
            />
            <Text style={stylei.textDate}>{createAt}</Text>
          </View>

          <View style={stylei.loginContainer}>
          <View style={stylei.imageContainer}>

            <TouchableOpacity onPress={() => setModalVisible(true)}>
              {image ? (
                <Image
                  source={{uri: image}}
                  style={{
                    // width: 310,
                    // height: 450,
                    // marginLeft: 'auto',
                    // marginRight: 'auto',
                    width: '100%',
                    height: 990,
                    resizeMode: 'contain',
                    borderRadius: 10,
                    
                  }}
                />
              ) : (
                <Text style={{textAlign: 'center', color: '#fff'}}>
                  ไม่มีภาพ
                </Text>
              )}
            </TouchableOpacity>
</View>
            {/* <Modal
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
            </Modal> */}
            <Modal
              isVisible={modalVisible}
              style={{margin: 0, flex: 1}}
              onBackdropPress={() => setModalVisible(false)}
              onBackButtonPress={() => setModalVisible(false)}>
              <View style={{flex: 1, backgroundColor: 'black'}}>
                <TouchableOpacity
                  style={stylei.closeButton}
                  onPress={() => setModalVisible(false)}>
                  <Ionicons name="close" size={32} color="#fff" />
                </TouchableOpacity>
                <View style={{flex: 1, backgroundColor: 'black'}}>
                  <ImageViewer
                    imageUrls={[{url: image}]}
                    enableSwipeDown={true}
                    onSwipeDown={() => setModalVisible(false)}
                    renderIndicator={() => null}
                  />
                </View>
              </View>
            </Modal>

            {file && (
              <TouchableOpacity
                style={stylei.containerCarefile}
                onPress={() => Linking.openURL(file)}>
                <View style={stylei.fileButton}>
                  <Material name={'file-pdf-box'} color={'red'} size={30} />
                  <Text style={stylei.fileText}>เปิดไฟล์ PDF</Text>
                </View>
              </TouchableOpacity>
            )}

            {detail && (
              <View style={stylei.containerCaredetail}>
                <Text style={[stylei.textlabel, stylei.text]}>
                  รายละเอียด :
                </Text>
                <Text style={[stylei.textdetail, stylei.text]}>{detail}</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const stylei = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', 
    height: 58, 
    paddingHorizontal: 15, 
    backgroundColor: '#5AB9EA', 
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    elevation: 4,
  },
  headerTextContainer: {
    marginLeft: 5,
    flex: 1,
  },
  heardCare: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'Kanit-SemiBold',
  },
  textCare: {
    color: '#fff',
    fontSize: 16,
    paddingTop: 5,
    fontFamily: 'Kanit-Regular',
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
    height: 'auto',
    borderRadius: 10,
    marginTop: 10,
  },
  containerCarefile: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 1,
    marginLeft: 5,
    // borderWidth: 1,
    // borderColor: '#ccc',
    // borderRadius: 5,
    padding: 15,
  },
  containerCaredetail: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    // marginTop: 5,
    borderRadius: 10,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  fileText: {
    marginLeft: 10,
    fontSize: 16,
    // color: 'black',
    fontFamily: 'Kanit-Regular',
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
    top: 8,
    right: 6,
    zIndex: 10,
  },
  text: {
    fontFamily: 'Kanit-Regular',
    fontSize: 16,
    paddingHorizontal: 10,
  },
  iconback: {
    paddingHorizontal: 10,
    paddingTop: 5,
  },
  loginContainer: {
    backgroundColor: '#fff',
    marginTop: 0,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    // paddingHorizontal: 20,
    height: '100%',
    flexDirection: 'column',
  },
  pagelogin: {
    // backgroundColor: '#19A7CE',
    // backgroundColor: '#4691D3',
    // backgroundColor: '#87CEFA',
    backgroundColor: '#fff',
  },
  textlabel: {
    fontFamily: 'Kanit-Regular',
  },
  textdetail: {
    fontFamily: 'Kanit-Regular',
    color: 'black',
  },
  fileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF', // พื้นหลังสีขาว
    paddingVertical: 5,
    paddingHorizontal: 18,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FF6347',
    shadowColor: '#000', // เงาให้ดูมีมิติ
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4, // เงาสำหรับ Android
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginTop: 10,
    marginRight: 8,
  },
  dateIcon: {
    marginRight: 8,
  },
  textDate: {
    fontSize: 16,
    fontFamily: 'Kanit-Regular',
  },
  imageContainer: {
    alignSelf: 'center', 
    backgroundColor: '#FFF', 
    borderRadius: 15, 
    // padding: 8, 
    paddingHorizontal:5,
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5, 
    elevation: 6,
    marginVertical: 5,
    width:'95%'
  },
});
