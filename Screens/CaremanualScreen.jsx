import {StyleSheet, Text, View, Button,TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';

function CaremanualScreen(props){
    const navigation = useNavigation();
    console.log(props);
    const [userData,setUserData]= useState("");
    const [careManualData, setCareManualData] = useState(null);

    async function getData(){
        const token = await AsyncStorage.getItem('token');
        console.log(token);
        axios.post('http://192.168.2.40:5000/userdata',{token:token})
        .then(res =>{
            console.log(res.data);
            setUserData(res.data.data);
            console.log(userData);
        });
    }

    useEffect(() => {
        getData();
    },[]);

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get('http://192.168.2.40:5000/allcaremanual');
            setCareManualData(response.data.data);
          } catch (error) {
            console.error('Error fetching care manual data:', error);
          }
        };
    
        fetchData();
      }, []);


    return(
        <View>
        {careManualData ? (
          careManualData.map((item, index) => (
            <TouchableOpacity key={index} style={styles.container} 
            onPress={() => navigation.navigate('Caremanualitem', { id: item._id })}
            >
              <Text style={styles.text} onPress={() => navigation.navigate('Caremanualitem', { id: item._id })}>{item.caremanual_name}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.loadingText}>Loading...</Text>
        )}
      </View>
    );
}

const styles = StyleSheet.create({
container: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    margin: 10,
    marginBottom:2,
    // marginVertical:5,
    elevation: 2, 
      alignItems: 'center',
  },
  text: {
    color:'black',
    fontSize: 15,
    fontWeight:'500',
    marginBottom: 10,
  },
});


export default CaremanualScreen;
