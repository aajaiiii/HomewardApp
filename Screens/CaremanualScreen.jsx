import {StyleSheet, Text, View, Button,TouchableOpacity,ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import style from './style';
function CaremanualScreen(props){
    const navigation = useNavigation();
    console.log(props);
    const [userData,setUserData]= useState("");
    const [careManualData, setCareManualData] = useState(null);

    async function getData(){
        const token = await AsyncStorage.getItem('token');
        console.log(token);
        axios.post('http://192.168.2.38:5000/userdata',{token:token})
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
            const response = await axios.get('http://192.168.2.38:5000/allcaremanual');
            setCareManualData(response.data.data);
          } catch (error) {
            console.error('Error fetching care manual data:', error);
          }
        };
    
        fetchData();
      }, []);


    return(
      <ScrollView
      keyboardShouldPersistTaps={'always'}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{paddingBottom: 40}}
      style={{ backgroundColor: '#f8f9fa'}}>
        <View >
        {careManualData ? (
          careManualData.map((item, index) => (
            <TouchableOpacity key={index} style={styles.container} 
            onPress={() => navigation.navigate('Caremanualitem', { id: item._id })}
            >
              <Text style={style.text} onPress={() => navigation.navigate('Caremanualitem', { itemName: item.caremanual_name, id: item._id })}>{item.caremanual_name}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.loadingText}>Loading...</Text>
        )}
      </View>
      </ScrollView>
    );
}

const styles = StyleSheet.create({
container: {
    backgroundColor: '#fff',
    elevation: 2, 
    alignItems: 'center',
    borderRadius: 10,
    padding: 20,
    margin: 10,
    marginHorizontal:15,
    shadowColor: '#000',
    shadowOffset: {
    width: 0,
    height: 4,
      },
      shadowOpacity: 0.5,
      shadowRadius: 4.65,
      elevation: 3,

  },
  text: {
    color:'black',
    fontSize: 15,
    fontWeight:'500',
    marginBottom: 10,
  },
});


export default CaremanualScreen;
