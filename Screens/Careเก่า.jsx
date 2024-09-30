import {Text, Image, TouchableOpacity,StyleSheet} from 'react-native';
import HomeScreen from './Screens/HomeScreen';
import {
  useNavigation,
  useRoute,
  NavigationContainer,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ProfileScreen from './Screens/ProfileScreen';
import LoginPage from './Screens/Login/Login';
import UserScreen from './Screens/UserScreen';
import ChatScreen from './Screens/ChatScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect, useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import SplashScreen from 'react-native-splash-screen';
import axios from 'axios';
import Toast, {BaseToast, ErrorToast} from 'react-native-toast-message';
import CaremanualScreen from './Screens/CaremanualScreen';
import UserEditScreen from './Screens/UserEditScreen';
import Caremanualitem from './Screens/CaremanualItem';
import CaregiverEdit from './Screens/CaregiverEdit';
import UpdatePassword from './Screens/Updatepassword';
import Ionicons from 'react-native-vector-icons/Ionicons';
import PatientForm from './Screens/PatientForm';
import PatientForm2 from './Screens/PatientForm2';
import Assessment from './Screens/Assessment';
import Assessmentitem from './Screens/Assessmentitem';
import ForgotPassword from './Screens/Login/ForgotPassword';
import VerifyOtp from './Screens/Login/VerifyOtp';
import ResetPassword from './Screens/Login/ResetPassword';
import ChatSendScreen from './Screens/ChatSendScreen';
import Informationone from './Screens/AddData/informationone';
import Informationtwo from './Screens/AddData/informationtwo';
import Success from './Screens/AddData/success';
import CustomHeader from './Screens/AddData/CustomHeader';
import SearchKeyword from './Screens/SearchKeyword';
import PatientFormEdit from './Screens/PatientFormEdit';
import PatientFormEdit2 from './Screens/PatientFormEdit2';
import UpdateOTP from './Screens/email/updateotp';
import VerifyOtpEmail from './Screens/email/VerifyOtp';
import EmailVerification from './Screens/email/email-verification';
import UpdateEmail from './Screens/email/updateemail';


const fetchUnreadCount = async (setUnreadCount) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.post('http://192.168.2.57:5000/userdata', { token });
    const userId = response.data.data._id;
console.log('ได้อะไร',userId)
    const usersResponse = await axios.get(`http://192.168.2.57:5000/allMpersonnelchat1?userId=${userId}`);
    const users = usersResponse.data.data;

    const unreadUsers = users.filter(user => {
      const lastMessage = user.lastMessage;
      return lastMessage && lastMessage.senderModel === 'MPersonnel' && !lastMessage.isRead;
    });

    setUnreadCount(unreadUsers.length);
  } catch (error) {
    console.error('Error fetching unread count:', error);
  }
};


const toastConfig = {
  success: props => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: 'green',
        borderLeftWidth: 7,
        width: '90%',
        height: 70,
        borderRightColor: 'green',
        borderRightWidth: 7,
        // top: '50%',
      }}
      contentContainerStyle={{paddingHorizontal: 15}}
      text1Style={{
        fontSize: 17,
        fontWeight: '700',
      }}
      text2Style={{
        fontSize: 14,
      }}
    />
  ),

  error: props => (
    <ErrorToast
      {...props}
      text2NumberOfLines={3}
      style={{
        borderLeftColor: 'red',
        borderLeftWidth: 7,
        width: '90%',
        height: 70,
        borderRightColor: 'red',
        borderRightWidth: 7,
      }}
      contentContainerStyle={{paddingHorizontal: 15}}
      text1Style={{
        fontSize: 17,
        fontWeight: '700',
      }}
      text2Style={{
        fontSize: 14,
      }}
    />
  ),
};

const HomeStack = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerTintColor: '#000',
        headerTitleAlign: 'center',
      }}>
      <Stack.Screen
        options={{
          headerTitle: () => (
            <Image
              source={require('./assets/Logoblue.png')}
              style={{width: 200, height: 50, marginTop: 8}}
            />
          ),
        }}
        name="Home"
        component={HomeScreen}
      />

      <Stack.Screen
        options={{
          title: 'คู่มือ',
        }}
        name="Caremanual"
        component={CaremanualScreen}
      />

      <Stack.Screen
        name="Caremanualitem"
        component={Caremanualitem}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="Assessment"
        component={Assessment}
        options={{
          title: 'ผลการประเมินอาการ',
        }}
      />
      <Stack.Screen
        name="Assessmentitem"
        component={Assessmentitem}
        options={{
          title: 'ผลการประเมินอาการ',
        }}
      />
      <Stack.Screen name="TabNav" component={TabNav} />
    </Stack.Navigator>
  );
};

const ProfileStack = ({ setIsLoggedIn }) => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: '#000',
        headerTitleAlign: 'center',
        headerShown: true,
      }}>
      <Stack.Screen
        options={{
          title: 'การตั้งค่า',
        }}
        name="Profile" 
        // component={ProfileScreen}
        >
        {props => <ProfileScreen {...props} setIsLoggedIn={setIsLoggedIn} />} 

     
</Stack.Screen>
      <Stack.Screen
        options={{
          title: 'ข้อมูลส่วนตัว',
        }}
        name="User"
        component={UserScreen}
      />
      <Stack.Screen 
        options={{
          headerShown: false,
        }}
      name="Loginuser" 
      component={LoginNav} />
    </Stack.Navigator>
  );
};

const ChatStack = ({setUnreadCount}) => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerTintColor: '#000',
        headerTitleAlign: 'center',
      }}>
      <Stack.Screen
        options={{
          title: 'แช็ต',
        }}
        name="Chat">
        {props => <ChatScreen {...props} setUnreadCount={setUnreadCount} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

const TabNav = ({unreadCount, setUnreadCount, setIsLoggedIn}) => {
  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator
      initialRouteName="หน้าหลัก"
      screenOptions={{
        headerShown: false,
      }}>
      <Tab.Screen
        name="แช็ต"
        options={{
          tabBarIcon: ({color, size, focused}) => (
            <Ionicons
              name={focused ? 'chatbox-ellipses' : 'chatbox-ellipses-outline'}
              size={22}
              color={focused ? '#87CEFA' : 'black'}
            />
          ),
          tabBarBadge: unreadCount > 0 ? unreadCount : null,
        }}>
        {props => <ChatStack {...props} setUnreadCount={setUnreadCount} />}
      </Tab.Screen>
      <Tab.Screen
        name="หน้าหลัก"
        component={HomeStack}
        options={{
          tabBarIcon: ({color, size, focused}) => (
            <Ionicons
              name={focused ? 'home-sharp' : 'home-outline'}
              size={22}
              color={focused ? '#87CEFA' : 'black'}
            />
          ),
        }}
      />
      <Tab.Screen
        name="การตั้งค่า"
        // component={ProfileStack}
        options={{
          tabBarIcon: ({color, size, focused}) => (
            <Ionicons
              name={focused ? 'settings-sharp' : 'settings-outline'}
              size={22}
              color={focused ? '#87CEFA' : 'black'}
            />
          ),
        }}
      >
               {props => <ProfileStack {...props} setIsLoggedIn={setIsLoggedIn} />}
</Tab.Screen>
    </Tab.Navigator>
  );
};

//หน้าที่ไม่แสดง TabNav
const MainStack = ({unreadCount, setUnreadCount,setIsLoggedIn}) => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: '#000',
        headerTitleAlign: 'center',
      }}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="TabNav">
        {props => (
          <TabNav
            {...props}
            unreadCount={unreadCount}
            setUnreadCount={setUnreadCount}
            setIsLoggedIn={setIsLoggedIn}
          />
        )}
      </Stack.Screen>
      <Stack.Screen
        options={{
          title: 'บันทึกอาการผู้ป่วย',
        }}
        name="PatientForm"
        component={PatientForm}
      />
      <Stack.Screen
        name="PatientForm2"
        component={PatientForm2}
        options={{
          title: 'บันทึกอาการผู้ป่วย',
        }}
      />
         <Stack.Screen
        options={{
          title: 'แก้ไขบันทึกอาการผู้ป่วย',
        }}
        name="PatientFormEdit"
        component={PatientFormEdit}
      />
      <Stack.Screen
        name="PatientFormEdit2"
        component={PatientFormEdit2}
        options={{
          title: 'แก้ไขบันทึกอาการผู้ป่วย',
        }}
      />
      <Stack.Screen
        options={{
          title: 'แก้ไขข้อมูลทั่วไป',
        }}
        name="UserEdit"
        component={UserEditScreen}
      />
      <Stack.Screen
        options={{
          title: 'แก้ไขข้อมูลผู้ดูแล',
        }}
        name="CaregiverEdit"
        component={CaregiverEdit}
      />
      {/* <Stack.Screen name="FormStack" component={FormStack} /> */}
      <Stack.Screen
        options={{
          title: 'เปลี่ยนรหัสผ่าน',
        }}
        name="Updatepassword"
        component={UpdatePassword}
      />
      <Stack.Screen
        name="ChatSend"
        component={ChatSendScreen}
        options={({route}) => ({title: route.params.userName})}
      />
          <Stack.Screen
        name="SearchKeyword"
        component={SearchKeyword}
        options={{headerShown: false,
        }}
      />

    <Stack.Screen
        options={{
          title: 'ยืนยันอีเมล',
        }}
        name="EmailVerification"
        component={EmailVerification}
      />
          <Stack.Screen
        options={{
          title: 'กรอกรหัสยืนยัน',
        }}
        name="VerifyOtpEmail"
        component={VerifyOtpEmail}
      />
       <Stack.Screen
        options={{
          title: 'เปลี่ยนอีเมล',
        }}
        name="UpdateEmail"
        component={UpdateEmail}
      />
          <Stack.Screen
        options={{
          title: 'กรอกรหัสยืนยัน',
        }}
        name="UpdateOTP"
        component={UpdateOTP}
      />
    </Stack.Navigator>
  );
};

// const FormStack = () => {
//   const Stack = createNativeStackNavigator();

//   return (
//     <Stack.Navigator
//       screenOptions={{
//         headerTintColor: '#000',
//         headerTitleAlign: 'center',
//       }}>
//       <Stack.Screen
//         name="PatientForm"
//         component={PatientForm}
//         options={{
//           title: 'บันทึกอาการผู้ป่วย',
//         }}
//       />
//       <Stack.Screen
//         name="PatientForm2"
//         component={PatientForm2}
//         options={{
//           title: 'บันทึกอาการผู้ป่วย',
//         }}
//       />
//     </Stack.Navigator>
//   );
// };
const InformationStack = () => {
  const Stack = createNativeStackNavigator();

  const screenOptions = (title, currentScreen) => ({
    header: () => <CustomHeader currentScreen={currentScreen} />,
    headerTitle: title,
  });

  return (
    <Stack.Navigator
    screenOptions={{
      // headerShown: true,
      headerTintColor: '#000',
      headerTitleAlign: 'center',
    }}>
      <Stack.Screen
        name="Informationone"
        component={Informationone}
        options={screenOptions('หน้า1', 'Informationone')}
      />
      <Stack.Screen
        name="Informationtwo"
        component={Informationtwo}
        options={screenOptions('หน้า2', 'Informationtwo')}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="Home"
        component={TabNav}
      />
        <Stack.Screen
        name="Success"
        component={Success}
        options={{
          headerTitle: () => (
            <Image
              source={require('./assets/Logoblue.png')}
              style={{width: 200, height: 50, marginTop: 8}} 
            />
          ),
          headerLeft: null,
          headerBackVisible: false,
        }}
      />
       {/* <Stack.Screen
        options={{headerShown: false}}
        name="Profile"
        component={ProfileStack}
      /> */}
    </Stack.Navigator>
  );
};
const LoginNav = ({ getData }) => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
         <Stack.Screen name="Login">
        {props => <LoginPage {...props} getData={getData} />}
      </Stack.Screen>
      <Stack.Screen name="Home" component={TabNav} />
      <Stack.Screen name="Information" component={InformationStack} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="VerifyOtp" component={VerifyOtp} />
      <Stack.Screen name="ResetPassword" component={ResetPassword} />
    </Stack.Navigator>
  );
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);  
  const [unreadCount, setUnreadCount] = useState(0);
  const [addDataFirst, setAddDataFirst] = useState(false);

  async function getData() {
    const data = await AsyncStorage.getItem('isLoggedIn');    
    const addDataFirstValue = await AsyncStorage.getItem('addDataFirst');
    console.log(data, 'ทำงานแล้ว');
    console.log(isLoggedIn, 'ทำงานแล้ว');
    console.log('addDataFirst1:', addDataFirstValue); // เพิ่ม log เพื่อตรวจสอบข้อมูล
    setIsLoggedIn(JSON.parse(data) || false);
    setAddDataFirst(JSON.parse(addDataFirstValue) || false);
  }

  useEffect(() => {
    getData();
    setTimeout(() => {
      SplashScreen.hide();
    }, 900);
  }, [isLoggedIn]);


  useEffect(() => {
    if (isLoggedIn) {
      fetchUnreadCount(setUnreadCount);
    }
  }, [isLoggedIn]);





  return (
<NavigationContainer>
  {isLoggedIn && addDataFirst ? (
    <MainStack
      unreadCount={unreadCount}
      setUnreadCount={setUnreadCount}
      setIsLoggedIn={setIsLoggedIn} 
    />
  ) : isLoggedIn && !addDataFirst ? (
    <InformationStack />
  ) : (
    <LoginNav getData={getData}/>
  )}
  <Toast config={toastConfig} />
</NavigationContainer>

  );
}


export default App;


//หน้า login
// import {
//   View,
//   Text,
//   Image,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   Alert,
  
// } from 'react-native';
// import styles from './style';
// import {useEffect, useState} from 'react';
// import {useNavigation} from '@react-navigation/native';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import Icon from 'react-native-vector-icons/Feather';
// import Icon1 from 'react-native-vector-icons/AntDesign';
// import Ionicons from 'react-native-vector-icons/Ionicons';

// function LoginPage({ getData, navigation }) {
//   // const navigation = useNavigation();
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState(null);
//   const [passwordVisible, setPasswordVisible] = useState(false);

//   useEffect(() => {
//     const unsubscribe = navigation.addListener('focus', () => {
//       setError(null);
//     });

//     return unsubscribe;
//   }, [navigation]);

//   async function handleSubmit() {
//     console.log(username, password);
//     const userData = {
//       username: username,
//       password,
//     };
  
//     try {
//       const res = await axios.post('http://192.168.2.57:5000/loginuser', userData);
//       // console.log(res.data);
//       if (res.data.status === 'ok') {
//         await AsyncStorage.setItem('token', res.data.data);
//         await AsyncStorage.setItem('isLoggedIn', JSON.stringify(true));
//         await AsyncStorage.setItem('addDataFirst', JSON.stringify(res.data.addDataFirst));
//         getData(); 
//         if (res.data.addDataFirst) {
//           navigation.navigate('Home');
//         } else {
//           navigation.navigate('Information');
//         }
//       }
//     } catch (error) {
//       setError(error.response?.data?.error);
//     }
//   }
  
  

//   const forgot = () => {
//     navigation.navigate('ForgotPassword');
//   };

//   async function getData() {
//     const data = await AsyncStorage.getItem('isLoggedIn');
    
//     console.log(data, 'at app.jsx');
  
//   }
//   useEffect(()=>{
//     getData();
//     console.log("Hii");
//   },[])

//   return (
//     <ScrollView
//       contentContainerStyle={{flexGrow: 1}}
//       keyboardShouldPersistTaps={'always'}>
//       <View style={styles.pagelogin}>
//         <View style={styles.logoContainer}>
//           <Image
//             style={styles.logo}
//             source={require('../../assets/Logo.png')}
//           />
//         </View>

//         <View style={styles.loginContainer}>
//           <Text style={styles.text_header}>เข้าสู่ระบบ</Text>
//           <View style={styles.action}>
//             <Icon name="user" color="#87CEFA" style={styles.smallIcon} />
//             <TextInput
//               placeholder="เลขประจำตัวบัตรประชาชน"
//               style={styles.textInput}
//               onChange={e => setUsername(e.nativeEvent.text)}></TextInput>
//           </View>
//           <View style={styles.action}>
//               <Icon name="lock" color="#87CEFA" style={styles.smallIcon} />
//               <TextInput
//                 placeholder="รหัสผ่าน"
//                 style={styles.textInput}
//                 value={password}
//                 onChange={e => setPassword(e.nativeEvent.text)}
//                 secureTextEntry={!passwordVisible}></TextInput>
//               <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
//                 <Ionicons
//                   name={passwordVisible ? 'eye' : 'eye-off'}
//                   color="#87CEFA"
//                   style={{ fontSize: 20,marginTop: 3}}
//                 />
//               </TouchableOpacity>
//             </View>

//           <View style={{ flex: 1 }}>
//   {error && (
//     <View style={{ flexDirection: 'row', alignItems: 'center',marginTop:8, marginBottom: 5,marginLeft:18}}>
//       <Icon1
//         name="exclamationcircleo"
//         color="red"
//         style={{ marginRight: 5, fontSize: 18 }}
//       />
//       <Text style={{ color: 'red', marginVertical:'auto' }}>
//         {error}
//       </Text>
//     </View>
//   )}

//   <View
//     style={{
//       justifyContent: 'flex-end',
//       alignItems: 'flex-end',
//       marginTop: 8,
//       marginRight: 15,
//     }}>
//     <Text style={{ fontWeight: '500' }} onPress={forgot}>
//       ลืมรหัสผ่าน?
//     </Text>
//   </View>

//   <View style={styles.button}>
//     <TouchableOpacity
//       style={styles.inBut}
//       onPress={() => handleSubmit()}>
//       <View>
//         <Text style={styles.textSign}>เข้าสู่ระบบ</Text>
//       </View>
//     </TouchableOpacity>
//   </View>
// </View>

//         </View>
//       </View>
//     </ScrollView>
//   );
// }
// export default LoginPage;
