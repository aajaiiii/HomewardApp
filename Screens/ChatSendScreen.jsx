import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  Modal,
  Linking,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {useRoute} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';

function ChatSendScreen() {
  const route = useRoute();
  const {userName, recipientId, recipientModel, currentRecipient} = route.params;
  const [message, setMessage] = useState('');
  const [recipientChats, setRecipientChats] = useState([]);
  const [data, setData] = useState({});
  const [sender, setSender] = useState('');
  const [senderModel, setSenderModel] = useState('User');
  const scrollViewRef = useRef(null);
  const [inputHeight, setInputHeight] = useState(40); // ความสูงเริ่มต้นของ TextInput
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState('');
  const [modalImageUri, setModalImageUri] = useState('');
  const [autoScroll, setAutoScroll] = useState(true);


  const selectImage = () => {
    const options = {
      mediaType: 'photo',
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        // console.log('User cancelled image picker');
      } else if (response.errorCode) {
        // console.log('ImagePicker Error: ', response.errorCode);
      } else {
        const uri = response.assets[0]?.uri;
        setSelectedImageUri(uri);
        // setModalVisible(true);
      }
    });
  };

  const takePhoto = () => {
    const options = {
      mediaType: 'photo',
    };

    launchCamera(options, response => {
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.errorCode) {
        console.log('Camera Error: ', response.errorCode);
      } else {
        const uri = response.assets[0]?.uri;
        setSelectedImageUri(uri);
      }
    });
  };

  

  const ImageModal = () => (
    <Modal
      visible={modalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setModalVisible(false)}>
      {/* <View style={styles.modalBackground}> */}
      <View style={styles.modalContainer}>
        <TouchableOpacity
          onPress={() => setModalVisible(false)}
          style={styles.closeButton}>
          <Ionicons name="close-circle" size={30} color="white" />
        </TouchableOpacity>
        <Image
         source={{uri: modalImageUri}} 
          style={styles.modalImage}
          resizeMode="contain"
        />
      </View>
      {/* </View> */}
    </Modal>
  );

  const handleContentSizeChange = event => {
    setInputHeight(event.nativeEvent.contentSize.height);
  };

  useEffect(() => {
    if (autoScroll && scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [recipientChats]);

  const handleScroll = event => {
    const contentHeight = event.nativeEvent.contentSize.height;
    const scrollOffsetY = event.nativeEvent.contentOffset.y;
    const visibleHeight = event.nativeEvent.layoutMeasurement.height;
    if (scrollOffsetY + visibleHeight >= contentHeight - 50) {
      setAutoScroll(true);
    } else {
      setAutoScroll(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.post('http://192.168.2.57:5000/userdata', {
          token: token,
        });
        const userData = response.data.data;
        setData(userData);
        setSender(userData._id);
        setSenderModel(userData.role === 'mpersonnel' ? 'MPersonnel' : 'User');
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, []);

  
  useEffect(() => {
    if (sender) {
      fetchRecipientChats(recipientId, recipientModel);
    }
  }, [recipientId, recipientModel, sender]);

  const fetchRecipientChats = async (recipientId, recipientModel) => {
    try {
      console.log(
        `แชท12: ${recipientId}, recipientModel: ${recipientModel}, sender: ${sender}, senderModel: ${senderModel}`,
      );
      const response = await axios.get(
        `http://192.168.2.57:5000/chat/${recipientId}/${recipientModel}/${sender}/${senderModel}`,
      );
      // console.log('Response Data:', response.data);

      setRecipientChats(response.data.chats || []);
      // console.log('Chats:', response.data.chats);
      
    } catch (error) {
      console.error('Error fetching recipient chats:', error);
    }
  };

  
  const handleChangeMessage = text => {
    setMessage(text);
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('message', message);
      formData.append('recipientId', recipientId);
      formData.append('senderId', sender);
      formData.append('recipientModel', recipientModel);
      formData.append('senderModel', senderModel);
      if (selectedImageUri) {
        formData.append('image', {
          uri: selectedImageUri,
          type: 'image/jpeg', // or 'image/png' depending on the image type
          name: 'photo.jpg', // or any other name with the correct extension
        });
      }

      const response = await axios.post(
        'http://192.168.2.57:5000/sendchat',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      if (response.data.success) {
        setMessage('');
        setSelectedImageUri('');
        fetchRecipientChats(recipientId, recipientModel);
      } else {
        console.error('Error sending message:', response.data.message);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (sender && !modalVisible) {  // refresh เฉพาะเมื่อ modal ปิดอยู่
        fetchRecipientChats(recipientId, recipientModel);
      }
    }, 5000);
  
    return () => clearInterval(interval);
  }, [recipientId, recipientModel, sender, modalVisible]);  

  
  const formatDate = dateTimeString => {
    const dateTime = new Date(dateTimeString);
    const day = dateTime.getDate();
    const month = dateTime.getMonth() + 1;
    const year = dateTime.getFullYear();

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

    return `${day < 10 ? '0' + day : day} ${thaiMonths[month - 1]} ${
      year + 543
    }`;
  };

  const formatTime = dateTimeString => {
    const dateTime = new Date(dateTimeString);
    const hours = dateTime.getHours();
    const minutes = dateTime.getMinutes();
    return `${hours < 10 ? '0' + hours : hours}:${
      minutes < 10 ? '0' + minutes : minutes
    }`;
  };

  const isValidUrl = message => {
    try {
      const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?$/i;
      return urlPattern.test(message);
    } catch (e) {
      console.error('Error in URL validation regex:', e);
      return false;
    }
  };

  return (
    <View style={[styles.viewStyle]}>
      <ScrollView  style={styles.chatMessages}
        ref={scrollViewRef}
        onScroll={handleScroll}
        scrollEventThrottle={16} >
        {recipientChats.map((chat, index) => (
          <View key={index}>
            {(index === 0 ||
              new Date(chat.createdAt).getDate() !==
                new Date(recipientChats[index - 1].createdAt).getDate()) && (
              <Text style={styles.dateText}>{formatDate(chat.createdAt)}</Text>
            )}
            <View
              style={[
                styles.messageContainer,
                chat.sender._id === data._id
                  ? styles.sentContainer
                  : styles.receivedContainer,
              ]}>
             
              {chat.sender._id === data._id ? (
                <>
                  <View style={styles.statustime}>
                    {chat.isRead && (
                      <Text style={[styles.date, styles.Read]}>อ่านแล้ว</Text>
                    )}
                    <Text style={[styles.date, styles.sentDate]}>
                      {formatTime(chat.createdAt)}
                    </Text>
                  </View>
                  {chat.image ? (
                    <TouchableOpacity
                      onPress={() => {
                        setModalImageUri(chat.image); 
                        setModalVisible(true);
                      }}>
                      <View style={[styles.received]}>
                        <Image
                          source={{uri: chat.image}}
                          style={{width: 200, height: 200}}
                        />
                      </View>
                    </TouchableOpacity>
                  ) : (
                          <View style={[styles.chatMessage, styles.sent]}>
                      {isValidUrl(chat.message) ? (
                        <TouchableOpacity onPress={() => Linking.openURL(chat.message)}>
                          <Text style={[styles.messageContent, styles.sentText, { textDecorationLine: 'underline' }]}>
                            {chat.message}
                          </Text>
                        </TouchableOpacity>
                      ) : (
                        <Text style={[styles.messageContent, styles.sentText]}>
                          {chat.message}
                        </Text>
                      )}
                    </View>
                  )}
                </>
              ) : (
                <>
                  {chat.image ? (
                    <TouchableOpacity
                      onPress={() => {
                        setModalImageUri(chat.image); 
                        setModalVisible(true);
                      }}>
                      <View style={[styles.received]}>
                        <Image
                          source={{uri: chat.image}}
                          style={{width: 200, height: 200}}
                        />
                      </View>
                    </TouchableOpacity>
                  ) : (
                    <View style={[styles.chatMessage, styles.received]}>
                    {isValidUrl(chat.message) ? (
                      <TouchableOpacity onPress={() => Linking.openURL(chat.message)}>
                        <Text style={[styles.messageContent, styles.receivedText, { textDecorationLine: 'underline' }]}>
                          {chat.message}
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <Text style={[styles.messageContent, styles.receivedText]}>
                        {chat.message}
                      </Text>
                    )}
                  </View>
                  )}

                  <Text style={[styles.date, styles.receivedDate]}>
                    {formatTime(chat.createdAt)}
                  </Text>
                </>
              )}
            </View>
          </View>
        ))}
      </ScrollView>

      <ImageModal />

      {selectedImageUri ? (
        <View style={styles.selectedImageContainer}>
          <Image
            source={{uri: selectedImageUri}}
            style={styles.selectedImage}
          />
          <TouchableOpacity
            style={styles.removeImageButton}
            onPress={() => setSelectedImageUri('')}>
            <Ionicons name="close-circle" size={24} color="black" />
          </TouchableOpacity>
        </View>
      ) : null}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.chatForm}>
        <View style={{flexDirection: 'row', alignItems: 'center', flex: 1, padding:5}}>
          <TouchableOpacity onPress={selectImage} style={{margin:3}}>
            <Ionicons name="image" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={takePhoto} style={{margin:3}}>
            <Ionicons name="camera" size={28} color="black" />
          </TouchableOpacity>
          <TextInput
            style={[styles.input, , {height: Math.max(40, inputHeight)}]}
            value={message}
            textAlignVertical="top"
            multiline={true}
            onChangeText={handleChangeMessage}
            onContentSizeChange={handleContentSizeChange}
            placeholder="พิมพ์ข้อความ..."
          />

          {(message || selectedImageUri) && (
            <TouchableOpacity onPress={handleSubmit}>
              <Feather name="send" size={24} color="black" />
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
const styles = StyleSheet.create({
  viewStyle: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  chatMessages: {
    flex: 1,
    padding: 10,
    marginBottom: 10,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    marginBottom: 10,
  },
  sentContainer: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  receivedContainer: {
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  chatMessage: {
    padding: 10,
    borderRadius: 20,
    maxWidth: '75%',
  },
  sent: {
    backgroundColor: '#87CEFA',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 0,
  },
  received: {
    backgroundColor: '#e4e6eb',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 0,
  },
  dateText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginVertical: 10,
  },
  date: {
    fontSize: 12,
    color: '#666',
  },
  sentDate: {
    // marginRight: 10,
  },
  statustime: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginRight: 7,
  },
  receivedDate: {
    justifyContent: 'flex-end',
    marginLeft: 7,
  },
  messageContent: {
    fontSize: 16,
  },
  sentText: {
    color: '#000',
  },
  receivedText: {
    color: '#000',
  },
  chatForm: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#87CEFA',
    paddingHorizontal: 10,
    paddingVertical: 5,
    // marginBottom: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#CCC',
    borderWidth: 1,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#FFF',
  },
  sendButton: {
    backgroundColor: '#87CEFA',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
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
  selectedImage: {
    width: 40,
    height: 40,
    borderRadius: 10,
    marginLeft: 20,
  },
  removeImageButton: {
    top: -50,
    marginLeft: 45,
    marginRight: 10,
  },
});

export default ChatSendScreen;
