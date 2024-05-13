import {Text,Image} from 'react-native';
import HomeScreen from './Screens/HomeScreen';
import {useNavigation, NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ProfileScreen from './Screens/ProfileScreen';
import LoginPage from './Screens/Login/Login';
import UserScreen from './Screens/UserScreen';
import ChatScreen from './Screens/ChatScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect, useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import CaremanualScreen from './Screens/CaremanualScreen';
import UserEditScreen from './Screens/UserEditScreen';
import Caremanualitem from './Screens/CaremanualItem';
import CaregiverEdit from './Screens/CaregiverEdit';
import UpdatePassword from './Screens/Updatepassword';
import Icon from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';

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
                style={{ width: 200, height: 50 ,marginTop:8}} // ปรับขนาดตามที่คุณต้องการ
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
          headerShown:'false'
        }}
        name="Caremanualitem"
        component={Caremanualitem}
      />
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
          tabBarVisible: false,
        }}
        tabBarOptions={{}}
        name="CaregiverEdit"
        component={CaregiverEdit}
      />
      <Stack.Screen
        options={{
          title: 'เปลี่ยนรหัสผ่าน',
          tabBarVisible: false,
        }}
        tabBarOptions={{}}
        name="Updatepassword"
        component={UpdatePassword}
      />
    </Stack.Navigator>
  );
};

const ChatStack = () => {
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
        name="Chat"
        component={ChatScreen}
      />
    </Stack.Navigator>
  );
};

const DrawerNav = () => {
  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator
    initialRouteName="หน้าหลัก"
    screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: '#87CEFA',
        },
        headerTintColor: '#000',
        headerTitleAlign: 'center',
      }}
      tabBarOptions={{
        activeTintColor: '#87CEFA',
        inactiveTintColor: 'black',
        // tabStyle: {backgroundColor: '#fff'},
        tabStyle: {backgroundColor: '#fff'},

      }}>
        
      <Tab.Screen
        name="แช็ต"
        component={ChatStack}
        options={{
          tabBarIcon: ({color, size, focused}) => (
            <Ionicons
              name={focused ? 'chatbox-ellipses' : 'chatbox-ellipses-outline'}
              size={22}
              color={focused ? '#87CEFA' : 'black'}
            />
          ),
        }}
      />
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

const LoginNav = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Login" component={LoginPage} />
      <Stack.Screen name="Home" component={DrawerNav} />
    </Stack.Navigator>
  );
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  async function getData() {
    const data = await AsyncStorage.getItem('isLoggedIn');
    console.log(data, 'at app.jsx');
    setIsLoggedIn(data);
  }

  return (
    <NavigationContainer>
      {isLoggedIn ? <DrawerNav /> : <LoginNav />}
    </NavigationContainer>
  );
}

export default App;
