// import React from 'react';
// import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import { useNavigation } from '@react-navigation/native';

// const CustomHeader = ({ currentScreen }) => {
//   const navigation = useNavigation();

//   return (
//     <View style={styles.headerContainer}>
//       {/* ปุ่มย้อนกลับจะแสดงเฉพาะในหน้า Informationtwo */}
//       {currentScreen === 'Informationtwo' && (
//         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
//           <Ionicons name="chevron-back-outline" size={30} color="#5AB9EA" />
//         </TouchableOpacity>
//       )}

//       <View style={styles.lineContainer}>
//         <View style={[styles.line, currentScreen === 'Informationone' && styles.activeLine]} />
//         <View style={[styles.line, currentScreen === 'Informationtwo' && styles.activeLine]} />
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   headerContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingTop: 30,
//     paddingBottom: 10,
//     backgroundColor: '#fff',
//   },
//   backButton: {
//     position: 'absolute',
//     left: 15,
//     top: 15, // ปรับให้เหมาะกับตำแหน่ง header
//     zIndex: 10,
//   },
//   lineContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     flex: 1,
//   },
//   line: {
//     height: 5,
//     width: '10%',
//     backgroundColor: '#fafafa',
//     marginHorizontal: 5,
//   },
//   activeLine: {
//     backgroundColor: '#5AB9EA',
//   },
// });
// export default CustomHeader;
import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const CustomHeader = ({ currentScreen, goBack }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.headerContainer}>
      {/* ปุ่มย้อนกลับจะแสดงเฉพาะในหน้า Informationtwo */}
      {/* {currentScreen === 'Informationtwo' && (
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back-outline" size={30} color="#5AB9EA" />
        </TouchableOpacity>
      )} */}

      {/* เส้นบอกขั้นตอน */}
      <View style={styles.lineContainer}>
        {/* <View style={[styles.line, currentScreen === 'ConsentScreen' && styles.activeLine]} /> */}
        <View style={[styles.line, currentScreen === 'Informationone' && styles.activeLine]} />
        <View style={[styles.line, currentScreen === 'Informationtwo' && styles.activeLine]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row', 
    alignItems: 'center',
    justifyContent: 'center',
    height: 50, 
    backgroundColor: '#5AB9EA',
    shadowColor: '#000', // สีของเงา
    shadowOffset: { width: 0, height: 2 }, // ระยะห่างของเงา
    shadowOpacity: 0.1, // ความเข้มของเงา
    shadowRadius: 4, // ความเบลอของเงา
    elevation: 5, // สำหรับ Android
  },
  backButton: {
    position: 'absolute',
    left: 15,
  },
  lineContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  line: {
    height: 5,
    width: 40,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 5,
    borderRadius: 5, 
    transition: 'all 0.3s ease', 
  },
  activeLine: {
    backgroundColor: '#fff',
    transform: [{ scaleX: 1.1 }],
  },
});

export default CustomHeader;
