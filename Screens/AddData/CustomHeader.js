import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CustomHeader = ({ currentScreen }) => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.lineContainer}>
        <View style={[styles.line, currentScreen === 'Informationone' && styles.activeLine]} />
        <View style={[styles.line, currentScreen === 'Informationtwo' && styles.activeLine]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: 30,
    paddingBottom: 10,
    backgroundColor: '#fff',
  },
  lineContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft:'auto',
    marginRight:'auto'
  },
  line: {
    height: 5,
    width: '10%',
    backgroundColor: '#D9D9D9',
    marginHorizontal:5,
  },
  activeLine: {
    backgroundColor: '#87CEFA',
  },
});

export default CustomHeader;
