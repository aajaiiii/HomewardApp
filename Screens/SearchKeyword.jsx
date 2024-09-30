import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const STORAGE_KEY = '@recent_searches';

export default function SearchKeyword() {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [allMpersonnel, setAllMpersonnel] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [showRecentSearches, setShowRecentSearches] = useState(true);
  const navigation = useNavigation();

  const fetchAllUsers = async () => {
    try {
      const response = await fetch(
        'http://192.168.2.57:5000/allMpersonnelchat1',
      );
      const data = await response.json();
      setAllMpersonnel(data.data);
    } catch (error) {
      console.error('Error fetching all users:', error);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  useEffect(() => {
    if (searchKeyword.trim() === '') {
      setShowRecentSearches(true);
      setFilteredUsers([]);
    } else {
      setShowRecentSearches(false);
      const filteredUsers = allMpersonnel.filter(user => {
        const fullName = `${user.name} ${user.surname}`;
        return fullName.toLowerCase().includes(searchKeyword.toLowerCase());
      });
      setFilteredUsers(filteredUsers);
    }
  }, [searchKeyword, allMpersonnel]);

  useEffect(() => {
    loadRecentSearches();
  }, []);

  const saveRecentSearch = async keyword => {
    try {
      let searches = [...recentSearches];
      if (!searches.includes(keyword)) {
        searches.unshift(keyword);
        searches = searches.slice(0, 10);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(searches));
        setRecentSearches(searches);
      }
    } catch (error) {
      console.error('Error saving recent searches:', error);
    }
  };

  const loadRecentSearches = async () => {
    try {
      const searches = await AsyncStorage.getItem(STORAGE_KEY);
      if (searches !== null) {
        setRecentSearches(JSON.parse(searches));
      }
    } catch (error) {
      console.error('Error loading recent searches:', error);
    }
  };

  const clearRecentSearches = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setRecentSearches([]);
    } catch (error) {
      console.error('Error clearing recent searches:', error);
    }
  };

  const deleteRecentSearch = async keyword => {
    try {
      let searches = recentSearches.filter(search => search !== keyword);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(searches));
      setRecentSearches(searches);
    } catch (error) {
      console.error('Error deleting recent search:', error);
    }
  };


  const handleSelectRecipient = (user, fullName) => {
    if (user) {
      navigation.navigate('ChatSend', {
        userName: `${user.name} ${user.surname}`,
        recipientId: user._id,
        recipientModel: 'MPersonnel',
        currentRecipient: user,
      });
      saveRecentSearch(`${user.name} ${user.surname}`);
    } else if (fullName) {
      const selectedUser = allMpersonnel.find(u => `${u.name} ${u.surname}` === fullName);
      if (selectedUser) {
        navigation.navigate('ChatSend', {
          userName: fullName,
          recipientId: selectedUser._id,
          recipientModel: 'MPersonnel',
          currentRecipient: selectedUser,
        });
        saveRecentSearch(fullName);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <TextInput
          style={styles.searchInput}
          placeholder="ค้นหา"
          value={searchKeyword}
          onChangeText={setSearchKeyword}
        />
      </View>
      <ScrollView style={styles.userList}>
        {showRecentSearches && (
          <View style={styles.recentSearchContainer}>
            {recentSearches.length > 0 ? (
              <View>
                <View style={styles.recent}>
                  <Text style={styles.recentSearchHeader}>ค้นหาล่าสุด</Text>
                  <TouchableOpacity
                    style={styles.clearButton}
                    onPress={clearRecentSearches}>
                    <Text style={styles.clearButtonText}>ล้างทั้งหมด</Text>
                  </TouchableOpacity>
                </View>
                {recentSearches.map((keyword, index) => (
                  <View key={index} style={styles.recentSearchItem}>
                    <TouchableOpacity
                      style={styles.userItem}
                      onPress={() => {
                        handleSelectRecipient(null, keyword);
                        // setSearchKeyword(keyword);
                        // setShowRecentSearches(false);
                      }}>
                      <View style={styles.userInfo}>
                        <Text style={styles.userName}>{keyword}</Text>
                        <TouchableOpacity
                          style={styles.deleteButton}
                          onPress={() => deleteRecentSearch(keyword)}>
                          <Icon name="close" size={18} color="gray" />
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.noRecentSearchText}>ไม่มีประวัติการค้นหา</Text>
            )}
          </View>
        )}
        {!showRecentSearches && filteredUsers.length === 0 ? (
          <Text style={styles.noResultsText}>ไม่มีผู้ใช้ที่ค้นหา</Text>
        ) : (
          filteredUsers.map(user => (
            <TouchableOpacity
              key={user._id}
              style={styles.userItem}
              onPress={() => handleSelectRecipient(user)}>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>
                  {user.name} {user.surname}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  searchBar: {
    width: '100%',
    padding: 10,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
  },
  recent:{
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical:5,
  },
  backButton: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
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
    elevation: 3,
  },
  clearButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignSelf: 'flex-end',
  },
  clearButtonText: {
    color: 'red',
  },
  deleteButton:{
    position: 'absolute',  
    right: 10
  },
  userList: {
    width: '100%',
    paddingHorizontal: 10,
    paddingTop: 10,
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontSize: 16,
    fontWeight: 'normal',
    color: '#333',
  },
  recentSearchContainer: {
    paddingHorizontal: 10,
  
  },
  recentSearchHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginLeft:10,
  },
  noResultsText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
  noRecentSearchText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 10,
  },
});
