import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import TrainingFlowScreen from './app/TrainingFlowScreen';

const App: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <TrainingFlowScreen />
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

