import React, { useEffect, useState } from 'react';
import { View, Text , Image, StyleSheet,ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import style from './style';

export default function Caremanualitem({ route }) {
    const [caremanual_name, setCaremanualName] = useState("");
    const [image, setImage] = useState(null);
    const [file, setFile] = useState(null);
    const [detail, setDetail] = useState("");
    const { id } = route.params;
    const [imageUri, setImageUri] = useState(null); // เพิ่ม state เพื่อเก็บ URI ของรูปภาพ

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                const response = await axios.get(`http://192.168.2.43:5000/getcaremanual/${id}`, { headers: { Authorization: `Bearer ${token}` } });
                const data = response.data;
                setCaremanualName(data.caremanual_name);
                setImageUri(data.image); // กำหนด URI ของรูปภาพ
                setDetail(data.detail);
                setFile(data.file);
            } catch (error) {
                console.error('Error fetching care manual item data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <ScrollView
      keyboardShouldPersistTaps={'always'}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{paddingBottom: 40}}>
        <View style={styles.containerCare}>
            <Text style={styles.heardCare}>{caremanual_name}</Text>
            {imageUri && <Image source={{ uri: imageUri }} style={{ width: 100, height: 100 }} />} 
            <Text>{file}</Text>
            <Text>{detail}</Text>

        </View>
        </ScrollView>
    );
   
}

const styles = StyleSheet.create({
    heardCare:{
        color: 'black',
        fontFamily: 'Arial',
        fontSize: 18,
        textAlign:'center',
        fontWeight: 'normal',
        padding: 10,
    },
    containerCare: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        margin: 15,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.5,
        shadowRadius: 4.65,
        elevation: 3,
      },
});
