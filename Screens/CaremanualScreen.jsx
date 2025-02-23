import { StyleSheet, Text, View, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import style from './style';
import LinearGradient from 'react-native-linear-gradient';
import {useFocusEffect} from '@react-navigation/native';

function CaremanualScreen(props) {
    const navigation = useNavigation();
    const [userData, setUserData] = useState("");
    const [careManualData, setCareManualData] = useState(null);
    const [loading, setLoading] = useState(true);
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
  

  useEffect(() => {
    // ฟัง event ของการกดปุ่ม Header Back (Navigate Up)
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if (e.data.action.type === 'POP') {
        // แสดง TabBar เมื่อกดปุ่ม Navigate Up
        navigation.getParent()?.setOptions({
          tabBarStyle: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            elevation: 10, 
            backgroundColor: '#fff',
            borderTopColor: 'transparent',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -5 }, 
            shadowOpacity: 0.15,
            shadowRadius: 10, 
            height: 65,
          },       
        });
      } else {
        // ซ่อน TabBar ถ้ากลับด้วยวิธีอื่นๆ เช่น navigation.goBack()
        navigation.getParent()?.setOptions({
          tabBarStyle: { display: 'none' },
        });
      }
    });

    return unsubscribe;
  }, [navigation]);

    async function getData() {
        const token = await AsyncStorage.getItem('token');
        axios.post('http://10.0.2.2:5000/userdata', { token: token })
            .then(res => {
                setUserData(res.data.data);
            });
    }

    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://10.0.2.2:5000/allcaremanual');
                setCareManualData(response.data.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching care manual data:', error);
            }
        };

        fetchData();
    }, []);
    const formatDate = dateTimeString => {
        const dateTime = new Date(dateTimeString);
        const day = dateTime.getDate();
        const month = dateTime.getMonth() + 1;
        const year = dateTime.getFullYear();
        const hours = dateTime.getHours();
        const minutes = dateTime.getMinutes();
    
        // ปรับเปลี่ยนเดือนเป็นภาษาไทย
        const thaiMonths = [
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
    
        // ปรับรูปแบบให้เป็น 2 หลัก
        const formattedHours = hours < 10 ? '0' + hours : hours;
        const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    
        // จัดรูปแบบให้อยู่ในรูปแบบ 'dd เดือน(ภาษาไทย) yyyy เวลา HH:MM น.'
        return `${day < 10 ? '0' + day : day} ${thaiMonths[month - 1]} ${year + 543}`;
    };
    // เวลา ${formattedHours}:${formattedMinutes} น.
    return (
        <LinearGradient
        // colors={['#00A9E0', '#5AB9EA', '#E0FFFF', '#FFFFFF']}
        colors={['#5AB9EA', '#87CEFA']}
      
        style={{flex: 1}}  // ให้ครอบคลุมทั้งหน้าจอ
      >
        <ScrollView
            keyboardShouldPersistTaps={'always'}
            showsVerticalScrollIndicator={false}
            
            contentContainerStyle={[styles.scrollContainer, { paddingBottom: 40 }]}            // style={styles.mainContainer}
            style={{backgroundColor: 'transparent'}}
        >
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#00BFFF" />
                    <Text style={styles.loadingText}>กำลังโหลด...</Text>
                </View>
            ) : (
                <View style={styles.contentContainer}>
                    {careManualData && careManualData.map((item, index) => (
                        <TouchableOpacity key={item._id} style={styles.card} onPress={() => navigation.navigate('Caremanualitem', { id: item._id })}>
                            <Icon name="book" size={30} color="#00BFFF" style={styles.icon} />
                            <View style={styles.textContainer}>
                                <Text
                                    style={styles.cardText}
                                    numberOfLines={1} //จะตัดถ้าข้อความยาว
                                    ellipsizeMode='tail' // ตัดข้อความปลาย แสดง ...
                                >
                                    {item.caremanual_name}
                                </Text>
                                <Text
                                    style={styles.in_cardText}
                                >
                                    {/* อัปเดตล่าสุดเมื่อ: {formatDate(item.updatedAt)} */}
                                    สร้างเมื่อ: {formatDate(item.createdAt)}

                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </ScrollView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    // mainContainer: {
    //     backgroundColor: '#f5f5f5',
    // },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#777',
        fontFamily: 'Kanit-Regular',
    },
    contentContainer: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 22,
        marginVertical: 8,
        marginHorizontal: 10,
        width: '90%',
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    icon: {
        marginRight: 10,
    },
    cardText: {
        color: '#333',
        fontSize: 16,
        flexShrink: 1,
        fontFamily: 'Kanit-SemiBold',
    },

    in_cardText:{
        color: '#333',
        fontSize: 16,
        flexShrink: 1,
        fontFamily: 'Kanit-Regular',
    },
    textContainer: {
        flex: 1, // ทำให้ Text อยู่ในบรรทัดเดียว
        flexDirection: 'column', // เพื่อให้ข้อความอยู่ในบรรทัดใหม่
    },
});

export default CaremanualScreen;
