import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface CountdownScreenProps {
  countdown: number;
}

/**
 * 카운트다운 화면
 */
const CountdownScreen: React.FC<CountdownScreenProps> = ({ countdown }) => (
  <View style={styles.centerContainer}>
    <Text style={styles.countdownText}>{countdown}</Text>
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
});

export default CountdownScreen;
