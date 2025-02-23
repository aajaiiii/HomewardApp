import React, {useState} from 'react';
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  Linking,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // นำเข้าไอคอน

const ConsentScreen = ({navigation}) => {
  const [acceptPDPA, setacceptPDPA] = useState(false);

  const handleConsent = () => {
    setacceptPDPA(true);
    navigation.navigate('Informationone', {acceptPDPA: true});
  };

  return (
    <View style={{flex: 1}}>
      <View style={styles.container}>
        <View style={styles.box}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}>
            <Text style={styles.header}>Privacy Policy</Text>
            <Text style={styles.subHeader}>
              Last updated: February 22, 2025
            </Text>

            <Text style={styles.paragraph}>
              This Privacy Policy describes Our policies and procedures on the
              collection, use and disclosure of Your information when You use
              the Service and tells You about Your privacy rights and how the
              law protects You.
            </Text>

            <Text style={styles.paragraph}>
              We use Your Personal data to provide and improve the Service. By
              using the Service, You agree to the collection and use of
              information in accordance with this Privacy Policy.
            </Text>

            <TouchableOpacity
              onPress={() =>
                Linking.openURL(
                  'https://www.termsfeed.com/privacy-policy-generator/',
                )
              }>
              <Text style={styles.link}>Privacy Policy Generator</Text>
            </TouchableOpacity>

            <Text style={styles.sectionHeader}>
              Interpretation and Definitions
            </Text>
            <Text style={styles.subHeader}>Interpretation</Text>

            <Text style={styles.paragraph}>
              The words of which the initial letter is capitalized have meanings
              defined under the following conditions. The following definitions
              shall have the same meaning regardless of whether they appear in
              singular or in plural.
            </Text>

            <Text style={styles.subHeader}>Definitions</Text>
            <Text style={styles.paragraph}>
              For the purposes of this Privacy Policy:
            </Text>

            <View style={styles.listContainer}>
              <Text style={styles.listItem}>
                • <Text style={styles.bold}>Account:</Text> A unique account
                created for You to access our Service.
              </Text>
              <Text style={styles.listItem}>
                • <Text style={styles.bold}>Affiliate:</Text> An entity that
                controls, is controlled by or is under common control with a
                party.
              </Text>
              <Text style={styles.listItem}>
                • <Text style={styles.bold}>Application:</Text> Refers to
                Homeward, the software program provided by the Company.
              </Text>
              <Text style={styles.listItem}>
                • <Text style={styles.bold}>Company:</Text> ("We", "Us", or
                "Our") refers to Homeward.
              </Text>
              <Text style={styles.listItem}>
                • <Text style={styles.bold}>Country:</Text> Refers to Thailand.
              </Text>
              <Text style={styles.listItem}>
                • <Text style={styles.bold}>Device:</Text> Any device that can
                access the Service, such as a computer, phone, or tablet.
              </Text>
              <Text style={styles.listItem}>
                • <Text style={styles.bold}>Personal Data:</Text> Any
                information that relates to an identifiable individual.
              </Text>
              <Text style={styles.listItem}>
                • <Text style={styles.bold}>Service:</Text> Refers to the
                Application.
              </Text>
              <Text style={styles.listItem}>
                • <Text style={styles.bold}>Service Provider:</Text> A person or
                company that processes data on behalf of the Company.
              </Text>
            </View>

            <Text style={styles.sectionHeader}>
              Collecting and Using Your Personal Data
            </Text>
            <Text style={styles.subHeader}>Types of Data Collected</Text>

            <Text style={styles.subHeader}>Personal Data</Text>
            <Text style={styles.paragraph}>
              While using Our Service, We may ask You to provide Us with certain
              personally identifiable information:
            </Text>

            <View style={styles.listContainer}>
              <Text style={styles.listItem}>• Email address</Text>
              <Text style={styles.listItem}>• First name and last name</Text>
              <Text style={styles.listItem}>• Phone number</Text>
              <Text style={styles.listItem}>
                • Address, State, Province, ZIP/Postal code, City
              </Text>
              <Text style={styles.listItem}>• Usage Data</Text>
            </View>

            <Text style={styles.subHeader}>Usage Data</Text>
            <Text style={styles.paragraph}>
              Usage Data is collected automatically when using the Service. It
              may include information such as Your Device's IP address, browser
              type, and time spent on pages.
            </Text>

            <Text style={styles.sectionHeader}>Contact Us</Text>
            <Text style={styles.paragraph}>
              If you have any questions about this Privacy Policy, You can
              contact us:
            </Text>
            <Text style={styles.listItem}>
              • By email: sasithorn.sor@kkumail.com
            </Text>
          </ScrollView>
        </View>
      </View>
      <View style={styles.buttongroup}>
        {/* ปุ่มยินยอม */}
        <TouchableOpacity
          onPress={() => setacceptPDPA(!acceptPDPA)}
          style={styles.radioButton}>
          <View
            style={[
              styles.radioCircle,
              acceptPDPA ? styles.radioCircleChecked : null,
            ]}>
            {acceptPDPA && <Icon name="check" size={18} color="#fff" />}
          </View>
          <Text style={styles.radioText}>ฉันยินยอมให้เปิดเผยข้อมูล</Text>
        </TouchableOpacity>

        {/* ปุ่มยืนยัน */}
        <TouchableOpacity
          style={[
            styles.inBut,
            {backgroundColor: acceptPDPA ? '#5AB9EA' : '#ccc'},
          ]}
          onPress={handleConsent}
          disabled={!acceptPDPA}>
          <Text style={styles.textinBut}>ยืนยัน</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1, // ทำให้ ScrollView ขยายเต็มพื้นที่
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 10,
  },
  box: {
    flex: 1,
    padding: 15,
    // width: '90%',
    // maxHeight: '100%',
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
  head: {
    textAlign: 'center',
    color: '#000',
    fontSize: 24,
    fontFamily: 'Kanit-SemiBold',
    // fontWeight: '700',
  },

  body: {
    fontSize: 16,
    color: '#000',
    textAlign: 'justify',
    lineHeight: 24,
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    height: 100,
    width: 300,
    // marginTop: 50,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  textBody: {
    fontSize: 16,
    fontFamily: 'Kanit-Regular',
    color: '#000',
  },
  buttongroup: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    alignItems: 'center',
  },

  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#5AB9EA',
    marginRight: 10,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioCircleChecked: {
    backgroundColor: '#5AB9EA',
  },
  radioText: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'Kanit-Regular',
  },

  inBut: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: '#5AB9EA',
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 20,
    elevation: 5, // เพิ่มเงา
  },
  textinBut: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Kanit-Regular',
    fontWeight: 'bold',
  },
  buttongroup: {
    backgroundColor: '#fafafa',
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    marginBottom: 0, // ไม่ให้มีช่องว่างระหว่างปุ่มและขอบล่าง
  },
  inBut: {
    width: '100%',
    // backgroundColor: '#87CEFA',
    backgroundColor: '#5AB9EA',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  textinBut: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Kanit-Regular',
  },
  // header: {
  //   fontSize: 24,
  //   fontWeight: 'bold',
  //   textAlign: 'center',
  //   marginBottom: 10,
  // },
  // body: {
  //   fontSize: 16,
  //   textAlign: 'center',
  //   marginBottom: 20,
  // },
  // link: {
  //   color: 'blue',
  //   textDecorationLine: 'underline',
  // },
  // buttonContainer: {
  //   marginTop: 20,
  //   flexDirection: 'row',
  //   justifyContent: 'space-around',
  // },
});

export default ConsentScreen;
