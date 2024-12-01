// import {
//     StyleSheet,
//     Image,
//     Text,
//     View,
//     Button,
//     TouchableOpacity,
//     ScrollView,
//     Linking,
//     BackHandler,
//     Alert,
//   } from 'react-native';
//   import {useNavigation} from '@react-navigation/native';
//   import {useEffect, useState} from 'react';
//   import AsyncStorage from '@react-native-async-storage/async-storage';
//   import axios from 'axios';
//   import Icon from 'react-native-vector-icons/FontAwesome';
//   import styless from './style';
//   import Swiper from 'react-native-swiper';
//   import {useFocusEffect} from '@react-navigation/native';
//   import React from 'react';
//   import LinearGradient from 'react-native-linear-gradient';
  
//   const googleUrl =
//     'https://dmsic.moph.go.th/index/detail/9040';
  
//   function HomeScreen(props) {
//     const navigation = useNavigation();
//     console.log(props);
//     const [userData, setUserData] = useState('');
//     const [assessments, setAssessments] = useState([]);
//   const [showPatientForm, setShowPatientForm] = useState(true);
  
//     async function getData() {
//       const token = await AsyncStorage.getItem('token');
//       console.log(token);
//       axios
//         .post('https://us-central1-homeward-422311.cloudfunctions.net/api/userdata', {token: token})
//         .then(res => {
//           console.log(res.data);
//           setUserData(res.data.data);
//           console.log(userData);
//         });
//     }
//     const handleBackPress = () => {
//       Alert.alert('ออกจากแอป', 'คถณต้องการออกจากแอปเราใช่ไหม?', [
//         {
//           text: 'ไม่',
//           onPress: () => null,
//           style: 'ไม่',
//         },
//         {
//           text: 'ใช่',
//           onPress: () => BackHandler.exitApp(),
//         },
//       ]);
//       return true;
//     };
  
//     useFocusEffect(
//       React.useCallback(() => {
//         BackHandler.addEventListener('hardwareBackPress', handleBackPress);
  
//         return () => {
//           BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
//         };
//       }),
//     );
  
//     useEffect(() => {
//       getData();
//     }, []);
  
//     const Caremanual = () => {
//       navigation.navigate('Caremanual', {userData: 'userData'});
//     };
//     const PatientForm = () => {
//       navigation.navigate('PatientForm', {userData: 'userData'});
//     };
  
//     const Assessment = () => {
//       navigation.navigate('Assessment', {userData: 'userData'});
//     };
  
//     async function logout() {
//       AsyncStorage.setItem('isLoggedIn', '');
//       AsyncStorage.setItem('token', '');
//       navigation.navigate('LoginUser');
//     }
  
//     const fetchPatientForms = async (userId) => {
//       try {
//         const response = await axios.get(`https://us-central1-homeward-422311.cloudfunctions.net/api/getpatientforms/${userId}`);
//         return response.data.data; // อาเรย์ของ PatientForm
//       } catch (error) {
//         console.error('เกิดข้อผิดพลาดในการดึงข้อมูล PatientForm:', error);
//         return [];
//       }
//     };
//     const fetchAssessments = async (patientFormIds) => {
//       try {
//         const response = await axios.get(`https://us-central1-homeward-422311.cloudfunctions.net/api/assessments`, {
//           params: { patientFormIds }
//         });
//         return response.data.data; // อาเรย์ของ Assessment
//       } catch (error) {
//         console.error('เกิดข้อผิดพลาดในการดึงข้อมูล Assessment:', error);
//         return [];
//       }
//     };
    
//     useEffect(() => {
//       if (userData) {
//         const fetchData = async () => {
//           const patientForms = await fetchPatientForms(userData._id);
//           const patientFormIds = patientForms.map(form => form._id);
//           const assessments = await fetchAssessments(patientFormIds);
//           setAssessments(assessments);
          
//           const hasCompletedTreatment = assessments.some(
//             assessment => assessment.status_name === 'จบการรักษา'
//           );
//           setShowPatientForm(!hasCompletedTreatment);
//         };
    
//         fetchData();
//       }
//     }, [userData]);
//     function getGreeting() {
//       const hours = new Date().getHours();
//       if (hours < 12) {
//         return 'สวัสดีตอนเช้า'; 
//       } else if (hours < 17) {
//         return 'สวัสดีตอนสาย';
//       } else if (hours < 20) {
//         return 'สวัสดีตอนบ่าย'; 
//       } else {
//         return 'สวัสดีตอนค่ำ';
//       }
//     }
//     return (
//       <LinearGradient
//       // colors={['#00BFFF', '#87CEFA', '#B0E0E6', '#F0FFFF']}
//       colors={['#00A9E0', '#5AB9EA', '#E0FFFF', '#FFFFFF']}
//       // colors={['#5AB9EA', '#ADD8E6', '#E0FFFF', '#FFFFFF']}
//       // colors={['#1E90FF', '#87CEEB', '#B0E0E6', '#E6F7FF']}      
//       style={{flex: 1}}  // ให้ครอบคลุมทั้งหน้าจอ
//     >
//       <ScrollView
//         keyboardShouldPersistTaps={'always'}
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{paddingBottom: 40}}
//         style={{backgroundColor: 'transparent'}}>
          
//         {/* <Text style={styles.greetingText}>
//             {getGreeting()} <Text style={styles.userName}>{userData.name}</Text>
//           </Text> */}
//         <View style={styles.swiper}>
//           <TouchableOpacity onPress={() => Linking.openURL(googleUrl)}>
//             <Image
//               style={styles.image}
//               source={require('../assets/banner.png')}
//             />
//           </TouchableOpacity>
//           {/* <TouchableOpacity onPress={() => Linking.openURL(googleUrl)}>
//             <Image
//               style={styles.image}
//               source={require('../assets/imagehome.png')}
//             />
//           </TouchableOpacity> */}
//           {/* <TouchableOpacity onPress={() => Linking.openURL(googleUrl)}>
//             <Image
//               style={styles.image}
//               source={require('../assets/imagehome.png')}
//             />
//           </TouchableOpacity> */}
//         </View>
//         <View style={styles.containerWrapper}>
//       <View style={styles.card}>
//         <TouchableOpacity style={[styles.container,styles.yellow]} onPress={Caremanual} activeOpacity={0.7} >
//           <Image
//             style={styles.buttonImage}
//             source={require('../assets/book.png')}
//           />
//         </TouchableOpacity>
//         <Text style={styles.text} title="Caremanual">
//           คู่มือดูแลผู้ป่วย
//         </Text>
//       </View>
  
//       {showPatientForm && (
//         <View style={styles.card}>
//           <TouchableOpacity style={[styles.container,styles.green]} onPress={PatientForm} activeOpacity={0.7} >
//             <Image
//               style={styles.buttonImage}
//               source={require('../assets/note.png')}
//             />
//           </TouchableOpacity>
//           <Text style={styles.text} title="PatientForm">
//             บันทึกอาการ   ผู้ป่วย
//           </Text>
//         </View>
//       )}
  
//       <View style={styles.card}>
//         <TouchableOpacity style={[styles.container,styles.pink]} onPress={Assessment} activeOpacity={0.7} >
//           <Image
//             style={styles.buttonImage}
//             source={require('../assets/search.png')}
//           />
//         </TouchableOpacity>
//         <Text style={styles.text} title="Assessment">
//           ผลการประเมินอาการ
//         </Text>
//       </View>
//     </View>
       
//       </ScrollView>
//       </LinearGradient>
//     );
//   }
  
//   const styles = StyleSheet.create({
//     greetingText: {
//       fontSize: 28, 
//       fontWeight: '600', 
//       color: '#ffffff',
//       textShadowColor: '#000',
//       textShadowOffset: { width: 1, height: 1 }, 
//       textShadowRadius: 2, 
//       marginLeft: 17,
//       marginTop: 20,
//       lineHeight: 34,
//     },
    
//     userName: {
//       fontSize: 28, 
//       fontWeight: '700',
//       color: '#fff', 
//     },
//     container: {
//       backgroundColor: '#fff',
//       padding: 20,
//       borderRadius: 10,
//       height: 100,
//       width: '90%',  // ปรับให้เต็มความกว้าง
//       alignItems: 'center',
//       justifyContent: 'center',
//       shadowColor: '#000',
//       shadowOffset: {
//         width: 0,
//         height: 4,
//       },
//       shadowOpacity: 0.1,
//       shadowRadius: 10,
//       elevation: 5,
//       marginBottom: 10,
//       marginTop:15,
//     },
//     // yellow:{
//     //   backgroundColor:'#FFC344'
//     // },
//     // green:{
//     //   backgroundColor:'#00C27A'
//     // },
//     // pink:{
//     //   backgroundColor:'#FE3D97'
//     // },
//     text: {  
//       textAlign: 'center',
//       color: '#000',
//       fontFamily: 'Arial',
//       fontSize: 16,
//       fontWeight: '600',
//       lineHeight: 24, // เพิ่มความสูงของบรรทัด
//       paddingHorizontal: 10,
//       // เพิ่ม margin หรือ padding อื่นๆ ตามต้องการ
//     },  
//     swiper: {
//       height: 220,
//       marginTop: 10,
//     },
//     image: {
//       height: 200,
//       width: 360,
//       marginTop: 15,
//       marginBottom: 10,
//       marginLeft: 'auto',
//       marginRight: 'auto',
//       borderRadius: 10,
//     },
//     containerWrapper: {
//       flexDirection: 'row',
//       justifyContent: 'space-around',
//       alignItems: 'flex-start',
//       paddingHorizontal: 10,
//       flexWrap: 'wrap', // เพิ่มการเว้นระยะห่างแบบยืดหยุ่น
//     },
    
//     buttonImage: {
//       height: 50,
//       width: 50,
//       marginBottom: 10, // เพิ่มระยะห่างระหว่างรูปภาพและข้อความ
//     },
//     card: {
//       flex: 1,
//       alignItems: 'center',
//     },
//   });
  
//   export default HomeScreen;
  
  
import {
    StyleSheet,
    Image,
    Text,
    View,
    Button,
    TouchableOpacity,
    ScrollView,
    Linking,
    BackHandler,
    Alert,
  } from 'react-native';
  import {useNavigation} from '@react-navigation/native';
  import {useEffect, useState} from 'react';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  import axios from 'axios';
  import Icon from 'react-native-vector-icons/FontAwesome';
  import styless from './style';
  import Swiper from 'react-native-swiper';
  import {useFocusEffect} from '@react-navigation/native';
  import React from 'react';
  import LinearGradient from 'react-native-linear-gradient';
  
  const googleUrl =
    'https://dmsic.moph.go.th/index/detail/9040';
  
  function HomeScreen(props) {
    const navigation = useNavigation();
    console.log(props);
    const [userData, setUserData] = useState('');
    const [assessments, setAssessments] = useState([]);
    const [showPatientForm, setShowPatientForm] = useState(true);
  
    async function getData() {
      const token = await AsyncStorage.getItem('token');
      console.log(token);
      axios
        .post('https://us-central1-homeward-422311.cloudfunctions.net/api/userdata', {token: token})
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
      }),
    );
  
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
      AsyncStorage.setItem('isLoggedIn', '');
      AsyncStorage.setItem('token', '');
      navigation.navigate('LoginUser');
    }
  
    const fetchPatientForms = async (userId) => {
      try {
        const response = await axios.get(`https://us-central1-homeward-422311.cloudfunctions.net/api/getpatientforms/${userId}`);
        return response.data.data; // อาเรย์ของ PatientForm
      } catch (error) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูล PatientForm:', error);
        return [];
      }
    };
  
    const fetchAssessments = async (patientFormIds) => {
      try {
        const response = await axios.get(`https://us-central1-homeward-422311.cloudfunctions.net/api/assessments`, {
          params: { patientFormIds }
        });
        return response.data.data; // อาเรย์ของ Assessment
      } catch (error) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูล Assessment:', error);
        return [];
      }
    };
    
    useEffect(() => {
      if (userData) {
        const fetchData = async () => {
          const patientForms = await fetchPatientForms(userData._id);
          const patientFormIds = patientForms.map(form => form._id);
          const assessments = await fetchAssessments(patientFormIds);
          setAssessments(assessments);
          
          const hasCompletedTreatment = assessments.some(
            assessment => assessment.status_name === 'จบการรักษา'
          );
          setShowPatientForm(!hasCompletedTreatment);
        };
    
        fetchData();
      }
    }, [userData]);
  
    function getGreeting() {
      const hours = new Date().getHours();
      if (hours < 12) {
        return 'สวัสดีตอนเช้า'; 
      } else if (hours < 17) {
        return 'สวัสดีตอนสาย';
      } else if (hours < 20) {
        return 'สวัสดีตอนบ่าย'; 
      } else {
        return 'สวัสดีตอนค่ำ';
      }
    }
  
    return (
      <LinearGradient
        colors={['#5AB9EA', '#87CEFA']}
        style={{flex: 1}}  // ให้ครอบคลุมทั้งหน้าจอ
      >
        <ScrollView
          keyboardShouldPersistTaps={'always'}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 40}}
          style={{backgroundColor: 'transparent'}}
        >
          <Text style={styles.greetingText}>
            {getGreeting()} <Text style={styles.userName}>คุณ{userData.name}</Text>
          </Text>
          
          <View style={styles.swiper}>
            <TouchableOpacity onPress={() => Linking.openURL(googleUrl)}>
              <Image
                style={styles.image}
                source={require('../assets/banner.png')}
              />
            </TouchableOpacity>
          </View>
  
          <View style={styles.containerWrapper}>
            <View style={styles.card}>
              <TouchableOpacity style={[styles.container, styles.yellow]} onPress={Caremanual} activeOpacity={0.7}>
                <Image
                  style={styles.buttonImage}
                  source={require('../assets/book.png')}
                />
                <Text style={styles.text} title="Caremanual">
                  คู่มือดูแลผู้ป่วย
                </Text>
              </TouchableOpacity>
            </View>
  
            {showPatientForm && (
              <View style={styles.card}>
                <TouchableOpacity style={[styles.container, styles.green]} onPress={PatientForm} activeOpacity={0.7}>
                  <Image
                    style={styles.buttonImage}
                    source={require('../assets/note.png')}
                  />
                  <Text style={styles.text} title="PatientForm">
                    บันทึกอาการผู้ป่วย
                  </Text>
                </TouchableOpacity>
              </View>
            )}
  
            <View style={styles.card}>
              <TouchableOpacity style={[styles.container, styles.pink]} onPress={Assessment} activeOpacity={0.7}>
                <Image
                  style={styles.buttonImage}
                  source={require('../assets/search.png')}
                />
                <Text style={styles.text} title="Assessment">
                  ผลการประเมินอาการ
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    );
  }
  
  const styles = StyleSheet.create({
    greetingText: {
      fontSize: 18, 
      fontWeight: '600', 
      color: '#ffffff',
      marginLeft: 18,
      marginTop: 20,
      lineHeight: 28,
    },
    
    userName: {
      fontSize: 18, 
      fontWeight: '700',
      color: '#fff', 
    },
    container: {
      flexDirection: 'row', // Use row to align items horizontally
      backgroundColor: '#fff',
      padding: 13,
      borderRadius: 10,
      height: 75,
      width: '92%',  // ปรับให้เต็มความกว้าง
      alignItems: 'center',
      justifyContent: 'flex-start', // Align items to the start
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 5,
      marginTop: 5,
    },
    text: {  
      textAlign: 'left', // Align text to the left
      color: '#000',
      fontFamily: 'Arial',
      fontSize: 16,
      fontWeight: '600',
      lineHeight: 24, // เพิ่มความสูงของบรรทัด
      // paddingHorizontal: 10,
      flex: 1,
    },  
    swiper: {
      height: 220,
      marginTop: 1,
    },
    image: {
      height: 200,
      width: 365,
      marginTop: 15,
      marginBottom: 10,
      marginLeft: 'auto',
      marginRight: 'auto',
      borderRadius: 10,
    },
    containerWrapper: {
      flexDirection: 'row',
      justifyContent: 'flex-start', // จัดกล่องทางด้านซ้าย
      alignItems: 'flex-start',
      paddingHorizontal: 5,
      flexWrap: 'wrap', // ทำให้กล่องแบ่งแถวใหม่ได้
    },
    buttonImage: {
      height: 35,
      width: 35,
      marginRight: 10, // เพิ่มระยะห่างระหว่างรูปภาพและข้อความ
    },
    card: {
      width: '50%', // กำหนดความกว้างเพื่อให้กล่องสามารถอยู่ใน 2 คอลัมน์
      alignItems: 'center',
      marginBottom: 10,
    },
  });
  
  export default HomeScreen;
  