import { StyleSheet, Text, View, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import style from './style';

function CaremanualScreen(props) {
    const navigation = useNavigation();
    const [userData, setUserData] = useState("");
    const [careManualData, setCareManualData] = useState(null);
    const [loading, setLoading] = useState(true);

    async function getData() {
        const token = await AsyncStorage.getItem('token');
        axios.post('http://192.168.2.57:5000/userdata', { token: token })
            .then(res => {
                setUserData(res.data.data);
            });
    }

    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://192.168.2.57:5000/allcaremanual');
                setCareManualData(response.data.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching care manual data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <ScrollView
            keyboardShouldPersistTaps={'always'}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContainer}
            style={styles.mainContainer}
        >
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#00BFFF" />
                    <Text style={styles.loadingText}>กำลังโหลด...</Text>
                </View>
            ) : (
                <View style={styles.contentContainer}>
                    {careManualData && careManualData.map((item, index) => (
                        <TouchableOpacity key={index} style={styles.card} onPress={() => navigation.navigate('Caremanualitem', { id: item._id })}>
                            <Icon name="book" size={24} color="#00BFFF" style={styles.icon} />
                            <Text
                                style={styles.cardText}
                                numberOfLines={1} //จะตัดถ้าข้อความยาว
                                ellipsizeMode='tail' // ตัดข้อความปลาย แสดง ...
                            >
                                {item.caremanual_name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: '#f5f5f5',
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
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
    },
    contentContainer: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 20,
        marginVertical: 10,
        marginHorizontal: 20,
        width: '90%',
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    icon: {
        marginRight: 10,
    },
    cardText: {
        color: '#333',
        fontSize: 16,
        fontWeight: '600',
        flexShrink: 1,
    },
});

export default CaremanualScreen;
