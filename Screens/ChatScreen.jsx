import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
   Modal ,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';

function ChatScreen() {
  const [allMpersonnel, setAllMpersonnel] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const navigation = useNavigation();
  const [userData, setUserData] = useState('');
  const [recipientId, setRecipientId] = useState('');
  const [recipientModel, setRecipientModel] = useState('');
  const [currentRecipient, setCurrentRecipient] = useState(null);
  const [data, setData] = useState('');

  async function getData() {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.post('http://192.168.2.38:5000/userdata', {
        token: token,
      });
      console.log(response.data);
      setUserData(response.data.data);
      fetchAllUsers(response.data.data._id); // ส่ง userId มาด้วย
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }

  useEffect(() => {
    getData();
    const interval = setInterval(getData, 1000); // เรียก getData ทุก 1 วินาที
    return () => clearInterval(interval);
  }, []);
  
  const fetchAllUsers = async (userId) => {
    try {
      const response = await fetch(
        `http://192.168.2.38:5000/allMpersonnelchat1?userId=${userId}`, // ส่ง userId ผ่าน query string
      );
      const data = await response.json();
  
      const usersWithLastMessage = await Promise.all(
        data.data.map(async user => {
          const lastMessageResponse = await fetch(
            `http://192.168.2.38:5000/lastmessage/${user._id}?loginUserId=${userId}`, // ส่ง userId และ loginUserId ผ่าน query string
          );
          const lastMessageData = await lastMessageResponse.json();
          return {...user, lastMessage: lastMessageData.lastMessage};
        }),
      );
  
      const sortedUsers = usersWithLastMessage.sort((a, b) => {
        if (!a.lastMessage) return 1;
        if (!b.lastMessage) return -1;
        return (
          new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt)
        );
      });
      setAllMpersonnel(sortedUsers);
    } catch (error) {
      console.error('Error fetching all users:', error);
    }
  };
  

  const handleSelectRecipient = user => {
    setRecipientId(user._id);
    setRecipientModel('MPersonnel');
    setCurrentRecipient(user);

    navigation.navigate('ChatSend', {
      userName: `${user.name} ${user.surname}`,
      recipientId: user._id,
      recipientModel: 'MPersonnel',
      currentRecipient: user,
    });
  };

  const formatTime = dateTimeString => {
    const dateTime = new Date(dateTimeString);
    const hours = dateTime.getHours();
    const minutes = dateTime.getMinutes();
    return `${hours < 10 ? '0' + hours : hours}:${
      minutes < 10 ? '0' + minutes : minutes
    }`;
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + '...';
  };

  return (
    <View style={styles.viewStyle}>
      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="ค้นหา"
          value={searchKeyword}
          onChangeText={setSearchKeyword}
        />
      </View>
      <ScrollView style={styles.userList}>
      {allMpersonnel.map(user => (
  <TouchableOpacity
    key={user._id}
    style={styles.userItem}
    onPress={() => handleSelectRecipient(user)}>
    <View style={styles.userInfo}>
      <Text style={styles.userName}>
        {user.name} {user.surname}
      </Text>
      {user.lastMessage && (
        <Text
          style={
            user.lastMessage.senderModel === 'MPersonnel' && !user.lastMessage.isRead
              ? styles.lastMessageUnread
              : styles.lastMessage
          }>
          {user.lastMessage.sender._id === userData._id ? 'คุณ' : user.lastMessage.sender.name}
          :{' '}
          {user.lastMessage.image ? 'ส่งรูปภาพ' : truncateText(user.lastMessage.message, 10)}
          <Text style={styles.timeText}>
            {' '}
            {formatTime(user.lastMessage.createdAt)}
          </Text>
        </Text>
      )}
    </View>
    {user.lastMessage &&
      user.lastMessage.senderModel === 'MPersonnel' &&
      !user.lastMessage.isRead && <View style={styles.unreadDot}></View>}
  </TouchableOpacity>
))}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  viewStyle: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  searchBar: {
    width: '100%',
    padding: 10,
    backgroundColor: '#fff',
  },
  searchInput: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    paddingHorizontal: 8,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3, // for Android shadow
  },
  userList: {
    width: '100%',
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  userItem: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', 
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'normal',
    color: '#333',
  },
  userNameUnread: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  lastMessage: {
    color: '#666',
    fontSize: 14,
    marginTop: 5,
    fontWeight: 'normal',
  },
  lastMessageUnread: {
    color: '#666',
    fontSize: 14,
    marginTop: 5,
    fontWeight: 'bold',
  },
  timeText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginTop: 5,
  },
  unreadDot: {
    width: 10,
    height: 10,
    backgroundColor: '#87CEFA',
    borderRadius: 5,
  },
});

export default ChatScreen;
