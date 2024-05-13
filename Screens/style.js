import {StyleSheet} from 'react-native';
const fontFamily = 'Roboto';
const style = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        margin: 15,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.5,
        shadowRadius: 4.65,
        elevation: 3,
      },
      text:{
        color: 'black',
        fontFamily: 'Arial',
        fontSize: 16,
        fontWeight: 'normal',
        padding: 10,
      },
      inBut: {
        width: '70%',
        backgroundColor: '#87CEFA',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 1,
        borderRadius: 50,
        marginLeft: 'auto',
        marginRight: 'auto',
        color:'#fff',
        marginTop:10,
      },
      textinBut:{
        color:'#fff',
        fontFamily: 'Arial',
        fontSize: 16,
        fontWeight: 'normal',
        padding: 10,
        
      },
      textInputContainer: {
        borderWidth: 1, 
        borderColor: '#DCDCDC', 
        borderRadius: 10, 
        paddingHorizontal: 8,
        marginTop: 1, 
      },
      textInputRead: {
        borderWidth: 1, 
        borderColor: '#DCDCDC', 
        borderRadius: 10, 
        paddingHorizontal: 8,
        marginTop: 1, 
        height:45,
        marginVertical:4,
        flex: 1
      },
      textInputAddress: {
        borderWidth: 1, 
        borderColor: '#DCDCDC', 
        borderRadius: 10, 
        paddingHorizontal: 8,
        marginTop: 1, 
        height:80,
        marginVertical:4,
        flex: 1
      },
      pickerContainer: {
        borderWidth: 1, 
        borderColor: '#DCDCDC', 
        borderRadius: 10, 
        paddingHorizontal: 8,
        marginTop: 1, 
        height:50,
        marginVertical:4,
        flex: 1,
      },
      texthead: {
        color: 'black',
        fontSize: 16,
        padding: 7,
        fontFamily: 'Arial',
        fontWeight: '700',
      },
      textWidth:{
        flex:1,
      },
})
export default style;