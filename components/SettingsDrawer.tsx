// SettingsDrawer.tsx
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import WifiModal from './WifiModal';
import SoundSettingsModal from './SoundSettingsModal';
import { Easing } from 'react-native';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function SettingsDrawer({ onClose, visible }: Props) {
  const slideAnim = useRef(new Animated.Value(visible ? 0 : -300)).current;
  const [wifiVisible, setWifiVisible] = useState(false);
  const [soundVisible, setSoundVisible] = useState(false);

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 0 : -300,
      duration: 150,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [visible]);

  if (!visible && (slideAnim as any).__getValue() <= -300) return null;

  return (
    <>
      {/* 배경 클릭 시 Drawer 닫기 */}
      {visible && (
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose}>
          <View />
        </Pressable>
      )}

      {/* Drawer */}
      <Animated.View style={[styles.drawer, { left: slideAnim }]}>
        {/* 뒤로가기 버튼 */}
        <Pressable style={styles.backButton} onPress={onClose}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </Pressable>

        {/* 와이파이 버튼 */}
        <Pressable
          style={styles.menuButton}
          onPress={() => {
            setWifiVisible(true);
            // 모달 열 때 Drawer 닫고 싶으면 onClose(); 추가
          }}
        >
          <Text style={styles.menuText}>와이파이 연결</Text>
        </Pressable>

        {/* 음량 버튼 */}
        <Pressable
          style={styles.menuButton}
          onPress={() => {
            setSoundVisible(true);
            // 모달 열 때 Drawer 닫고 싶으면 onClose(); 추가
          }}
        >
          <Text style={styles.menuText}>음량 조절</Text>
        </Pressable>
      </Animated.View>

      {/* 모달 */}
      {/* {wifiVisible && <WifiModal onClose={() => setWifiVisible(false)} />} */}
      {soundVisible && <SoundSettingsModal onClose={() => setSoundVisible(false)} />}
    </>
  );
}

const styles = StyleSheet.create({
  drawer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 300,
    backgroundColor: '#FF7F50',
    padding: 16,
    zIndex: 1000,
  },
  backButton: {
    marginBottom: 20,
  },
  menuButton: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  menuText: {
    color: '#FF7F50',
    fontWeight: 'bold',
  },
});
