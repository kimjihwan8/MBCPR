import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

/**
 * 로딩 화면
 */
const LoadingScreen: React.FC = () => {
  return (
    <View style={styles.centerContainer}>
      <Text style={styles.loadingText}>서버에 연결 중입니다...</Text>
      <ActivityIndicator size="large" color="#FF7F50" style={styles.indicator} />
    </View>
  );
};

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  loadingText: {
    fontSize: 22,
    color: '#FF7F50',
    fontWeight: 'bold',
  },
  indicator: {
    marginTop: 20,
  },
});

export default LoadingScreen;
