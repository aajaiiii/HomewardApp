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
  Keyboard,
  Image,
  FlatList,
  Linking,
  BackHandler,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {useRoute} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import {useFocusEffect} from '@react-navigation/native';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import io from 'socket.io-client';
import ImageViewer from 'react-native-image-zoom-viewer';
import Modal from 'react-native-modal';
const ChatScreen = ({userId}) => {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [data, setData] = useState([]);
  const [sender, setSender] = useState({name: '', surname: '', _id: ''});
  const [messages, setMessages] = useState([]); // ประวัติแชท
  const [input, setInput] = useState(''); // ข้อความที่พิมพ์
  const [file, setFile] = useState(null);
  const [selectedImageUri, setSelectedImageUri] = useState('');
  const [modalImageUri, setModalImageUri] = useState('');
  const [inputHeight, setInputHeight] = useState(40); // ความสูงเริ่มต้นของ TextInput
  const [modalVisible, setModalVisible] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    const backAction = () => {
      // ถ้าเป็นหน้า Profile หรือ Chat จะกลับไปที่หน้า Home ก่อน
      if (navigation.isFocused()) {
        navigation.navigate('Home');
        return true;
      }

      // ถ้าไม่ใช่หน้า Profile หรือ Chat ให้ทำตามพฤติกรรมปกติ
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => {
      backHandler.remove();
    };
  }, [navigation]);

  useEffect(() => {
    if (autoScroll && scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({animated: true});
    }
  }, [messages]);

  const handleScroll = event => {
    const contentHeight = event.nativeEvent.contentSize.height;
    const scrollOffsetY = event.nativeEvent.contentOffset.y;
    const visibleHeight = event.nativeEvent.layoutMeasurement.height;
    if (scrollOffsetY + visibleHeight >= contentHeight - 50) {
      setAutoScroll(true);
      if (messages.length > 0) {
        messages.forEach(message => {
          if (!message.readBy.includes(sender._id)) {
            markAsRead(message._id);
          }
        });
      }
    } else {
      setAutoScroll(false);
    }
  };
  const handleChangeMessage = text => {
    setInput(text);
  };

  useEffect(() => {
    const newSocket = io('http://10.0.2.2:5000');

    newSocket.on('connect', () => {
      console.log('Socket connected successfully!');
      setIsConnected(true);
      console.log('UserId received:', userId);
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.post('http://10.0.2.2:5000/userdata', {
          token: token,
        });
        const userData = response.data.data;
        setData(userData);
        setSender({
          name: response.data.data.name,
          surname: response.data.data.surname,
          _id: response.data.data._id,
        });
        console.log('Updated sender:', sender);

        // setSenderModel(userData.role === 'mpersonnel' ? 'MPersonnel' : 'User');
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, [sender._id]);

  // useEffect(() => {
  //   if (sender._id) {
  //     console.log('Sender ID:', sender._id);
  //     // ดึงประวัติแชทเมื่อเลือก User
  //     const fetchChatHistory = async () => {
  //       try {
  //         const response = await fetch(
  //           `http://10.0.2.2:5000/getChatHistory/${sender._id}`,
  //         );
  //         const result = await response.json();
  //         if (response.ok) {
  //           setMessages(result.chatHistory);
  //            // อัปเดตข้อความที่ยังไม่ได้อ่าน
  //            result.chatHistory.forEach((message) => {
  //             if (!message.readBy.includes(sender._id)) {
  //               markAsRead(message._id);
  //             }
  //           });
  //           console.log('แชท11414', result.chatHistory);
  //         } else {
  //           console.error('Failed to fetch chat history:', result.message);
  //         }
  //       } catch (error) {
  //         console.error('Error fetching chat history:', error);
  //       }
  //     };

  //     fetchChatHistory();

  //     // เข้าร่วมห้องแชท
  //     socket?.emit('joinRoom', sender._id);

  //     // รับข้อความใหม่
  //     socket?.on('receiveMessage', message => {
  //       setMessages(prev => [...prev, message]);
  //     });

  //     return () => {
  //       socket?.off('receiveMessage');
  //     };
  //   }
  // }, [sender._id, socket]);

  const fetchChatHistory = async () => {
    try {
      const response = await fetch(
        `http://10.0.2.2:5000/getChatHistory/${sender._id}`,
      );
      const result = await response.json();
      if (response.ok) {
        setMessages(result.chatHistory);

        // อัปเดตข้อความที่ยังไม่ได้อ่าน
        result.chatHistory.forEach(message => {
          if (!message.readBy.includes(sender._id)) {
            markAsRead(message._id);
          }
        });
      } else {
        console.error('Failed to fetch chat history:', result.message);
      }
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      navigation.getParent()?.setOptions({
        tabBarStyle: {display: 'none'},
      });
      return () => {
        navigation.getParent()?.setOptions({
          tabBarStyle: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            elevation: 0,
            backgroundColor: '#fff',
            borderTopColor: 'transparent',
            shadowColor: '#000',
            shadowOffset: {width: 0, height: -2},
            shadowOpacity: 0.1,
            shadowRadius: 6,
            height: 60,
          },
        });
      };
    }, [navigation]),
  );

  const sendMessage = async () => {
    if (input.length > 1000) {
      alert('ข้อความเกินความยาวสูงสุดที่กำหนดไว้ 1000 ตัวอักษร');
      return;
    }
    if (input.trim() || selectedImageUri) {
      const formData = new FormData();
      formData.append('message', input);
      formData.append('senderId', sender._id);
      formData.append('roomId', sender._id);
      formData.append('senderModel', 'User');
      if (selectedImageUri) {
        formData.append('image', {
          uri: selectedImageUri,
          type: 'image/jpeg',
          name: 'photo.jpg',
        });
      }
      setInput('');
      setFile(null);
      setSelectedImageUri('');
      try {
        const response = await fetch('http://10.0.2.2:5000/sendchat', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();

        if (response.ok) {
          //   setMessages((prev) => [...prev, result.newChat]);
          setInput('');
          setFile(null);
          setSelectedImageUri('');
          // setFilePreview(null);
          // const textarea = textareaRef.current;
          // textarea.style.height = "50px";
        } else {
          console.error('Failed to send message:', result.message);
        }
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  useEffect(() => {
    socket?.on('readByUpdated', ({messageId, readBy, unreadCount}) => {
      if (messageId && readBy) {
        setMessages(prevMessages =>
          prevMessages.map(message =>
            message._id === messageId ? {...message, readBy} : message,
          ),
        );
      }
    });

    return () => {
      socket?.off('readByUpdated');
    };
  }, [socket, sender._id]);

  // ฟังก์ชันส่ง Event "markAsRead" เมื่อผู้ใช้เลื่อนผ่านข้อความ
  const markAsRead = messageId => {
    if (socket) {
      socket.emit('markAsRead', {
        roomId: sender._id,
        messageId,
        userId: sender._id, // ส่ง ID ผู้ใช้ปัจจุบัน
      });
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      if (sender._id) {
        fetchChatHistory().then(() => {
          messages.forEach(message => {
            if (!message.readBy.includes(sender._id)) {
              markAsRead(message._id);
            }
          });
        });
      }
      return () => {
        console.log('Leaving ChatScreen');
      };
    }, [sender._id, socket]),
  );

  useEffect(() => {
    if (socket && sender._id) {
      socket.emit('joinRoom', sender._id);

      socket.on('receiveMessage', message => {
        setMessages(prev => [...prev, message]);
      });

      return () => {
        socket.off('receiveMessage');
      };
    }
  }, [socket, sender._id]);

  //   // รับข้อมูล unread count จาก backend
  //   socket?.on('updateUnreadCounts', (data) => {
  //     console.log('จำนวนแชท:', data);
  //     setUserUnreadCounts(data);
  //   });

  //   return () => {
  //     socket?.off('updateUnreadCounts');
  //   };
  // }, [socket]);
  // useEffect(() => {
  //   const observer = new IntersectionObserver(
  //     (entries) => {
  //       entries.forEach((entry) => {
  //         if (entry.isIntersecting) {
  //           const messageId = entry.target.dataset.id; // ใช้ data-id เพื่อเก็บ messageId
  //           if (messageId) {
  //             markAsRead(messageId); // อัปเดตเมื่อข้อความปรากฏใน viewport
  //           }
  //         }
  //       });
  //     },
  //     { threshold: 0.1 } // 10% ของข้อความที่ปรากฏใน viewport จะถูกพิจารณาว่าเห็น
  //   );

  //   // สร้าง observer สำหรับข้อความทุกข้อความ
  //   Object.values(messageRefs.current).forEach((ref) => {
  //     if (ref) observer.observe(ref);
  //   });

  //   return () => {
  //     // ล้าง observer เมื่อ component ถูกลบ
  //     observer.disconnect();
  //   };
  // }, [messages, socket]);

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
  const formatTime = dateTimeString => {
    const dateTime = new Date(dateTimeString);
    const hours = dateTime.getHours();
    const minutes = dateTime.getMinutes();
    return `${hours < 10 ? '0' + hours : hours}:${
      minutes < 10 ? '0' + minutes : minutes
    }`;
  };
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

  const isImageFile = url => {
    return (
      url.endsWith('.jpg?alt=media') ||
      url.endsWith('.png?alt=media') ||
      url.endsWith('.jpeg?alt=media') ||
      url.endsWith('.gif?alt=media')
    );
  };
  function shortenFileName(fileName, maxLength = 15) {
    if (fileName.length <= maxLength) {
      return fileName; // หากความยาวน้อยกว่าหรือเท่ากับ maxLength ให้คืนค่าชื่อไฟล์เดิม
    }

    const extensionIndex = fileName.lastIndexOf('.');
    const extension = fileName.slice(extensionIndex); // รับส่วนต่อท้าย (เช่น .pdf)

    const nameWithoutExtension = fileName.slice(0, extensionIndex); // ชื่อไฟล์โดยไม่มีนามสกุล
    const shortenedName = nameWithoutExtension.slice(0, maxLength - 3) + '...'; // ตัดชื่อไฟล์และเพิ่ม ...

    return shortenedName + extension; // คืนค่าชื่อไฟล์ที่ตัดพร้อมนามสกุล
  }

  const formatFileSize = sizeInBytes => {
    const sizeInKB = sizeInBytes / 1024;
    return sizeInKB > 1024
      ? (sizeInKB / 1024).toFixed(2) + ' MB'
      : sizeInKB.toFixed(2) + ' KB';
  };

  const ImageModal = () => (
    // <Modal
    //   visible={modalVisible}
    //   transparent={true}
    //   animationType="slide"
    //   onRequestClose={() => setModalVisible(false)}>
    //   {/* <View style={styles.modalBackground}> */}
    //   <View style={styles.modalContainer}>
    //     <TouchableOpacity
    //       onPress={() => setModalVisible(false)}
    //       style={styles.closeButton}>
    //       <Ionicons name="close-circle" size={30} color="white" />
    //     </TouchableOpacity>
    //     <Image
    //       source={{uri: modalImageUri}}
    //       style={styles.modalImage}
    //       resizeMode="contain"
    //     />
    //   </View>
    //   {/* </View> */}
    // </Modal>
    <Modal
      isVisible={modalVisible}
      style={{margin: 0, flex: 1}}
      onBackdropPress={() => setModalVisible(false)}
      onBackButtonPress={() => setModalVisible(false)}>
      <View style={{flex: 1, backgroundColor: 'black'}}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => setModalVisible(false)}>
          <Ionicons name="close" size={32} color="#fff" />
        </TouchableOpacity>
        <View style={{flex: 1, backgroundColor: 'black', padding: 15}}>
          <ImageViewer
            imageUrls={[{url: modalImageUri}]}
            enableSwipeDown={true}
            onSwipeDown={() => setModalVisible(false)}
            renderIndicator={() => null}
          />
        </View>
      </View>
    </Modal>
  );

  const isValidUrl = message => {
    try {
      const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?$/i;
      return urlPattern.test(message);
    } catch (e) {
      console.error('Error in URL validation regex:', e);
      return false;
    }
  };
  const handleContentSizeChange = event => {
    setInputHeight(event.nativeEvent.contentSize.height);
  };
  // useEffect(() => {
  //   scrollViewRef.current?.scrollToEnd({animated: true});
  // }, [messages]);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      scrollViewRef.current?.scrollToEnd({animated: true});
    });

    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      scrollViewRef.current?.scrollToEnd({animated: true});
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);
  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      contentContainerStyle={{flexGrow: 1}}
      extraHeight={100} // เพิ่มพื้นที่สำหรับแป้นพิมพ์
      enableOnAndroid={true}>
      {/* <View style={{ flex: 1 }}> */}
      <ScrollView
        style={styles.chatMessages}
        ref={scrollViewRef}
        onContentSizeChange={() =>
          scrollViewRef.current?.scrollToEnd({animated: true})
        }
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{paddingBottom: 10}}>
        {messages.map((msg, index) => (
          <View key={index}>
            {(index === 0 ||
              new Date(msg.createdAt).getDate() !==
                new Date(messages[index - 1].createdAt).getDate()) && (
              <View style={styles.dateContainer}>
                <View style={styles.dateWrapper}>
                  <Text style={styles.dateText}>
                    {formatDate(msg.createdAt)}
                  </Text>
                </View>
              </View>
            )}
            <View
              style={[
                styles.messageContainer,
                msg.sender._id === sender._id
                  ? styles.sentContainer
                  : styles.receivedContainer,
              ]}>
              <View
                style={{
                  display: 'flex',
                  flexDirection:
                    msg.sender?._id === sender._id ? 'row-reverse' : 'row',
                  alignItems: 'flex-end',
                  marginBottom: '10px',
                  maxWidth: '100%',
                }}>
                <View
                  style={[
                    styles.chatMessage,
                    msg.sender._id === sender._id
                      ? styles.sent
                      : styles.received,
                  ]}>
                  {msg.image ? (
                    isImageFile(msg.image) ? (
                      <TouchableOpacity
                        onPress={() => {
                          setModalImageUri(msg.image);
                          setModalVisible(true);
                        }}>
                        <View
                          style={[
                            styles.imageContainer,
                            msg.sender._id === sender._id
                              ? styles.sentImageContainer
                              : styles.receivedImageContainer,
                          ]}>
                          <Image
                            source={{uri: msg.image}}
                            style={styles.imageStyle}
                            // resizeMode="cover"
                          />
                        </View>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        onPress={() => Linking.openURL(msg.image)}
                        style={styles.fileContainer}>
                        <Ionicons
                          name="document-text"
                          size={24}
                          color="black"
                        />
                        <View style={styles.fileInfo}>
                          <Text style={styles.fileName}>
                            {shortenFileName(msg.imageName)}{' '}
                            {/* Adjust name logic as needed */}
                          </Text>
                          <Text style={styles.fileSize}>
                            {formatFileSize(msg.fileSize)}{' '}
                            {/* Size formatting */}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    )
                  ) : (
                    <View
                      tyle={[
                        styles.chatMessage,
                        msg.sender._id === sender._id
                          ? styles.sentContainer
                          : styles.receivedContainer, // ตรวจสอบว่าเป็นข้อความที่เราส่งหรือได้รับ
                      ]}>
                      {isValidUrl(msg.message) ? (
                        <TouchableOpacity
                          onPress={() => Linking.openURL(msg.message)}>
                          <Text
                            style={[
                              styles.messageContent,
                              msg.sender._id === sender._id
                                ? styles.sentText
                                : styles.receivedText,
                              {textDecorationLine: 'underline'},
                            ]}>
                            {msg.message}
                          </Text>
                        </TouchableOpacity>
                      ) : (
                        <Text
                          style={[
                            styles.messageContent,
                            msg.sender._id === sender._id
                              ? styles.sentText
                              : styles.receivedText, // ใช้สีหรือรูปแบบข้อความที่แตกต่าง
                          ]}>
                          {msg.message}
                        </Text>
                      )}
                    </View>
                  )}

                  {/* <Text style={[
                  styles.messageContent,
                  msg.sender._id === sender._id
                    ? styles.sentText
                    : styles.receivedText,
                ]}>{msg.message}</Text> */}
                  {/* <Text >{msg.image}</Text> */}
                </View>
                <Text
                  style={[
                    styles.date,
                    msg.sender._id === sender._id
                      ? styles.sentDate
                      : styles.receivedDate,
                  ]}>
                  {formatTime(msg.createdAt)}
                </Text>
              </View>
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

      <View style={styles.chatForm}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: inputHeight > 45 ? 'flex-end' : 'center', // เงื่อนไขเปลี่ยนตำแหน่ง
          }}>
          <TouchableOpacity onPress={selectImage} style={{margin: 3}}>
            <Ionicons name="image" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={takePhoto} style={{margin: 3}}>
            <Ionicons name="camera" size={28} color="white" />
          </TouchableOpacity>
        </View>

        <TextInput
          style={[
            styles.input,
            {height: Math.min(Math.max(45, inputHeight), 120)},
          ]}
          value={input}
          scrollEnabled={true}
          textAlignVertical="top"
          multiline={true}
          onChangeText={handleChangeMessage}
          onContentSizeChange={handleContentSizeChange}
          placeholder="พิมพ์ข้อความ..."
        />

        {(input.trim() || selectedImageUri) && (
          <TouchableOpacity
            onPress={sendMessage}
            style={{alignSelf: inputHeight > 45 ? 'flex-end' : 'center'}}>
            <Feather name="send" size={24} color="white" style={{margin: 3}} />
          </TouchableOpacity>
        )}
      </View>
      {/* </View> */}
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  viewStyle: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  chatMessages: {
    // flex: 1,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#F7F7F7',
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
    padding: 12,
    borderRadius: 20,
    maxWidth: '80%',
  },
  sent: {
    backgroundColor: '#4fc3f7',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 0,
  },
  received: {
    backgroundColor: '#e4e6eb',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 0,
  },
  dateContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  dateWrapper: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  dateText: {
    fontSize: 14,
    color: '#eee',
    fontFamily: 'Kanit-Regular',
  },
  date: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Kanit-Regular',
  },
  sentDate: {
    marginRight: 7,
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
    fontFamily: 'Kanit-Regular',
  },
  sentText: {
    color: '#000',
    fontFamily: 'Kanit-Regular',
  },
  receivedText: {
    color: '#000',
    fontFamily: 'Kanit-Regular',
  },
  chatForm: {
    // height: 65,
    minHeight: 65,
    maxHeight: 145,
    flexDirection: 'row',
    // alignItems: 'center',
    // alignItems: 'flex-end',
    backgroundColor: '#5AB9EA',
    paddingHorizontal: 10,
    paddingVertical: 5,
    position: 'relative',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -5},
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },

  input: {
    flex: 1,
    height: 45,
    borderColor: '#CCC',
    borderWidth: 1,
    paddingHorizontal: 15,
    borderRadius: 20,
    // marginRight: 10,
    backgroundColor: '#FFF',
    fontFamily: 'Kanit-Regular',
    fontSize: 16,
    minHeight: 45, // ความสูงเริ่มต้น
    maxHeight: 120, // จำกัดความสูงไม่ให้ขยายเกิน
    textAlignVertical: 'top',
    alignSelf: 'center',
  },
  sendButton: {
    backgroundColor: '#5AB9EA',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Kanit-Medium',
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
  fileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#e4e6eb',
  },
  fileInfo: {
    marginLeft: 10,
  },
  fileName: {
    fontSize: 16,
    color: '#000',
    fontFamily: 'Kanit-Regular',
  },
  fileSize: {
    fontSize: 14,
    color: '#666',
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
    maxWidth: '100%',
  },
  sentImageContainer: {
    // alignSelf: 'flex-end',
    alignSelf: 'center',
    backgroundColor: '#5AB9EA',
    borderRadius: 10,
    overflow: 'hidden',
    marginVertical: 5,
    maxWidth: '75%',
  },
  receivedImageContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#e4e6eb',
    borderRadius: 10,
    overflow: 'hidden',
    marginVertical: 5,
    maxWidth: '100%',
  },
  // ภาพในแชท
  imageStyle: {
    width: '100%',
    height: undefined,
    aspectRatio: 1, // สัดส่วน 1:1
    borderRadius: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    padding: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 8,
    right: 6,
    zIndex: 10,
  },
});
export default ChatScreen;
