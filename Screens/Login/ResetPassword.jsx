import React, { useState } from 'react';
import {
    View,
    Text,
    Image,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
  } from 'react-native';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from './style'; // Assuming you have a separate style file

const ResetPasswordScreen = ({ route, navigation }) => {
    const { email } = route.params;
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    const resetPassword = async () => {
        try {
            const response = await axios.post('http://192.168.2.43:5000/reset-password', { email, newPassword, confirmpassword: confirmPassword });
            if (response.data === 'เปลี่ยนรหัสสำเร็จ') {
                navigation.navigate('Login');
            } else {
                setMessage(response.data);
            }
        } catch (error) {
            setMessage(error.response.data);
        }
    };

    const goBack = () => {
        navigation.goBack();
    };

    return (
        <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps={'always'}
        >
            <View style={styles.pageforgot}>
                <TouchableOpacity style={stylei.iconback} onPress={goBack}>
                    <Ionicons name={'arrow-back-outline'} size={22} color={'#000'} />
                </TouchableOpacity>
                <View style={styles.logoContainer}>
                    <Image
                        style={styles.logo}
                        source={require('../../assets/Logoblue.png')}
                    />
                </View>
                <View style={stylei.container}>
                    <Text style={stylei.text_header}>เปลี่ยนรหัสผ่าน</Text>
                    {/* <Text style={stylei.text}>รหัสผ่านใหม่</Text> */}
                    <View style={styles.action}>
                        <TextInput
                            placeholder="รหัสผ่านใหม่"
                            value={newPassword}
                            onChangeText={setNewPassword}
                            secureTextEntry
                            style={styles.textInput}
                        />
                    </View>
                    <View style={styles.action}>
                        <TextInput
                            placeholder="ยืนยันรหัสผ่าน"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry
                            style={styles.textInput}
                        />
                    </View>
                    <View style={styles.button}>
                        <TouchableOpacity style={stylei.inBut} onPress={resetPassword}>
                            <View>
                                <Text style={styles.textSign}>เปลี่ยนรหัสผ่าน</Text>
                            </View>
                        </TouchableOpacity>
                        {message ? <Text style={{ marginTop: 20,color:'red' }}>{message}</Text> : null}
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

export default ResetPasswordScreen;

const stylei = StyleSheet.create({
    iconback: {
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    container: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        marginHorizontal: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.5,
        shadowRadius: 4.65,
        elevation: 3,
        justifyContent: 'center',
        
    },
    inBut: {
        width: '70%',
        backgroundColor: '#87CEFA',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 50,
        marginLeft: 'auto',
        marginRight: 'auto',
        color: '#fff',
        marginTop: 5,
    },
    text_header: {
        fontSize: 20,
        textAlign: 'center',
        fontWeight: '700',
        marginBottom: 10,
    },
    text: {
        textAlign: 'center',
        fontSize: 16,
    },
});
