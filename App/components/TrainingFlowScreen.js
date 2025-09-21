import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, SafeAreaView, TouchableOpacity } from 'react-native';
import axios from 'axios';

// --- 설정 ---
// TODO: 실제 서버의 IP 주소와 포트 번호를 입력해주세요.
const BASE_URL = 'http://YOUR_SERVER_IP:PORT'; 

// Axios 인스턴스 생성 (공통 설정)
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 5000, // 5초 이상 응답이 없으면 에러 처리
});

// 서버로부터 받는 상태 값에 따른 피드백 문장 매핑
const feedbackMap = {
  all_ok: '잘하고 있습니다. 이대로 유지하세요',
  rate_slow: '조금 더 빠르게 눌러주세요',
  rate_fast: '너무 빠릅니다. 조금 천천히 눌러주세요',
  depth_weak: '더 세게 눌러주세요',
  depth_strong: '조금 약하게 눌러주세요',
  position_bad: '압박 위치가 잘못되었습니다.',
};


const TrainingFlowScreen = () => {
  // 화면 상태를 관리합니다: 'loading', 'countdown', 'training', 'error'
  const [screen, setScreen] = useState('loading');
  const [countdown, setCountdown] = useState(3);
  const [trainingTime, setTrainingTime] = useState(0);
  const [feedback, setFeedback] = useState('정확한 자세로 압박을 시작하세요.'); // 서버로부터 받을 피드백
  const [error, setError] = useState(null); // 에러 메시지

  // 초를 MM:SS 형식으로 변환하는 함수
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  // 화면 흐름 및 API 호출을 관리하는 핵심 로직
  useEffect(() => {
    let timer; // setTimeout, setInterval을 관리하기 위한 변수

    // 1. 로딩 상태: 보드 연결 확인 -> 훈련 시작 요청
    if (screen === 'loading') {
      const startTrainingSequence = async () => {
        try {
          // 1단계: 서버에 보드 연결 확인을 요청합니다.
          console.log('API 요청: /RealTime/board/checkConnection (GET)');
          await api.get('/RealTime/board/checkConnection');
          console.log('응답 성공: 보드 연결 확인 완료.');

          // 2단계: 서버에 실시간 통신 시작을 요청합니다.
          console.log('API 요청: /RealTime/start (POST)');
          await api.post('/RealTime/start');
          console.log('응답 성공: 서버가 통신 요청을 수락했습니다.');

          // 3단계: 모든 요청이 성공하면 카운트다운을 시작합니다.
          setScreen('countdown');
        } catch (err) {
          console.error('훈련 시작 절차 실패:', err);
          setError('장비 연결 또는 서버 시작에 실패했습니다.');
          setScreen('error'); // 실패 시 에러 화면 표시
        }
      };
      startTrainingSequence();
    }

    // 2. 카운트다운 상태
    if (screen === 'countdown') {
      if (countdown === 0) {
        setScreen('training');
      } else {
        timer = setTimeout(() => setCountdown(c => c - 1), 1000);
      }
    }

    // 3. 훈련 상태: 타이머 및 데이터 폴링 시작
    if (screen === 'training') {
      // 훈련 시간 타이머
      const trainingTimer = setInterval(() => {
        setTrainingTime(t => t + 1);
      }, 1000);

      // 2초마다 평가 데이터 요청 (폴링)
      const pollingTimer = setInterval(async () => {
        try {
          console.log('API 요청: /RealTime/data/processed (GET)');
          const response = await api.get('/RealTime/data/processed');
          
          // TODO: 서버가 보내주는 상태 키(key)가 'status'가 아닐 경우 수정해야 합니다.
          const statusFromServer = response.data.status; 
          
          // 서버에서 받은 status 값으로 feedbackMap에서 해당하는 문장을 찾습니다.
          const message = feedbackMap[statusFromServer] || '피드백을 기다리는 중입니다...';
          setFeedback(message);
          console.log(`피드백 수신: status=${statusFromServer}, message=${message}`);
          
        } catch (err) {
          console.error('평가 데이터 요청 실패:', err);
          setFeedback('서버와 연결이 끊어졌습니다.');
        }
      }, 2000);

      // 훈련이 끝나거나 화면을 벗어날 때 타이머 정리
      return () => {
        clearInterval(trainingTimer);
        clearInterval(pollingTimer);
        console.log('훈련 종료. /RealTime/stop API 호출');
        api.post('/RealTime/stop').catch(err => console.error('Stop API 호출 실패:', err));
      };
    }

    return () => clearTimeout(timer);
  }, [screen, countdown]);

  // --- 각 화면 렌더링하는 함수들 ---

  const renderLoadingScreen = () => (
    <View style={styles.centerContainer}>
      <Text style={styles.loadingText}>서버에 연결 중입니다...</Text>
      <ActivityIndicator size="large" color="#FF7F50" style={{ marginTop: 20 }}/>
    </View>
  );

  const renderCountdownScreen = () => (
    <View style={styles.centerContainer}>
      <Text style={styles.countdownText}>{countdown}</Text>
    </View>
  );

    const renderErrorScreen = () => (
    <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={() => { setError(null); setScreen('loading'); }}>
            <Text style={styles.retryButton}>재시도</Text>
        </TouchableOpacity>
    </View>
  );

  const renderTrainingScreen = () => (
    <SafeAreaView style={styles.trainingContainer}>
      <View style={styles.sidebar}>
        <TouchableOpacity style={styles.backButtonContainer}>
          <Text style={styles.backButton}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.timer}>{formatTime(trainingTime)}</Text>
        <View>
          <Text style={styles.menuItem}>· 반동 확인</Text>
          <Text style={styles.menuItem}>· 호흡 확인</Text>
          <Text style={[styles.menuItem, styles.activeMenuItem]}>· 가슴압박</Text>
          <Text style={styles.menuItem}>· 인공호흡</Text>
        </View>
      </View>
      <View style={styles.mainContent}>
        <Text style={styles.title}>가슴압박</Text>
        <Text style={styles.subtitle}>일정한 간격으로 알맞은 깊이를 눌러주세요.</Text>
        <View style={styles.contentRow}>
          <View style={styles.feedbackContainer}>
            <Text style={styles.feedbackTitle}>피드백</Text>
            <Text style={styles.feedbackText}>{feedback}</Text>
          </View>
          <View style={styles.imagePlaceholder}>
            <Text style={styles.placeholderText}></Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
  
  const renderScreen = () => {
    switch (screen) {
      case 'loading':   return renderLoadingScreen();
      case 'countdown': return renderCountdownScreen();
      case 'training':  return renderTrainingScreen();
      case 'error':     return renderErrorScreen();
      default:          return renderLoadingScreen();
    }
  };

  return <View style={{flex: 1}}>{renderScreen()}</View>;
};

// --- 스타일링 ---
const styles = StyleSheet.create({
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' },
  loadingText: { fontSize: 22, color: '#FF7F50', fontWeight: 'bold' },
  countdownText: { fontSize: 100, fontWeight: 'bold', color: '#FF7F50' },
  trainingContainer: { flex: 1, flexDirection: 'row', backgroundColor: '#FFFFFF' },
  sidebar: { width: 240, backgroundColor: '#FF7F50', padding: 25, paddingTop: 40 },
  backButtonContainer: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  backButton: { fontSize: 32, color: '#FFFFFF', fontWeight: 'bold' },
  timer: { fontSize: 48, color: '#FFFFFF', fontWeight: 'bold', marginBottom: 50 },
  menuItem: { fontSize: 18, color: '#FFFFFF', marginBottom: 15, opacity: 0.8 },
  activeMenuItem: { fontWeight: 'bold', opacity: 1 },
  mainContent: { flex: 1, padding: 40 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#FF7F50', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#666666', marginBottom: 30 },
  contentRow: { flex: 1, flexDirection: 'row', gap: 20 },
  feedbackContainer: { flex: 1, backgroundColor: '#FFE5D9', borderRadius: 15, padding: 20, justifyContent: 'center' },
  feedbackTitle: { fontSize: 16, fontWeight: 'bold', color: '#333333', position: 'absolute', top: 20, left: 20 },
  feedbackText: { fontSize: 18, color: '#333333', textAlign: 'center' },
  imagePlaceholder: { flex: 1, borderWidth: 2, borderColor: '#E0E0E0', borderStyle: 'dashed', borderRadius: 15, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9F9F9' },
  placeholderText: { color: '#AAAAAA', fontSize: 16 },
  errorText: { fontSize: 20, color: '#D32F2F', textAlign: 'center', marginBottom: 20 },
  retryButton: { fontSize: 18, color: '#FFFFFF', backgroundColor: '#FF7F50', paddingVertical: 10, paddingHorizontal: 30, borderRadius: 10, overflow: 'hidden', marginTop: 10 },
});

export default TrainingFlowScreen;
