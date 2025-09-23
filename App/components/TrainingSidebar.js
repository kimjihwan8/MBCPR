import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

/**
 * 훈련 화면의 사이드바 UI를 담당하는 재사용 가능한 컴포넌트
 * @param {object} props
 * @param {string} props.formattedTime - MM:SS 형식으로 변환된 시간 문자열
 * @param {function} props.onBackPress - 뒤로가기 버튼을 눌렀을 때 실행될 함수
 */
const TrainingSidebar = ({ formattedTime, onBackPress }) => {
  return (
    <View style={styles.sidebar}>
      <TouchableOpacity style={styles.backButtonContainer} onPress={onBackPress}>
        <Text style={styles.backButton}>{'<'}</Text>
      </TouchableOpacity>
      <Text style={styles.timer}>{formattedTime}</Text>
      <View>
        <Text style={styles.menuItem}>· 반동 확인</Text>
        <Text style={styles.menuItem}>· 호흡 확인</Text>
        <Text style={[styles.menuItem, styles.activeMenuItem]}>· 가슴압박</Text>
        <Text style={styles.menuItem}>· 인공호흡</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sidebar: { 
    width: 240, 
    backgroundColor: '#FF7F50', 
    padding: 25, 
    paddingTop: 40 
  },
  backButtonContainer: { 
    width: 40, 
    height: 40, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 20 
  },
  backButton: { 
    fontSize: 32, 
    color: '#FFFFFF', 
    fontWeight: 'bold' 
  },
  timer: { 
    fontSize: 48, 
    color: '#FFFFFF', 
    fontWeight: 'bold', 
    marginBottom: 50 
  },
  menuItem: { 
    fontSize: 18, 
    color: '#FFFFFF', 
    marginBottom: 15, 
    opacity: 0.8 
  },
  activeMenuItem: { 
    fontWeight: 'bold', 
    opacity: 1 
  },
});

export default TrainingSidebar;