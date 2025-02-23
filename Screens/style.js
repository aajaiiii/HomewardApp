import {StyleSheet} from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

const style = StyleSheet.create({
  container: {
    padding: 15,
    marginVertical: 10,
    marginHorizontal: 15,
    backgroundColor: 'white',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#bbb',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  text: {
    color: 'black',
    fontFamily: 'Kanit-Regular',
    fontSize: 16,
    fontWeight: 'normal',
    padding: 10,
  },
  inBut: {
    // backgroundColor: '#87CEFA',
    backgroundColor: '#42A5F5',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  textinBut: {
    color: '#FFF',
    fontSize: RFValue(16, 812),
    fontFamily: 'Kanit-Regular',
  },
  textInputContainer: {
    borderWidth: 1.2,
    borderColor: '#DCDCDC',
    borderRadius: 10,
    paddingHorizontal: 8,
    marginTop: 1,
  },
  textInputRead: {
    borderWidth: 1.2,
    borderColor: '#DCDCDC',
    borderRadius: 12,
    // paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginTop: 1,
    // marginBottom: 5,
    backgroundColor: '#fff',
    color: '#333',
    height: 45,
    lineHeight: 24,
    flex: 1,
  },
  textOnlyRead: {
    borderWidth: 1.2,
    borderColor: '#DCDCDC',
    backgroundColor: '#eeeeee',
    borderRadius: 10,
    paddingHorizontal: 8,
    marginTop: 1,
    height: 45,
    // marginVertical:10,
    lineHeight: 24,
    flex: 1,
  },
  textInputAddress: {
    borderWidth: 1.2,
    borderColor: '#DCDCDC',
    borderRadius: 10,
    paddingHorizontal: 8,
    marginTop: 1,
    height: 80,
    marginVertical: 4,
    flex: 1,
  },
  pickerContainer: {
    borderWidth: 1.2,
    borderColor: '#DCDCDC',
    borderRadius: 10,
    paddingVertical: 12,
    marginTop: 1,
    height: 49,
    // marginVertical:10,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerWrapper: {
    borderWidth: 1.2,
    borderColor: '#DCDCDC',
    borderRadius: 10,
    marginTop: 1,
    // marginVertical: 4,
    flex: 1,
    height: 45,
    marginRight: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  Picker: {
    flex: 1, // ทำให้ picker ขยายเต็มพื้นที่
    height: 45, // ความสูงของ picker
    width: '100%',
    fontFamily: 'Kanit-Regular',
    // borderRadius:100,
  },
  texthead: {
    color: 'black',
    fontSize: 16,
    padding: 7,
    fontFamily: 'Kanit-Regular',
  },
  textWidth: {
    flex: 1,
  },
  pickerItemStyle: {
    fontSize: 16, // ขนาดฟอนต์ที่ใหญ่ขึ้น
    color: '#000', // สีของข้อความ
    fontFamily: 'Kanit-Regular', // กำหนดฟอนต์
    paddingVertical: 8, // เพิ่มช่องว่างระหว่างตัวเลือก
    alignItems: 'center',
  },
  inputContainer: {
    marginBottom: 8,
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
    fontSize: 16,
    color: '#000',
    fontFamily: 'Kanit-Regular',
    paddingVertical: 8,
    alignItems: 'center',
  },
  pickerItemNullStyle: {
    fontSize: 16,
    color: '#888',
    fontFamily: 'Kanit-Regular',
    paddingVertical: 8,
    alignItems: 'center',
  },
  placeholderText: {
    color: '#847',
  },
});

export default style;
