import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
  ActivityIndicator,
  Animated,
} from 'react-native';
import React, {useRef} from 'react';
import {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Feather';
import Icon1 from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import {useRoute} from '@react-navigation/native';
import {Picker} from '@react-native-picker/picker';
import Toast from 'react-native-toast-message';
function Informationtwo() {
  const navigation = useNavigation();
  const route = useRoute();
  const {formData} = route.params;
  const { acceptPDPA } = formData;  
  console.log("Received acceptPDPA:", acceptPDPA); 
  const [caregivers, setCaregivers] = useState([]);
  const [caregiverInfo, setCaregiverInfo] = useState(null);
  const [userData, setUserData] = useState('');
  const [customRelationship, setCustomRelationship] = useState('');
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const scrollViewRef = useRef(null);

  // const addCaregiver = () => {
  //   if (scrollViewRef.current) {
  //     scrollViewRef.current.scrollToEnd({animated: true}); // เลื่อนไปด้านล่างสุด
  //   }
  //   setCaregivers([
  //     ...caregivers,
  //     {
  //       name: '',
  //       surname: '',
  //       tel: '',
  //       ID_card_number: '',
  //       userRelationships: [
  //         {
  //           user: userData._id || '', // ตรวจสอบว่า userData มีค่า _id หรือยัง
  //           relationship: '',
  //           customRelationship: '',
  //         },
  //       ],
  //     },
  //   ]);
  // };
  const addCaregiver = async () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({animated: true}); // เลื่อนไปด้านล่างสุด
    }

    const newCaregiver = {
      name: '',
      surname: '',
      tel: '',
      ID_card_number: '',
      userRelationships: [
        {
          user: userData._id || '', // ตรวจสอบว่า userData มีค่า _id หรือยัง
          relationship: '',
          customRelationship: '',
        },
      ],
    };

    // เพิ่ม caregiver ใหม่ใน state
    const updatedCaregivers = [...caregivers, newCaregiver];
    setCaregivers(updatedCaregivers);

    // บันทึกข้อมูลลง AsyncStorage
    await AsyncStorage.setItem(
      'caregiversData',
      JSON.stringify(updatedCaregivers),
    );
  };

  useEffect(() => {
    async function getData() {
      const token = await AsyncStorage.getItem('token');
      console.log('Fetched token:', token);
      axios
        .post('http://10.0.2.2:5000/userdata', {token: token})
        .then(res => {
          console.log('User data:', res.data);
          setUserData(res.data.data);
        })
        .catch(err => console.error('Error fetching user data:', err));
    }
    getData();
  }, []);

  useEffect(() => {
    async function fetchCaregiverInfo() {
      try {
        if (userData) {
          const response = await axios.get(
            `http://10.0.2.2:5000/getcaregiver/${userData._id}`,
          );

          if (response.data.data && response.data.data.length > 0) {
            const fetchedCaregivers = response.data.data.map(caregiver => ({
              ...caregiver,
              userRelationships: caregiver.userRelationships.map(rel => {
                const validRelationships = [
                  'พ่อ',
                  'แม่',
                  'ลูก',
                  'สามี',
                  'ภรรยา',
                  'อื่น ๆ',
                ];
                if (!validRelationships.includes(rel.relationship)) {
                  return {
                    ...rel,
                    relationship: 'อื่น ๆ', // ตั้งค่าให้เป็น "อื่น ๆ"
                    customRelationship: rel.relationship, // เก็บค่าเดิมไว้ใน customRelationship
                  };
                }
                return {
                  ...rel,
                  customRelationship: rel.customRelationship || '', // กรณีที่ไม่มีค่า customRelationship
                };
              }),
              source: 'getCaregiver',
            }));
            // โหลดข้อมูลจาก AsyncStorage
            const storedData = await AsyncStorage.getItem('caregiversData');
            let caregiversFromStorage = [];
            if (storedData) {
              caregiversFromStorage = JSON.parse(storedData);
            }

            // กรองข้อมูลที่ดึงจากฐานข้อมูล เพื่อไม่ให้ซ้ำกับข้อมูลที่เก็บใน AsyncStorage
            const uniqueFetchedCaregivers = fetchedCaregivers.filter(
              caregiver =>
                !caregiversFromStorage.some(
                  existingCaregiver => existingCaregiver._id === caregiver._id,
                ),
            );

            // รวมข้อมูลจากฐานข้อมูลและ AsyncStorage
            const allCaregivers = [
              ...caregiversFromStorage,
              ...uniqueFetchedCaregivers,
            ];
            setCaregivers(allCaregivers);

            // setCaregivers(fetchedCaregivers);
            setLoading(false);
            setErrors('');
          } else {
            console.log('No caregiver data found');
          }
        }
      } catch (error) {
        console.error('Error fetching caregiver info:', error);
      }
    }

    fetchCaregiverInfo();
  }, [userData]);

  //ลบจากจอเฉยๆ
  // const removeCaregiver = index => {
  //   const updatedCaregivers = [...caregivers];
  //   updatedCaregivers[index].isDeleted = true;
  //   setCaregivers(updatedCaregivers);
  //   saveDataToStorage();
  // };

  //กรณีที่ดึงจากฐานข้อมูลจะลบเลย
  const removeCaregiver = async index => {
    const caregiver = caregivers[index];

    Alert.alert(
      'ยืนยันการลบ',
      `คุณต้องการลบผู้ดูแล ${caregiver.name || 'นี้'} ใช่หรือไม่?`,
      [
        {
          text: 'ยกเลิก',
          style: 'cancel',
        },
        {
          text: 'ยืนยัน',
          onPress: async () => {
            try {
              if (caregiver._id) {
                // กรณีข้อมูลมาจากฐานข้อมูล
                // เรียก API เพื่อลบผู้ดูแล
                await axios.post('http://10.0.2.2:5000/deletecaregiver', {
                  _id: caregiver._id,
                  userId: userData._id,
                });

                Toast.show({
                  type: 'success',
                  text1: 'สำเร็จ',
                  text2: 'ลบข้อมูลผู้ดูแลเรียบร้อยแล้ว',
                });
              }

              // ลบผู้ดูแลออกจาก state (ไม่ว่าจะมาจากฐานข้อมูลหรือไม่ก็ตาม)
              const updatedCaregivers = caregivers.filter(
                (_, i) => i !== index,
              );
              setCaregivers(updatedCaregivers);
              await AsyncStorage.removeItem('caregiversData');
              setErrors('');
            } catch (error) {
              console.error('Error deleting caregiver:', error);
              Toast.show({
                type: 'error',
                text1: 'ล้มเหลว',
                text2: 'ไม่สามารถลบข้อมูลผู้ดูแลได้',
              });
            }
          },
        },
      ],
    );
  };

  const validateCaregivers = () => {
    let isValid = true;
    const newErrors = {};

    caregivers.forEach((caregiver, index) => {
      const {name, surname, tel, ID_card_number, userRelationships} = caregiver;
      const relationship = userRelationships[0]?.relationship;
      const customRelationship = userRelationships[0]?.customRelationship;

      if (!name) {
        isValid = false;
        newErrors[index] = {...(newErrors[index] || {}), name: 'กรุณากรอกชื่อ'};
      } else if (!/^[ก-๏a-zA-Z\s]+$/.test(name)) {
        isValid = false;
        newErrors[index] = {
          ...(newErrors[index] || {}),
          name: 'ชื่อต้องเป็นตัวอักษรเท่านั้น',
        };
      }

      // ตรวจสอบว่านามสกุลเป็นตัวอักษรเท่านั้น
      if (!surname) {
        isValid = false;
        newErrors[index] = {
          ...(newErrors[index] || {}),
          surname: 'กรุณากรอกนามสกุล',
        };
      } else if (!/^[ก-๏a-zA-Z\s]+$/.test(surname)) {
        isValid = false;
        newErrors[index] = {
          ...(newErrors[index] || {}),
          surname: 'นามสกุลต้องเป็นตัวอักษรเท่านั้น',
        };
      }

      if (!tel || !/^[0-9]{10}$/.test(tel)) {
        isValid = false;
        newErrors[index] = {
          ...(newErrors[index] || {}),
          tel: 'กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง (10 หลัก)',
        };
      }

      if (!ID_card_number || !/^[0-9]{13}$/.test(ID_card_number)) {
        isValid = false;
        newErrors[index] = {
          ...(newErrors[index] || {}),
          ID_card_number: 'กรุณากรอกเลขประจำตัวประชาชน 13 หลัก',
        };
      }

      if (!relationship) {
        isValid = false;
        newErrors[index] = {
          ...(newErrors[index] || {}),
          relationship: 'กรุณาเลือกความสัมพันธ์',
        };
      }

      if (relationship === 'อื่น ๆ') {
        if (!customRelationship) {
          isValid = false;
          newErrors[index] = {
            ...(newErrors[index] || {}),
            customRelationship: 'กรุณาระบุความสัมพันธ์',
          };
        } else if (!/^[ก-๙a-zA-Z\s]+$/.test(customRelationship)) {
          isValid = false;
          newErrors[index] = {
            ...(newErrors[index] || {}),
            customRelationship: 'ความสัมพันธ์ต้องเป็นตัวอักษรเท่านั้น',
          };
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const saveInformation = async () => {
    try {
      if (!validateCaregivers()) {
        Toast.show({
          type: 'error',
          text1: 'กรุณากรอกข้อมูลให้ครบทุกช่อง',
          text2: 'โปรดตรวจสอบว่าคุณกรอกทุกช่องก่อนดำเนินการต่อ',
        });
        return;
      }
      // const caregiversToDelete = caregivers.filter(
      //   caregiver => caregiver.isDeleted,
      // );

      // for (const caregiver of caregiversToDelete) {
      //   await axios.post('http://10.0.2.2:5000/deletecaregiver', {
      //     _id: caregiver._id, // ID ของผู้ดูแลที่ต้องการลบ
      //     userId: userData._id, // ID ของผู้ใช้
      //   });
      // }

      const updatedCaregivers = caregivers.map(caregiver => {
        const {relationship, customRelationship} =
          caregiver.userRelationships[0];

        // ตรวจสอบและอัปเดตความสัมพันธ์
        if (relationship === 'อื่น ๆ' && customRelationship) {
          caregiver.userRelationships[0].relationship = customRelationship;
        }

        return caregiver;
      });

      console.log(
        'Updated caregivers (detailed):',
        JSON.stringify(updatedCaregivers, null, 2),
      );
      const payload = {
        ...formData, // รวมข้อมูลผู้ใช้
        caregivers: updatedCaregivers,
      };

      const response = await axios.post(
        'http://10.0.2.2:5000/updateuserinfo',
        payload,
      );
      console.log('Response จากเซิร์ฟเวอร์:', response.data);
      if (response.data.status === 'Ok') {
        // Toast.show({
        //   type: 'success',
        //   text1: 'สำเร็จ',
        //   text2: 'อัปเดตข้อมูลเรียบร้อยแล้ว',
        // });
        await AsyncStorage.removeItem('caregiversData');
        navigation.navigate('Success');
        // navigation.goBack();
      } else {
        Toast.show({
          type: 'error',
          text1: 'ล้มเหลว',
          text2: response.data.error || 'ไม่สามารถอัปเดตข้อมูลได้',
        });
      }
    } catch (error) {
      console.error('Error updating user info:', error);
      Toast.show({
        type: 'error',
        text1: 'ล้มเหลว',
        text2: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล',
      });
    }
  };
  useEffect(() => {
    async function loadCaregiversData() {
      try {
        const storedData = await AsyncStorage.getItem('caregiversData');
        if (storedData) {
          setCaregivers(JSON.parse(storedData));
          console.log('Caregivers data loaded successfully!');
        }
      } catch (error) {
        console.error('Error loading caregivers data:', error);
      }
    }
    loadCaregiversData();
  }, []);

  const saveDataToStorage = async () => {
    try {
      // กรองผู้ดูแลที่ถูกทำเครื่องหมายว่าเป็นลบ
      const caregiversToSave = caregivers.filter(
        caregiver => !caregiver.isDeleted,
      );

      // บันทึกเฉพาะผู้ดูแลที่ไม่ได้ทำเครื่องหมายว่าเป็นลบ
      await AsyncStorage.setItem(
        'caregiversData',
        JSON.stringify(caregiversToSave),
      );
      console.log('Caregivers data saved successfully!');
    } catch (error) {
      console.error('Error saving caregivers data:', error);
    }
  };

  const goBack = async () => {
    await saveDataToStorage();
    navigation.goBack();
  };

  const handleValidation = (field, text, index) => {
    const updatedCaregivers = [...caregivers];

    if (field === 'customRelationship') {
      updatedCaregivers[index].userRelationships[0].customRelationship = text;
    } else {
      updatedCaregivers[index][field] = text;
    }

    // ตรวจสอบความถูกต้อง
    const nameRegex = /^[ก-๏a-zA-Z\s]+$/; // อนุญาตเฉพาะตัวอักษร
    let errorMessage = '';

    if (text.trim() === '') {
      // ฟิลด์ว่าง: ไม่แสดงข้อผิดพลาดตอนกรอก
      setErrors(prevErrors => {
        const newErrors = {...prevErrors};
        if (newErrors[index]) {
          delete newErrors[index][field];
          if (Object.keys(newErrors[index]).length === 0) {
            delete newErrors[index];
          }
        }
        return newErrors;
      });
    } else if (!nameRegex.test(text)) {
      // รูปแบบไม่ถูกต้อง -> แสดง Error เฉพาะของแต่ละฟิลด์
      if (field === 'name') {
        errorMessage = 'ชื่อจะต้องเป็นตัวอักษรเท่านั้น';
      } else if (field === 'surname') {
        errorMessage = 'นามสกุลจะต้องเป็นตัวอักษรเท่านั้น';
      } else if (field === 'customRelationship') {
        errorMessage = 'ความสัมพันธ์ต้องเป็นตัวอักษรเท่านั้น';
      }

      setErrors(prevErrors => ({
        ...prevErrors,
        [index]: {...prevErrors[index], [field]: errorMessage},
      }));
    } else {
      // ถ้าถูกต้อง ลบ Error
      setErrors(prevErrors => {
        const newErrors = {...prevErrors};
        if (newErrors[index]) {
          delete newErrors[index][field];
          if (Object.keys(newErrors[index]).length === 0) {
            delete newErrors[index];
          }
        }
        return newErrors;
      });
    }

    setCaregivers(updatedCaregivers);
  };

  return (
    <View style={{flex: 1}}>
      <ScrollView
        ref={scrollViewRef}
        keyboardShouldPersistTaps={'always'}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 40}}
        style={{backgroundColor: '#F5F5F5'}}>
        <View>
          <View style={[style.headcontainer]}>
            <Text style={style.texthead}>ข้อมูลผู้ดูแล</Text>
          </View>
          <View style={[style.container]}>
            {/* <Text style={style.texthead}>ข้อมูลผู้ดูแล</Text> */}
            {caregivers?.length > 0 ? (
              caregivers
                .filter(caregiver => !caregiver.isDeleted)
                .map((caregiver, index) => (
                  <View key={index} style={style.incontainer}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 15,
                        paddingBottom: 5,
                        borderBottomWidth: 1,
                        borderBottomColor: '#E0E0E0',
                      }}>
                      <Text style={style.textheadin}>
                        ข้อมูลผู้ดูแล {index + 1}{' '}
                      </Text>
                      {/* {index !== 0 || caregivers.length > 1 || caregiver._id ? ( */}
                      <TouchableOpacity onPress={() => removeCaregiver(index)}>
                        <Icon
                          onPress={() => removeCaregiver(index)}
                          name="trash-2"
                          color="red"
                          style={style.IconUserSC}
                        />
                      </TouchableOpacity>
                      {/* ) : null} */}
                    </View>
                    <View style={style.inputContainer}>
                      <Text style={style.textlabel}>เลขบัตรประชาชน:</Text>

                      <TextInput
                        style={[
                          style.textInputRead,
                          caregiver.source === 'getCaregiver'
                            ? {
                                borderWidth: 1,
                                borderColor: '#DCDCDC',
                                backgroundColor: '#eeeeee',
                                borderRadius: 10,
                                paddingHorizontal: 8,
                                marginTop: 1,
                                height: 45,
                                // marginVertical:10,
                                lineHeight: 24,
                                flex: 1,
                                color: 'black',
                              } // สีเทาถ้าห้ามแก้ไข
                            : {color: 'black'}, // สีดำถ้าแก้ไขได้
                          errors[index]?.ID_card_number
                            ? {borderColor: 'red', borderWidth: 1}
                            : {},
                        ]}
                        editable={caregiver.source !== 'getCaregiver'}
                        value={caregiver.ID_card_number}
                        keyboardType="numeric"
                        maxLength={13}
                        onChangeText={async text => {
                          if (caregiver.source !== 'getCaregiver') {
                            const updatedCaregivers = [...caregivers];
                            const trimmedText = text.trim();
                            updatedCaregivers[index].ID_card_number =
                              trimmedText;
                            setCaregivers(updatedCaregivers);

                            // ตรวจสอบความถูกต้อง
                            if (trimmedText === '') {
                              // ถ้าค่าว่าง ไม่แสดง Error
                              setErrors(prevErrors => {
                                const newErrors = {...prevErrors};
                                if (newErrors[index]) {
                                  delete newErrors[index].ID_card_number;
                                  if (
                                    Object.keys(newErrors[index]).length === 0
                                  ) {
                                    delete newErrors[index];
                                  }
                                }
                                return newErrors;
                              });
                            } else if (!/^[0-9]{13}$/.test(trimmedText)) {
                              // ถ้าไม่ใช่ตัวเลข 13 หลัก แสดง Error
                              setErrors(prevErrors => ({
                                ...prevErrors,
                                [index]: {
                                  ...prevErrors[index],
                                  ID_card_number:
                                    'กรุณากรอกเลขประจำตัวประชาชน 13 หลัก',
                                },
                              }));
                            } else {
                              // ถ้าถูกต้อง ลบ Error
                              setErrors(prevErrors => {
                                const newErrors = {...prevErrors};
                                if (newErrors[index]) {
                                  delete newErrors[index].ID_card_number;
                                  if (
                                    Object.keys(newErrors[index]).length === 0
                                  ) {
                                    delete newErrors[index];
                                  }
                                }
                                return newErrors;
                              });
                            }

                            if (trimmedText.length < 13) {
                              updatedCaregivers[index] = {
                                ...updatedCaregivers[index],
                                name: '',
                                surname: '',
                                tel: '',
                                relationship: '',
                                source: '',
                              };
                              setCaregivers([...updatedCaregivers]);
                              return; // ไม่ต้องดำเนินการต่อ
                            }

                            if (trimmedText.length === 13) {
                              // ตรวจสอบเลขบัตรซ้ำ
                              const isDuplicate = caregivers.some(
                                (item, i) =>
                                  i !== index &&
                                  item.ID_card_number === trimmedText,
                              );

                              if (isDuplicate) {
                                Toast.show({
                                  type: 'error',
                                  text1: 'ข้อผิดพลาด',
                                  text2:
                                    'เลขประจำตัวประชาชนนี้มีอยู่ในระบบแล้ว',
                                });
                                return;
                              }

                              try {
                                const response = await axios.get(
                                  `http://10.0.2.2:5000/getCaregiverById/${text}`,
                                );
                                console.log('Response data:', response.data);
                                if (
                                  response.data.status === 'Ok' &&
                                  response.data.caregiver
                                ) {
                                  const {name, surname, tel} =
                                    response.data.caregiver;

                                  updatedCaregivers[index] = {
                                    ...updatedCaregivers[index],
                                    name: name || '',
                                    surname: surname || '',
                                    tel: tel || '',
                                    source: 'getCaregiverById',
                                  };
                                  setCaregivers([...updatedCaregivers]);
                                }
                              } catch (error) {
                                console.error(
                                  'Error fetching caregiver data:',
                                  error,
                                );
                              }
                            }
                          }
                        }}
                      />
                    </View>
                    {errors[index]?.ID_card_number && (
                      <Text style={stylep.errortext}>
                        {errors[index].ID_card_number}
                      </Text>
                    )}
                    <View style={style.inputContainer}>
                      <Text style={style.textlabel}>ชื่อ:</Text>
                      <TextInput
                        style={[
                          style.textInputRead,
                          style.text,
                          caregiver.source === 'getCaregiver' ||
                          caregiver.source === 'getCaregiverById'
                            ? {
                                borderWidth: 1,
                                borderColor: '#DCDCDC',
                                backgroundColor: '#eeeeee',
                                borderRadius: 10,
                                paddingHorizontal: 8,
                                marginTop: 1,
                                height: 45,
                                // marginVertical:10,
                                lineHeight: 24,
                                flex: 1,
                              }
                            : {color: 'black'},
                          errors[index]?.name
                            ? {borderColor: 'red', borderWidth: 1}
                            : {},
                        ]}
                        editable={
                          caregiver.source !== 'getCaregiver' &&
                          caregiver.source !== 'getCaregiverById'
                        }
                        value={caregiver.name}
                        onChangeText={text =>
                          handleValidation('name', text, index)
                        }
                      />
                    </View>
                    {/* {errors[index]?.name && (
                  <Text style={stylep.errortext}>
                    ชื่อจะต้องเป็นตัวอักษรเท่านั้น
                  </Text>
                )} */}
                    {errors[index]?.name && (
                      <Text style={stylep.errortext}>{errors[index].name}</Text>
                    )}

                    <View style={style.inputContainer}>
                      <Text style={style.textlabel}>นามสกุล:</Text>
                      <TextInput
                        style={[
                          style.textInputRead,
                          style.text,
                          caregiver.source === 'getCaregiver' ||
                          caregiver.source === 'getCaregiverById'
                            ? {
                                borderWidth: 1,
                                borderColor: '#DCDCDC',
                                backgroundColor: '#eeeeee',
                                borderRadius: 10,
                                paddingHorizontal: 8,
                                marginTop: 1,
                                height: 45,
                                // marginVertical:10,
                                lineHeight: 24,
                                flex: 1,
                                color: 'black',
                              }
                            : {color: 'black'},
                          errors[index]?.surname
                            ? {borderColor: 'red', borderWidth: 1}
                            : {},
                        ]}
                        editable={
                          caregiver.source !== 'getCaregiver' &&
                          caregiver.source !== 'getCaregiverById'
                        }
                        value={caregiver.surname}
                        onChangeText={text =>
                          handleValidation('surname', text, index)
                        }
                      />
                    </View>
                    {/* {errors[index]?.surname && (
                  <Text style={stylep.errortext}>
                    นามสกุลจะต้องเป็นตัวอักษรเท่านั้น
                  </Text>
                )} */}
                    {errors[index]?.surname && (
                      <Text style={stylep.errortext}>
                        {errors[index].surname}
                      </Text>
                    )}

                    <View style={style.inputContainer}>
                      <Text style={style.textlabel}>เกี่ยวข้องเป็น:</Text>
                      <View
                        style={[
                          style.pickerContainer,
                          caregiver.source === 'getCaregiver'
                            ? {
                                borderWidth: 1,
                                borderColor: '#DCDCDC',
                                backgroundColor: '#eeeeee', // สีเทาถ้าดึงข้อมูลจาก getCaregiver
                                borderRadius: 10,
                                marginTop: 1,
                                height: 45,
                                flex: 1,
                                justifyContent: 'center',
                              }
                            : {
                                borderWidth: 1,
                                borderColor: '#DCDCDC',
                                backgroundColor: '#fff', // สีขาวถ้าไม่ใช่ getCaregiver
                                borderRadius: 10,
                                marginTop: 1,
                                height: 45,
                                flex: 1,
                                justifyContent: 'center',
                              },
                          errors[index]?.relationship
                            ? {borderColor: 'red', borderWidth: 1}
                            : {},
                        ]}>
                        <Picker
                          style={[
                            style.Picker,
                            style.text,
                            // caregiver.source !==  'getCaregiver'
                            //   ? {color: '#e0e0e0'}
                            //   : {color: 'black'},
                          ]}
                          selectedValue={
                            caregiver.userRelationships[0]?.relationship || ''
                          }
                          enabled={caregiver.source !== 'getCaregiver'}
                          // editable={
                          //   caregiver.source !== 'getCaregiver'
                          //   caregiver.source !== 'getCaregiverById'
                          // }
                          // enabled={caregiver.source === 'getCaregiverById'}
                          onValueChange={value => {
                            const updatedCaregivers = [...caregivers];

                            // อัปเดตความสัมพันธ์ใน userRelationships
                            if (
                              updatedCaregivers[index].userRelationships
                                .length > 0
                            ) {
                              updatedCaregivers[
                                index
                              ].userRelationships[0].relationship = value;

                              // ล้าง customRelationship หากเปลี่ยนจาก "อื่น ๆ" ไปเป็นค่าอื่น
                              if (value !== 'อื่น ๆ') {
                                updatedCaregivers[
                                  index
                                ].userRelationships[0].customRelationship = '';
                              }
                            } else {
                              updatedCaregivers[index].userRelationships = [
                                {
                                  user: userData._id,
                                  relationship: value,
                                  customRelationship: '',
                                },
                              ];
                            }

                            setCaregivers(updatedCaregivers);

                            const updatedErrors = {...errors};
                            if (updatedErrors[index]) {
                              delete updatedErrors[index].relationship;
                              delete updatedErrors[index].customRelationship;
                            }
                            setErrors(updatedErrors);
                          }}>
                          <Picker.Item
                            label="เลือกความสัมพันธ์"
                            value=""
                            style={style.pickerItemStyle}
                          />
                          <Picker.Item
                            label="พ่อ"
                            value="พ่อ"
                            style={style.pickerItemStyle}
                          />
                          <Picker.Item
                            label="แม่"
                            value="แม่"
                            style={style.pickerItemStyle}
                          />
                          <Picker.Item
                            label="ลูก"
                            value="ลูก"
                            style={style.pickerItemStyle}
                          />
                          <Picker.Item
                            label="สามี"
                            value="สามี"
                            style={style.pickerItemStyle}
                          />
                          <Picker.Item
                            label="ภรรยา"
                            value="ภรรยา"
                            style={style.pickerItemStyle}
                          />
                          <Picker.Item
                            label="อื่น ๆ"
                            value="อื่น ๆ"
                            style={style.pickerItemStyle}
                          />
                        </Picker>
                      </View>
                    </View>
                    {errors[index]?.relationship && (
                      <Text style={stylep.errortext}>
                        {errors[index].relationship}
                      </Text>
                    )}

                    {caregiver.userRelationships[0]?.relationship ===
                      'อื่น ๆ' && (
                      <View style={style.inputContainer}>
                        <Text style={style.textlabel}>กรุณาระบุ:</Text>
                        <TextInput
                          style={[
                            style.textInputRead,
                            style.text,
                            caregiver.source === 'getCaregiver'
                              ? {
                                  borderWidth: 1,
                                  borderColor: '#DCDCDC',
                                  backgroundColor: '#eeeeee',
                                  borderRadius: 10,
                                  paddingHorizontal: 8,
                                  marginTop: 1,
                                  height: 45,
                                  // marginVertical:10,
                                  lineHeight: 24,
                                  flex: 1,
                                  color: 'black',
                                }
                              : {color: 'black'},
                            errors[index]?.customRelationship
                              ? {borderColor: 'red', borderWidth: 1}
                              : {},
                          ]}
                          placeholder="ระบุความสัมพันธ์"
                          value={
                            caregiver.userRelationships[0]
                              ?.customRelationship || ''
                          }
                          editable={
                            caregiver.source !== 'getCaregiver'
                            // ||caregiver.source !== 'getCaregiverById'
                          }
                          onChangeText={text =>
                            handleValidation('customRelationship', text, index)
                          }
                        />
                      </View>
                    )}
                    {errors[index]?.customRelationship && (
                      <Text style={stylep.errortext}>
                        {errors[index].customRelationship}
                      </Text>
                    )}
                    <View style={style.inputContainer}>
                      <Text style={style.textlabel}>เบอร์โทรศัพท์:</Text>
                      <TextInput
                        keyboardType="numeric"
                        maxLength={10}
                        style={[
                          style.textInputRead,
                          style.text,
                          caregiver.source === 'getCaregiver' ||
                          caregiver.source === 'getCaregiverById'
                            ? {
                                borderWidth: 1,
                                borderColor: '#DCDCDC',
                                backgroundColor: '#eeeeee',
                                borderRadius: 10,
                                paddingHorizontal: 8,
                                marginTop: 1,
                                height: 45,
                                // marginVertical:10,
                                lineHeight: 24,
                                flex: 1,
                                color: 'black',
                              }
                            : {color: 'black'},
                          errors[index]?.tel
                            ? {borderColor: 'red', borderWidth: 1}
                            : {},
                        ]}
                        editable={
                          caregiver.source !== 'getCaregiver' &&
                          caregiver.source !== 'getCaregiverById'
                        }
                        value={caregiver.tel}
                        onChangeText={text => {
                          const updatedCaregivers = [...caregivers];
                          updatedCaregivers[index].tel = text;
                          // ตรวจสอบความถูกต้อง
                          if (text === '') {
                            // ถ้าช่องว่าง ลบข้อผิดพลาด
                            setErrors(prevErrors => {
                              const newErrors = {...prevErrors};
                              if (newErrors[index]) {
                                delete newErrors[index].tel;
                                if (
                                  Object.keys(newErrors[index]).length === 0
                                ) {
                                  delete newErrors[index];
                                }
                              }
                              return newErrors;
                            });
                          } else {
                            const telRegex = /^[0-9]{10}$/; // เบอร์โทรศัพท์ไทย 10 หลัก
                            if (!telRegex.test(text)) {
                              setErrors(prevErrors => ({
                                ...prevErrors,
                                [index]: {...prevErrors[index], tel: true},
                              }));
                            } else {
                              setErrors(prevErrors => {
                                const newErrors = {...prevErrors};
                                if (newErrors[index]) {
                                  delete newErrors[index].tel;
                                  if (
                                    Object.keys(newErrors[index]).length === 0
                                  ) {
                                    delete newErrors[index];
                                  }
                                }
                                return newErrors;
                              });
                            }
                          }
                          setCaregivers(updatedCaregivers);
                        }}
                      />
                    </View>

                    {errors[index]?.tel && (
                      <Text style={stylep.errortext}>
                        กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง (10 หลัก)
                      </Text>
                    )}
                  </View>
                ))
            ) : (
              <View style={stylep.centerContainer}>
                <Text style={stylep.nodata}>ไม่มีข้อมูลผู้ดูแล</Text>
              </View>
            )}

            {/* <TouchableOpacity onPress={addCaregiver} style={stylep.textadd}>
              <Text style={stylep.buttonText}>เพิ่มผู้ดูแล</Text>
            </TouchableOpacity> */}
          </View>
        </View>

        {/* <View style={stylep.buttonContainer}>
     
        </View> */}
      </ScrollView>
      <TouchableOpacity onPress={addCaregiver} style={stylep.addButton}>
        <Ionicons name="add" color="white" style={style.IconAdd} />
        {/* <Text style={stylep.plusIcon}>+</Text> */}
      </TouchableOpacity>

      <View style={stylep.buttonoutnext}>
        <TouchableOpacity onPress={goBack} style={stylep.textCC}>
          <Text style={stylep.cancelButtonText}>ย้อนกลับ</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={saveInformation} style={stylep.textOk}>
          <Text style={stylep.buttonText}>บันทึก</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default Informationtwo;

const stylep = StyleSheet.create({
  errortext: {
    color: 'red',
    fontSize: 14,
    fontFamily: 'Kanit-Regular',
    marginBottom: 2,
  },
  centerContainer: {
    flex: 1,
    marginTop: 10,
    justifyContent: 'center', // จัดตรงกลางแนวตั้ง
    alignItems: 'center', // จัดตรงกลางแนวนอน
  },
  nodata: {
    fontSize: 18,
    // fontWeight: 'bold',
    color: 'gray',
    fontFamily: 'Kanit-Regular',
  },
  addButton: {
    position: 'absolute',
    bottom: 85,
    right: 20,
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: '#42bd41',
    justifyContent: 'center',
    alignItems: 'center',
  },

  text: {
    color: 'black',
    fontFamily: 'Kanit-Regular',
    fontSize: 16,
    padding: 5,
    paddingLeft: 8,
  },
  texttitle: {
    flex: 1,
    marginRight: 3,
  },
  select: {
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    fontFamily: 'Kanit-Regular',
    paddingRight: 30,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    marginTop: 10,
  },
  textadd: {
    backgroundColor: '#42bd41',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 3,
  },
  buttonoutnext: {
    width: '100%',
    backgroundColor: '#fafafa',
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
  },
  textOk: {
    backgroundColor: '#5AB9EA',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 3,
    marginLeft: 10,
  },
  textCC: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#5AB9EA',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1, // ทำให้ปุ่มกว้างเท่ากัน
    paddingVertical: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 3,
    marginRight: 10,
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'Kanit-Medium',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#5AB9EA',
    fontFamily: 'Kanit-Medium',
  },
});

const style = StyleSheet.create({
  inputContainer: {
    marginBottom: 8,
  },
  pickerItemStyle: {
    fontSize: 16,
    color: '#000',
    fontFamily: 'Kanit-Regular',
    paddingVertical: 8,
    alignItems: 'center',
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
  // headcontainer:{
  //   padding: 10,
  //   marginVertical: 10,
  //   backgroundColor: '#5AB9EA',
  //   borderRadius: 15,
  //   borderWidth: 1,
  //   borderColor: '#ddd',
  //   marginHorizontal: 10,
  //   marginBottom: 2,
  //   // padding: 10,
  //   // margin: 12,
  //   backgroundColor: '#fff',
  // },
  headcontainer: {
    padding: 5,
    marginVertical: 10,
    backgroundColor: 'white',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#5AB9EA',
    backgroundColor: '#5AB9EA',
    marginHorizontal: 10,
    marginBottom: 2,
    // borderLeftWidth: 5,
    // borderLeftColor: '#5AB9EA',
    // padding: 10,
    // margin: 12,
  },
  container: {
    // padding: 15,
    // marginVertical: 10,
    // marginHorizontal: 15,
    // backgroundColor: 'white',
    // borderRadius: 15,
    // borderWidth: 1,
    // borderColor: '#ddd',
    // marginHorizontal: 10,
    marginBottom: 40,
    // padding: 10,
    // margin: 12,
    // backgroundColor: '#fff',
    // borderRadius: 15,
  },
  incontainer: {
    padding: 15,
    marginVertical: 10,
    marginHorizontal: 15,
    backgroundColor: 'white',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    marginHorizontal: 10,
    marginBottom: 4,
    // padding: 10,
    // margin: 12,
    backgroundColor: '#fff',
    // borderRadius: 15,
  },
  text: {
    color: 'black',
    fontFamily: 'Kanit-Regular',
    fontSize: 16,
    padding: 10,
  },
  inBut: {
    width: '70%',
    backgroundColor: '#5AB9EA',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 1,
    borderRadius: 50,
    marginLeft: 'auto',
    marginRight: 'auto',
    color: '#fff',
    marginTop: 10,
  },
  textinBut: {
    color: '#fff',
    fontFamily: 'Kanit-Regular',
    fontSize: 16,
    padding: 10,
  },
  textInputContainer: {
    borderWidth: 1,
    borderColor: '#DCDCDC',
    borderRadius: 10,
    paddingHorizontal: 8,
    marginTop: 1,
  },
  textInputRead: {
    // borderWidth: 1,
    // borderColor: '#DCDCDC',
    // borderRadius: 10,
    // paddingHorizontal: 8,
    // marginTop: 1,
    // height: 45,
    // marginVertical: 4,
    // flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    fontSize: 16,
    color: '#1E293B',
    height: 45,
  },
  textInputAddress: {
    borderWidth: 1,
    borderColor: '#DCDCDC',
    borderRadius: 10,
    paddingHorizontal: 8,
    marginTop: 1,
    height: 80,
    marginVertical: 4,
    flex: 1,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 10,
    // paddingHorizontal: 8,
    marginTop: 1,
    height: 50,
    marginVertical: 4,
    flex: 1,
  },
  Picker: {
    padding: 20,
    borderRadius: 20,
  },
  texthead: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 20,
    padding: 1,
    fontFamily: 'Kanit-SemiBold',
    // fontWeight: '700',
  },
  textheadin: {
    // padding: 7,
    fontSize: 18,
    color: '#000',
    fontFamily: 'Kanit-SemiBold',
  },
  textWidth: {
    flex: 1,
  },
  textlabel: {
    color: '#000',
    fontSize: 16,
    fontFamily: 'Kanit-Medium',
    // color: '#5AB9EA',
    marginBottom: 4,
    // padding: 7,
    // fontFamily: 'Kanit-Regular',
    // fontWeight: '600',
  },
  IconUserSC: {
    fontSize: 18,
  },
  IconAdd: {
    fontSize: 24,
    fontWeight: '700',
  },
});
