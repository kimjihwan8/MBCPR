import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface TrainingSidebarProps {
  formattedTime: string;
}

/**
 * 훈련 화면의 사이드바 UI
 */
const TrainingSidebar: React.FC<TrainingSidebarProps> = ({ formattedTime}) => {
  return (
    <View style={styles.sidebar}>
      <TouchableOpacity style={styles.backButtonContainer} >
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
    paddingTop: 40,
  },
  backButtonContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  timer: {
    fontSize: 48,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 50,
  },
  menuItem: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 15,
    opacity: 0.8,
  },
  activeMenuItem: {
    fontWeight: 'bold',
    opacity: 1,
  },
});

export default TrainingSidebar;
