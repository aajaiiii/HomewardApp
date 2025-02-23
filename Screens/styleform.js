
import { StyleSheet } from 'react-native';

const styleform = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        padding: 13,
        borderRadius: 10,
        margin: 8,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.5,
        shadowRadius: 4.65,
        elevation: 3,
      },

    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
      },
      modalContent: {
        width: 300,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
      },
      textInput: {
        borderWidth: 1,
        borderColor: '#DCDCDC',
        borderRadius: 10,
        paddingHorizontal: 8,
        marginVertical: 10,
        height: 40,
        fontFamily: 'Kanit-Regular',
      },
      textOk: {
        backgroundColor: '#87CEFA',
        color: '#fff',
        alignItems: 'center',
        padding: 5,
        borderRadius: 10,
        // width: 50,
        borderWidth: 1,
        borderColor: '#87CEFA',
        flex: 1,
        fontFamily: 'Kanit-Medium',
      },
      textCC: {
        // backgroundColor: 'red',
        borderWidth: 1,
        borderColor: '#87CEFA',
        alignItems: 'center',
        padding: 5,
        borderRadius: 10,
        // width: 100,
        flex: 1,
        fontFamily: 'Kanit-Medium',
      },
      buttonContent: {
        flexDirection: 'row',
        marginLeft: 'auto',
        marginRight: 'auto',
        justifyContent: 'space-between',  
      },
      text: {
        color: 'black',
        fontSize: 16,
        fontFamily: 'Kanit-Regular',
        padding: 5,
        paddingLeft:8,
      },
      // texthead: {
      //   color: 'black',
      //   fontSize: 18,
      //   padding: 7,
      //   fontFamily: 'Arial',
      //   fontWeight: '700',
      //   textAlign:'center'
      // },
      sectionHeader: {
        fontSize: 18,
        textAlign:'center',
        fontFamily: 'Kanit-SemiBold',
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        paddingBottom: 5,
        color: '#333',
      },
      
});

export default styleform;
