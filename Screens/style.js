import {StyleSheet} from 'react-native';
const fontFamily = 'Roboto';
const style = StyleSheet.create({

    // container: {
    //     backgroundColor: '#fff',
    //     padding: 20,
    //     borderRadius: 10,
    //     margin: 15,
    //     shadowColor: '#000',
    //     shadowOffset: {
    //       width: 0,
    //       height: 4,
    //     },
    //     shadowOpacity: 0.5,
    //     shadowRadius: 4.65,
    //     elevation: 3,
    //   },
    container: {
      padding: 15,
      marginVertical: 15,
      marginHorizontal: 15,
      backgroundColor: 'white',
      borderRadius: 15,
      borderWidth: 1,
      borderColor: '#ddd',
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 5,
    },
      text:{
        color: 'black',
        fontFamily: 'Arial',
        fontSize: 16,
        fontWeight: 'normal',
        padding: 10,
      },
      inBut: {
        // backgroundColor: '#87CEFA',
        backgroundColor: '#00A9E0',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
      },
      textinBut:{
        color: '#FFF',
        fontSize: 16,
        
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
      Picker:{
        padding:20,
        borderRadius: 20, 

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