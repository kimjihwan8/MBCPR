import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import TrainingFlowScreen from './app/TrainingFlowScreen';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <TrainingFlowScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
