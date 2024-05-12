import React, { useEffect, useState } from 'react';
import { View, Text , Image } from 'react-native';
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
        <View style={style.container}>
            <Text>{caremanual_name}</Text>
            {imageUri && <Image source={{ uri: imageUri }} style={{ width: 100, height: 100 }} />} 
            <Text>{file}</Text>
            <Text>{detail}</Text>

        </View>
    );
}
