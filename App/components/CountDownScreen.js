import React from "react";
import { StyleSheet, Text, View } from 'react-native';

const CountdownScreen = ({ countdown }) => (
    <View style={StyleSheet.centerContainer}>
        <Text style={StyleSheet.countdownText}>{countdown}</Text>
    </View>
);

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  countdownText: {
    fontSize: 100,
    fontWeight: 'bold',
    color: '#FF7F50',
  },
})

export default CountdownScreen;