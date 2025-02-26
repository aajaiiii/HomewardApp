import {Text, Image, TouchableOpacity} from 'react-native';
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
import ChatScreen from './Screens/โค้ดเก่า/ChatScreen1';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect, useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import SplashScreen from 'react-native-splash-screen';

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
import ChatSendScreen from './Screens/โค้ดเก่า/ChatSendScreen';

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
              style={{width: 200, height: 50, marginTop: 8}} // ปรับขนาดตามที่คุณต้องการ
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

const ProfileStack = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: '#000',
        headerTitleAlign: 'center',
      }}>
      <Stack.Screen
        options={{
          title: 'การตั้งค่า',
        }}
        name="Profile"
        component={ProfileScreen}
      />

      <Stack.Screen
        options={{
          title: 'ข้อมูลส่วนตัว',
        }}
        name="User"
        component={UserScreen}
      />
      <Stack.Screen name="LoginUser" component={LoginNav} />
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

const TabNav = ({unreadCount, setUnreadCount}) => {
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
        component={ProfileStack}
        options={{
          tabBarIcon: ({color, size, focused}) => (
            <Ionicons
              name={focused ? 'settings-sharp' : 'settings-outline'}
              size={22}
              color={focused ? '#87CEFA' : 'black'}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

//หน้าที่ไม่แสดง TabNav
const MainStack = ({unreadCount, setUnreadCount}) => {
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
      <Stack.Screen name="FormStack" component={FormStack} />
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
    </Stack.Navigator>
  );
};

const FormStack = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: '#000',
        headerTitleAlign: 'center',
      }}>
      <Stack.Screen
        name="PatientForm"
        component={PatientForm}
        options={{
          title: 'บันทึกอาการผู้ป่วย',
        }}
      />
      <Stack.Screen
        name="PatientForm2"
        component={PatientForm2}
        options={{
          title: 'บันทึกอาการผู้ป่วย',
        }}
      />
    </Stack.Navigator>
  );
};

const LoginNav = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Login" component={LoginPage} />
      <Stack.Screen name="Home" component={TabNav} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="VerifyOtp" component={VerifyOtp} />
      <Stack.Screen name="ResetPassword" component={ResetPassword} />
    </Stack.Navigator>
  );
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  async function getData() {
    const data = await AsyncStorage.getItem('isLoggedIn');
    console.log(data, 'at app.jsx');
    setIsLoggedIn(JSON.parse(data));
  }

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const data = await AsyncStorage.getItem('isLoggedIn');
      setIsLoggedIn(JSON.parse(data));
    };

    const interval = setInterval(checkLoginStatus, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <MainStack unreadCount={unreadCount} setUnreadCount={setUnreadCount} />
      ) : (
        <LoginNav />
      )}
      <Toast config={toastConfig} />
    </NavigationContainer>
  );
}

export default App;
