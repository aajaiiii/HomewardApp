
import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
    info: {
      marginVertical: 6,
    },
    textLabel: {
      fontSize: 16,
      color: '#616161',
      fontFamily: 'Kanit-Regular',
      lineHeight: 24,
      marginVertical: 2,
    },
    textValue: {
      fontFamily: 'Kanit-Regular',
      fontSize: 16,
      color: 'black',
      // textAlign: 'right',
      flex: 1,
      lineHeight: 24,
    },
    pickerItemStyle: {
      fontSize: 16, // ขนาดฟอนต์ที่ใหญ่ขึ้น
      color: '#000', // สีของข้อความ
      fontFamily: 'Kanit-Regular', // กำหนดฟอนต์
      paddingVertical: 8, // เพิ่มช่องว่างระหว่างตัวเลือก
      alignItems: 'center',
    },
    errorText: {
      color: 'red',
      fontSize: 14,
      fontFamily: 'Kanit-Regular',
      paddingVertical: 3,
      paddingLeft: 4,
    },
  });
  
  export default styles;