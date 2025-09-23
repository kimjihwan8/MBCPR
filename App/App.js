import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import TrainingFlowScreen from './app/TrainingFlowScreen';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      {/* TrainingScreen 컴포넌트를 화면에 렌더링합니다. */}
      <TrainingFlowScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // 기본 배경색 설정
  },
});
