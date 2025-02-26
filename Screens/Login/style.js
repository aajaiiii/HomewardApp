import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: 'white',
  },
  textSign: {
    fontSize: 18,
    fontFamily: 'Kanit-Medium',
    color: 'white',
    
  },
  smallIcon: {
    marginRight: 10,
    fontSize: 24,
  },
  pagelogin:{
    // backgroundColor: '#19A7CE',
    backgroundColor: '#5AB9EA',
        // backgroundColor: '#5AB9EA',
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    height: 160,
    width: 300,
    marginTop: 50,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  text_footer: {
    color: '#05375a',
    fontSize: 18,
    fontFamily: 'Kanit-Regular',
  },
  action: {
    flexDirection: 'row',
    paddingTop: 14,
    paddingBottom: 3,
    marginTop: 15,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#5AB9EA',
    borderRadius: 50,
  },
  textInput: {
    flex: 1,
    marginTop: -12,
    color: '#05375a',
    fontFamily: 'Kanit-Regular',
    fontSize: 16,
  },
  loginContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    paddingHorizontal: 20,
    paddingVertical: 50,
    height: '100%',
    flexDirection: 'column',
  },
  header: {
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
  },
  text_header: {
    fontSize: 25,
    textAlign: 'center',
    marginBottom: 30,
    fontFamily: 'Kanit-Regular',
    color: '#5AB9EA',
  },
  button: {
    marginTop: 20,
    alignItems: 'center',
    textAlign: 'center',
    flex:1
  },
  inBut: {
    width: '100%',
    backgroundColor: '#5AB9EA',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 50,
  },
  inBut2: {
    // backgroundColor: '#5AB9EA',
    backgroundColor: '#5AB9EA',
    height: 65,
    width: 65,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomButton: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  smallIcon2: {
    fontSize: 40,
    // marginRight: 10,
  },
  bottomText: {
    color: 'black',
    fontSize: 12,
    fontFamily: 'Kanit-Medium',
    marginTop: 5,
  },
  radioButton_div: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  radioButton_inner_div: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButton_title: {
    fontSize: 20,
    color: '#5AB9EA',
    fontFamily: 'Kanit-Regular',

  },
  radioButton_text: {
    fontSize: 16,
    color: 'black',
    fontFamily: 'Kanit-Regular',
  },
  
});
export default styles;