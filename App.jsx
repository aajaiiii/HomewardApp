import {Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
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
import ChatScreen1 from './Screens/โค้ดเก่า/ChatScreen1';
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
import Caregiver from './Screens/Caregiver';
import CaregiverAdd from './Screens/CaregiverAdd';

import UpdatePassword from './Screens/Updatepassword';
import Ionicons from 'react-native-vector-icons/Ionicons';
import PatientForm from './Screens/PatientForm';
import PatientForm2 from './Screens/PatientForm2';
import Assessment from './Screens/Assessment';
import Assessmentitem from './Screens/Assessmentitem';
import ForgotPassword from './Screens/Login/ForgotPassword';
import VerifyOtp from './Screens/Login/VerifyOtp';
import ResetPassword from './Screens/Login/ResetPassword';
import ChatSendScreen from './Screens/โค้ดเก่า/ChatSendScreen';
import ConsentScreen from './Screens/AddData/ConsentScreen';

import Informationone from './Screens/AddData/informationone';
import Informationtwo from './Screens/AddData/informationtwo';
import Success from './Screens/AddData/success';
import CustomHeader from './Screens/AddData/CustomHeader';
import SearchKeyword from './Screens/โค้ดเก่า/SearchKeyword';
import PatientFormEdit from './Screens/PatientFormEdit';
import PatientFormEdit2 from './Screens/PatientFormEdit2';
import UpdateOTP from './Screens/email/updateotp';
import VerifyOtpEmail from './Screens/email/VerifyOtp';
import EmailVerification from './Screens/email/email-verification';
import UpdateEmail from './Screens/email/updateemail';
import ChatScreen from './Screens/chat/ChatScreen';
import io from 'socket.io-client';
import PushNotification from 'react-native-push-notification';

const toastConfig = {
  success: props => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: 'green',
        borderLeftWidth: 7,
        width: '90%',
        height: 70,
        // borderRightColor: 'green',
        // borderRightWidth: 7,
        // top: '50%',
      }}
      contentContainerStyle={{paddingHorizontal: 15}}
      text1Style={{
        fontSize: 17,
        fontFamily: 'Kanit-Medium',
        fontWeight: 'normal',
        color: '#2ecc71',
      }}
      text2Style={{
        fontSize: 14,
        fontFamily: 'Kanit-Regular',
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
        // borderRightColor: 'red',
        // borderRightWidth: 7,
      }}
      contentContainerStyle={{paddingHorizontal: 15}}
      text1Style={{
        fontSize: 17,
        fontFamily: 'Kanit-Medium',
        fontWeight: 'normal',
        color: '#e74c3c',
      }}
      text2Style={{
        fontSize: 14,
        fontFamily: 'Kanit-Regular',

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
        headerTintColor: '#fff',
        headerStyle: {
          backgroundColor: '#5AB9EA',
        },
        headerTitleStyle: {
          fontFamily: 'Kanit-Medium',
        },
        headerTitleAlign: 'center',
      }}>
      <Stack.Screen
        options={{
          headerTitle: () => (
            <Image
              source={require('./assets/Logo.png')}
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
        options={{
          title: 'คู่มือ',
        }}
        name="Caremanualitem"
        component={Caremanualitem}
        // options={{headerShown: false}}
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
      <Stack.Screen
        options={{
          title: 'บันทึกอาการผู้ป่วย',
          animation: 'slide_from_right',
        }}
        name="PatientForm"
        component={PatientForm}
      />
      <Stack.Screen
        name="PatientForm2"
        component={PatientForm2}
        options={{
          title: 'บันทึกอาการผู้ป่วย',
          animation: 'slide_from_right',
          headerLeft: null,
          headerBackVisible: false,
        }}
      />
      <Stack.Screen
        options={{
          title: 'แก้ไขบันทึกอาการผู้ป่วย',
          animation: 'slide_from_right',
        }}
        name="PatientFormEdit"
        component={PatientFormEdit}
      />
      <Stack.Screen
        name="PatientFormEdit2"
        component={PatientFormEdit2}
        options={{
          title: 'แก้ไขบันทึกอาการผู้ป่วย',
          animation: 'slide_from_right',
          headerLeft: null,
          headerBackVisible: false,
        }}
      />
      <Stack.Screen name="TabNav" component={TabNav} />
    </Stack.Navigator>
  );
};

const ProfileStack = ({setIsLoggedIn}) => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: '#fff',
        headerStyle: {
          backgroundColor: '#5AB9EA', // Set the header background color
        },
        headerTitleStyle: {
          fontFamily: 'Kanit-Medium', // ทำให้ชื่อหัวข้อเป็นตัวหนา
        },
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
          title: 'แก้ไขข้อมูลทั่วไป',
        }}
        name="UserEdit"
        component={UserEditScreen}
      />
      <Stack.Screen
        options={{
          title: 'ข้อมูลผู้ดูแล',
        }}
        name="Caregiver"
        component={Caregiver}
      />
      <Stack.Screen
        options={{
          title: 'เพิ่มข้อมูลผู้ดูแล',
        }}
        name="CaregiverAdd"
        component={CaregiverAdd}
      />
      <Stack.Screen
        options={{
          title: 'แก้ไขข้อมูลผู้ดูแล',
        }}
        name="CaregiverEdit"
        component={CaregiverEdit}
      />
      <Stack.Screen
        options={{
          title: 'เปลี่ยนรหัสผ่าน',
        }}
        name="Updatepassword"
        component={UpdatePassword}
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

      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="Loginuser"
        component={LoginNav}
      />
    </Stack.Navigator>
  );
};

const ChatStack = ({setUnreadCount, userId}) => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: '#fff',
        headerStyle: {
          backgroundColor: '#5AB9EA',
        },
        headerTitleStyle: {
          fontFamily: 'Kanit-Medium',
        },
        headerTitleAlign: 'center',
        headerShown: true,
      }}>
      <Stack.Screen
        options={({navigation}) => ({
          title: 'แช็ต',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('Home')}
              style={{marginLeft: 10}}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
          ),
        })}
        name="Chat">
        {props => (
          <ChatScreen
            {...props}
            userId={userId}
            setUnreadCount={setUnreadCount}
          />
        )}
      </Stack.Screen>

      <Stack.Screen
        name="ChatSend"
        component={ChatSendScreen}
        options={({route}) => ({title: route.params.userName})}
      />
      <Stack.Screen
        name="SearchKeyword"
        component={SearchKeyword}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

const TabNav = ({userId, setIsLoggedIn, userUnreadCounts}) => {
  const [unreadBadge, setUnreadBadge] = useState(null);
  const Tab = createBottomTabNavigator();

  useEffect(() => {
    // อัปเดต badge เมื่อ userUnreadCounts เปลี่ยนแปลง
    const currentUserUnread = Array.isArray(userUnreadCounts)
      ? userUnreadCounts.find(user => String(user.userId) === String(userId))
      : null;

    setUnreadBadge(
      currentUserUnread && currentUserUnread.totalUnreadCount > 0
        ? currentUserUnread.totalUnreadCount
        : null,
    );
  }, [userUnreadCounts, userId]);
  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={{
        headerShown: false,
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
        tabBarLabelStyle: {
          fontSize: 14,
          fontFamily: 'Kanit-Regular',
          marginBottom: 5,
        },
      }}>
      <Tab.Screen
        name="ChatTab"
        options={{
          tabBarLabel: 'แช็ต',
          tabBarIcon: ({color, size, focused}) => (
            <Ionicons
              name={focused ? 'chatbox-ellipses' : 'chatbox-ellipses-outline'}
              size={22}
              color={focused ? '#5AB9EA' : 'black'}
            />
          ),
          tabBarBadge: unreadBadge,
        }}>
        {props => <ChatStack {...props} />}
      </Tab.Screen>

      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{
          tabBarLabel: 'หน้าหลัก',
          tabBarIcon: ({color, size, focused}) => (
            <Ionicons
              name={focused ? 'home-sharp' : 'home-outline'}
              size={22}
              color={focused ? '#5AB9EA' : 'black'}
            />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        // component={ProfileStack}
        options={{
          tabBarLabel: 'การตั้งค่า',
          tabBarIcon: ({color, size, focused}) => (
            <Ionicons
              name={focused ? 'settings-sharp' : 'settings-outline'}
              size={22}
              color={focused ? '#5AB9EA' : 'black'}
            />
          ),
        }}>
        {props => <ProfileStack {...props} setIsLoggedIn={setIsLoggedIn} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

//หน้าที่ไม่แสดง TabNav
const MainStack = ({
  unreadCount,
  setUnreadCount,
  setIsLoggedIn,
  userUnreadCounts,
  userId,
}) => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: '#fff',
        headerStyle: {
          backgroundColor: '#5AB9EA',
        },
        headerTitleStyle: {
          fontFamily: 'Kanit-Medium',
        },
        headerTitleAlign: 'center',
        headerShown: true,
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
            userUnreadCounts={userUnreadCounts}
            userId={userId}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

const InformationStack = ({setAddDataFirst}) => {
  const Stack = createNativeStackNavigator();

  const screenOptions = (title, currentScreen) => ({
    header: () => <CustomHeader currentScreen={currentScreen} />,
    headerTitle: title,
    animation: 'slide_from_right',
  });

  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: '#fff',
        headerStyle: {
          backgroundColor: '#5AB9EA', 
        },
        headerTitleStyle: {
          fontFamily: 'Kanit-Medium', 
        },
        headerTitleAlign: 'center',
        headerShown: true,
      }}>
      <Stack.Screen
        name="ConsentScreen"
        component={ConsentScreen}
        // options={screenOptions('หน้า1', 'ConsentScreen')}
        options={{
          title: 'นโยบายส่วนบุคคล',
        }}
      />
      <Stack.Screen
        name="Informationone"
        component={Informationone}
        options={screenOptions('หน้า2', 'Informationone')}
      />
      <Stack.Screen
        name="Informationtwo"
        component={Informationtwo}
        options={screenOptions('หน้า3', 'Informationtwo')}
      />
      <Stack.Screen
        options={{headerShown: false}}
        name="Home"
        component={TabNav}
      />
      <Stack.Screen
        name="Success"
        component={Success}
        initialParams={{setAddDataFirst}}
        options={{
          headerTitle: () => (
            <Image
              source={require('./assets/Logo.png')}
              style={{width: 200, height: 50, marginTop: 8}}
            />
          ),
          headerLeft: null,
          headerBackVisible: false,
        }}
        // listeners={{
        //   focus: () => {
        //     setAddDataFirst(true);
        //     AsyncStorage.setItem('addDataFirst', 'true');
        //   },
        // }}
      />
      {/* <Stack.Screen
        options={{headerShown: false}}
        name="Profile"
        component={ProfileStack}
      /> */}
    </Stack.Navigator>
  );
};
const LoginNav = ({getData}) => {
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
  const [isLoading, setIsLoading] = useState(true);  // สถานะโหลดข้อมูล
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [addDataFirst, setAddDataFirst] = useState(false);
  const [userUnreadCounts, setUserUnreadCounts] = useState([]); // To store the `users` array from the response
  const [socket, setSocket] = useState(null); // Socket.IO
  const [userId, setUserId] = useState(null); // เพิ่ม state สำหรับ userId
  
  async function getData() {
    // console.log('กำลังดำเนินเรื่อง...');
    const data = await AsyncStorage.getItem('isLoggedIn');
    const addDataFirstValue = await AsyncStorage.getItem('addDataFirst');
    console.log(data, 'ทำงานแล้ว');
    console.log('addDataFirst1:', addDataFirstValue); // เพิ่ม log เพื่อตรวจสอบข้อมูล
    setIsLoggedIn(JSON.parse(data) || false);
    setAddDataFirst(JSON.parse(addDataFirstValue) || false);
  }

  useEffect(() => {
    const initialize = async () => {
      await getData(); // Fetch data on mount
      setTimeout(() => {
        SplashScreen.hide();
      }, 900);
    };
    initialize();
  }, []);

  const fetchUser = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      console.log('Token:', token);
      const response = await axios.post('http://10.0.2.2:5000/userdata', {
        token,
      });

      const userId = response.data?.data?._id;
      setUserId(userId);
      console.log('ได้อะไร', userId);
    } catch (error) {
      // console.error('Error fetching User:', error);
    }
  };

  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (!userId) return; // รอจนกว่า userId จะมีค่า
      try {
        const response = await axios.get(
          'http://10.0.2.2:5000/update-unread-count',
        );

        if (response.status === 200) {
          const data = response.data;
          if (data.success) {
            console.log('Fetched Unread Counts:', data.users); // ตรวจสอบข้อมูลที่ได้รับ
            setUserUnreadCounts(data.users || []);
          }
        } else {
          throw new Error(`Network response was not ok: ${response.status}`);
        }
      } catch (error) {
        console.error('Error fetching unread count:', error);
      }
    };

    fetchUnreadCount();
  }, [userId]); // ใช้ userId เป็น dependency

  useEffect(() => {
    const newSocket = io('http://10.0.2.2:5000');

    newSocket.on('connect', () => {
      console.log('Socket connected successfully!');
      console.log('UserId received:', userId);
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    socket?.on('TotalUnreadCounts', data => {
      // console.log('📦 TotalUnreadCounts received:', data);
      setUserUnreadCounts(data);
    });

    return () => {
      socket?.off('TotalUnreadCounts');
    };
  }, [socket]);

  useEffect(() => {
    socket?.on('updateUnreadCounts', data => {
      // console.log('จำนวนแชท:', data);
      setUserUnreadCounts(data);
    });

    return () => {
      socket?.off('updateUnreadCounts');
    };
  }, [socket]);

  useEffect(() => {
    let intervalId;
    if (isLoggedIn) {
      fetchUser();
      intervalId = setInterval(() => {
        fetchUser();
      }, 5500);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isLoggedIn]);

// เพิ่มใหม่เช็คว่ากรอกค่าแรกเข้ายัง
  // useEffect(() => {
  //   const initializeApp = async () => {
  //     try {
  //       const storedIsLoggedIn = await AsyncStorage.getItem('isLoggedIn');
  //       const storedAddDataFirst = await AsyncStorage.getItem('addDataFirst');
  //       const storedUserId = await AsyncStorage.getItem('userId');

  //       const loggedInStatus = JSON.parse(storedIsLoggedIn) || false;
  //       const addDataFirstStatus = JSON.parse(storedAddDataFirst) || false;
  //       const userIdData = JSON.parse(storedUserId) || null;

  //       if (loggedInStatus && !addDataFirstStatus) {
  //         // ถ้า AddDataFirst ยังเป็น false → ล้างข้อมูลทั้งหมดและบังคับไปหน้า Login
  //         await AsyncStorage.clear();
  //         setIsLoggedIn(false);
  //         setAddDataFirst(false);
  //       } else {
  //         setIsLoggedIn(loggedInStatus);
  //         setAddDataFirst(addDataFirstStatus);
  //         setUserId(userIdData);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching data from AsyncStorage:', error);
  //     } finally {
  //       setIsLoading(false);
  //       SplashScreen.hide();
  //     }
  //   };

  //   initializeApp();
  // }, []);

  // อัปเดต Badge เมื่อ userUnreadCounts เปลี่ยน
  useEffect(() => {
    const currentUserUnread = userUnreadCounts?.find(
      user => String(user.userId) === String(userId),
    );
    const unreadCount = currentUserUnread?.totalUnreadCount || 0;
    // console.log("ยังไม่อาน: ", unreadCount);
    setUnreadCount(unreadCount);

    updateAppBadge(unreadCount);
  }, [userUnreadCounts, userId]);

  const updateAppBadge = unreadCount => {
    // console.log("icon แอป: ", unreadCount); 
    PushNotification.setApplicationIconBadgeNumber(unreadCount);
  };


  //มันต้องรีแล้วจะใช้ได้ ข้อมูลที่ getdata() ไม่ขึ้นตอน login เสร็จ
  //ได้แล้ว 25/09/67 2.28
  return (
    <NavigationContainer>
      {isLoggedIn && addDataFirst ? (
        <MainStack
          unreadCount={unreadCount}
          setUnreadCount={setUnreadCount}
          setIsLoggedIn={setIsLoggedIn}
          userUnreadCounts={userUnreadCounts}
          userId={userId}
        />
      ) : isLoggedIn && !addDataFirst ? (
        <InformationStack setAddDataFirst={setAddDataFirst} />
      ) : (
        <LoginNav getData={getData} />
      )}
      <Toast config={toastConfig} />
    </NavigationContainer>
  );
}

export default App;
