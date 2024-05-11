import {Text} from 'react-native';
import HomeScreen from './Screens/HomeScreen';
import {useNavigation, NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ProfileScreen from './Screens/ProfileScreen';
import LoginPage from './Screens/Login/Login';
import UserScreen from './Screens/UserScreen';
import ChatScreen from './Screens/ChatScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect, useState} from 'react';
import BottomTab from './navigations/BottomTab';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import CaremanualScreen from './Screens/CaremanualScreen';
import UserEditScreen from './Screens/UserEditScreen';
import Caremanualitem from './Screens/CaremanualItem';
import CaregiverEdit from './Screens/CaregiverEdit';
const HomeStack = () => {
  const Stack = createNativeStackNavigator();
  const navigation = useNavigation();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,

        headerTintColor: '#000',
        headerTitleAlign: 'center',
      }}>
      <Stack.Screen
        options={{
          title: 'หน้าหลัก',
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
      />
    </Stack.Navigator>
  );
};

const ProfileStack = () => {
  const Stack = createNativeStackNavigator();
  const navigation = useNavigation();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
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
          tabBarStyle: {display: 'none'}, // ซ่อน bottom bar สำหรับหน้า "ข้อมูลส่วนตัว"
        }}
        name="User"
        component={UserScreen}
      />

      <Stack.Screen
        options={{
          title: 'แก้ไขข้อมูลส่วนตัว',
          tabBarStyle: {display: 'none'}, // ซ่อน bottom bar สำหรับหน้า "แก้ไขข้อมูลส่วนตัว"
        }}
        name="UserEdit"
        component={UserEditScreen}
      />
            <Stack.Screen
        options={{
          title: 'แก้ไขข้อมูลผู้ดูแล',
          tabBarStyle: {display: 'none'}, // ซ่อน bottom bar สำหรับหน้า "แก้ไขข้อมูลส่วนตัว"
        }}
        name="CaregiverEdit"
        component={CaregiverEdit}
      />
    </Stack.Navigator>
  );
};

const ChatStack = () => {
  const Stack = createNativeStackNavigator();
  const navigation = useNavigation();
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
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerTintColor: '#000',
        headerTitleAlign: 'center',
      }}
      tabBarOptions={{
        activeTintColor: 'black',
        inactiveTintColor: 'gray',
        style: {backgroundColor: '#87CEFA'},
        tabStyle: {backgroundColor: '#87CEFA'},
      }}>
      <Tab.Screen name="Chat" component={ChatStack} />
      <Tab.Screen
        options={{
          headerShown: false,
        }}
        name="Home"
        component={HomeStack}
      />
      {/* <Tab.Screen name="Caremanualitem" component={CaremanualPage} /> */}
      <Tab.Screen name="Setting" component={ProfileStack} />
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
