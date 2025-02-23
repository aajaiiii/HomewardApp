import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const PageIndicator = ({currentPage}) => {
  return (
    // <View style={styles.indicatorContainer}>
    //   <View style={[styles.circle, currentPage === 1 ? styles.activeCircle : styles.inactiveCircle]}>
    //     <Text style={[styles.circleText, currentPage === 1 ? styles.activeText : styles.inactiveText]}>1</Text>
    //   </View>
    //   <View style={[styles.line, currentPage === 1 ? styles.activeLine : styles.inactiveLine]} />
    //   <View style={[styles.circle, currentPage === 2 ? styles.activeCircle : styles.inactiveCircle]}>
    //     <Text style={[styles.circleText, currentPage === 2 ? styles.activeText : styles.inactiveText]}>2</Text>
    //   </View>
    // </View>
    //     <View style={styles.fixedContainer}>
    //     <View style={styles.indicatorContainer}>
    //       {/* หมายเลข 1 + ชื่อ */}
    //       <View style={styles.circleContainer}>
    //         <View style={[styles.circle, currentPage === 1 ? styles.activeCircle : styles.inactiveCircle]}>
    //           <Text style={[styles.circleText, currentPage === 1 ? styles.activeText : styles.inactiveText]}>1</Text>
    //         </View>
    //         <Text style={[styles.pageText, currentPage === 1 ? styles.activeTextIn : styles.inactiveText]}>
    //           อาการและอาการที่แสดง
    //         </Text>
    //       </View>

    //       {/* เส้นเชื่อม */}
    //       <View style={[styles.line, currentPage === 1 ? styles.activeLine : styles.inactiveLine]} />

    //       {/* หมายเลข 2 + ชื่อ */}
    //       <View style={styles.circleContainer}>
    //         <View style={[styles.circle, currentPage === 2 ? styles.activeCircle : styles.inactiveCircle]}>
    //           <Text style={[styles.circleText, currentPage === 2 ? styles.activeText : styles.inactiveText]}>2</Text>
    //         </View>
    //         <Text style={[styles.pageText, currentPage === 2 ? styles.activeTextIn : styles.inactiveText]}>
    //           สัญญาณชีพ
    //         </Text>
    //       </View>
    //     </View>
    //   </View>
    <View style={styles.fixedContainer}>
      <View style={styles.indicatorContainer}>
        {/* วงกลมของตัวเลข */}
        <View style={styles.circleRow}>
          <View
            style={[
              styles.circle,
              currentPage === 1 ? styles.activeCircle : styles.inactiveCircle,
            ]}>
            <Text
              style={[
                styles.circleText,
                currentPage === 1 ? styles.activeText : styles.inactiveTextIn,
              ]}>
              1
            </Text>
          </View>
          <View
            style={[
              styles.line,
              currentPage === 1 ? styles.activeLine : styles.inactiveLine,
            ]}
          />
          <View
            style={[
              styles.circle,
              currentPage === 2 ? styles.activeCircle : styles.inactiveCircle,
            ]}>
            <Text
              style={[
                styles.circleText,
                currentPage === 2 ? styles.activeText : styles.inactiveTextIn,
              ]}>
              2
            </Text>
          </View>
        </View>

        {/* ข้อความด้านล่าง */}
        <View style={styles.textRow}>
          <Text
            style={[
              styles.pageText,
              currentPage === 1 ? styles.activeTextIn : styles.inactiveText,
            ]}>
            อาการและอาการที่แสดง
          </Text>
          <Text
            style={[
              styles.pageText,
              currentPage === 2 ? styles.activeTextIn : styles.inactiveText,
            ]}>
            สัญญาณชีพ
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  fixedContainer: {
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: '#fafafa',
    paddingVertical: 5,
    zIndex: 100,
  },
  indicatorContainer: {
    alignItems: 'center',
    justifyContent: 'center', 
  },
  circleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circleContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: 120,
    minHeight: 70,
  },
  circleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  textRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 235,
    marginTop: 5,
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeCircle: {
    backgroundColor: '#42A5F5',
  },
  inactiveCircle: {
    backgroundColor: '#999',
  },
  circleText: {
    fontSize: 18,
    fontFamily: 'Kanit-Medium',
  },

  activeText: {
    color: '#fff',
    fontFamily: 'Kanit-Medium',
  },
  activeTextIn: {
    color: '#42A5F5',
    fontFamily: 'Kanit-Medium',
  },
  inactiveText: {
    color: '#999',
    fontFamily: 'Kanit-Regular',
  },
  inactiveTextIn: {
    color: '#fff',
    fontFamily: 'Kanit-Regular',
  },
  line: {
    width: 89,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#42A5F5',
    margin:8,
  },
//   activeLine: {
//     backgroundColor: '#5AB9EA',
//   },
//   inactiveLine: {
//     backgroundColor: '#E0E0E0',
//   },
  pageText: {
    fontSize: 14,
    textAlign: 'center',
    width: 100,
    lineHeight: 18,
    // alignSelf: 'center',
  },
});

export default PageIndicator;
