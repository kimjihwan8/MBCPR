import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

/**
 * 에러 UI를 담당하는 재사용 가능한 컴포넌트
 * @param {object} props
 * @param {string} props.errorMessage - 화면에 표시할 에러 메시지
 * @param {function} props.onRetry - '재시도' 버튼을 눌렀을 때 실행할 함수
 */
const ErrorScreen = ({ errorMessage, onRetry }) => {
  return (
    <View style={styles.centerContainer}>
      <Text style={styles.errorText}>{errorMessage}</Text>
      <TouchableOpacity onPress={onRetry}>
        <Text style={styles.retryButton}>재시도</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  centerContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#FFF' 
  },
  errorText: { 
    fontSize: 20, 
    color: '#D32F2F', 
    textAlign: 'center', 
    marginBottom: 20 
  },
  retryButton: { 
    fontSize: 18, 
    color: '#FFFFFF', 
    backgroundColor: '#FF7F50', 
    paddingVertical: 10, 
    paddingHorizontal: 30, 
    borderRadius: 10, 
    overflow: 'hidden', 
    marginTop: 10 
  },
});

export default ErrorScreen;
