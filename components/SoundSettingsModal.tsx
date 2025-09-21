// SoundSettingsModal.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Slider from '@react-native-community/slider';

interface Props {
  onClose: () => void;
}

export default function SoundSettingsModal({ onClose }: Props) {
  const [volume, setVolume] = useState(0.5);

  return (
    <View style={styles.overlay}>
      {/* 바깥 클릭 시 닫기 */}
      <Pressable style={styles.background} onPress={onClose} />

      {/* 모달 내용 */}
      <View style={styles.modalBox}>
        <Text style={styles.title}>음량 조절</Text>
        <Text>소리 크기: {Math.round(volume * 200)}%</Text>
        <Slider
          style={{ width: 200, height: 40 }}
          minimumValue={0}
          maximumValue={1}
          value={volume}
          onValueChange={setVolume}
        />
        {/* 닫기 버튼 추가 (선택 사항) */}
        <Pressable style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeText}>닫기</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000, // Drawer 위로
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalBox: {
    width: 250,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    zIndex: 2100,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 16,
    backgroundColor: '#FF7F50',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  closeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
