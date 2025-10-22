import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

// --- 분리된 컴포넌트들 불러오기 ---
import CountdownScreen from '../components/CountdownScreen';
import ErrorScreen from '../components/ErrorScreen';
import LoadingScreen from '../components/LoadingScreen';
import TrainingSidebar from '../components/TrainingSidebar';

// --- 설정 ---
const BASE_URL = 'http://13.209.6.11:8080';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
});

type ScreenState = 'loading' | 'countdown' | 'training' | 'error';

const MAX_TRAINING_SECONDS = 180; // 3분 = 180초

const TrainingFlowScreen: React.FC = () => {
  const [screen, setScreen] = useState<ScreenState>('loading');
  const [countdown, setCountdown] = useState<number>(3);
  const [trainingTime, setTrainingTime] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>('정확한 자세로 압박을 시작하세요.');
  const [error, setError] = useState<string | null>(null);

  // 타이머 참조 (타입 안전)
  const countdownTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const trainingTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  // 1. 로딩 → 서버 체크 및 통신 시작
  useEffect(() => {
    if (screen === 'loading') {
      const startTrainingSequence = async () => {
        try {
          console.log('✅ 서버 상태 확인 중...');
          const healthRes = await api.get('/api/cpr/health');
          console.log('🩺 서버 상태 응답:', healthRes.status);

          if (healthRes.status !== 200) throw new Error('서버 응답 이상');

          const serialNumber = 'BOARD123'; // 실제 보드 시리얼로 교체 가능

          console.log('✅ 보드 연결 확인 중...');
          const checkRes = await api.post('/api/cpr/check-connection', { serialNumber });
          console.log('🔌 보드 연결 응답:', checkRes.status);

          console.log('✅ 실시간 통신 시작 요청 중...');
          const startRes = await api.post('/api/cpr/start-communication', { serialNumber });
          console.log('📡 통신 시작 응답:', startRes.status);

          // 모두 성공 시 카운트다운 시작
          setScreen('countdown');
          setCountdown(3);
        } catch (err: any) {
          console.error(
            '❌ startTrainingSequence 오류:',
            err.response?.status,
            err.response?.data || err.message
          );
          setError('서버 또는 장비 연결에 실패했습니다.\n잠시 후 다시 시도해주세요.');
          setScreen('error');
        }
      };

      startTrainingSequence();
    }
  }, [screen]);

  // countdown 처리
  useEffect(() => {
    if (screen === 'countdown') {
      if (countdown > 0) {
        countdownTimer.current = setTimeout(() => {
          setCountdown(prev => prev - 1);
        }, 1000);
      } else if (countdown === 0) {
        console.log('🚀 카운트다운 완료 → training 화면으로 전환');
        setScreen('training');
      }
    }

    return () => {
      if (countdownTimer.current) {
        clearTimeout(countdownTimer.current);
        countdownTimer.current = null;
      }
    };
  }, [screen, countdown]);

  // training 처리 — 3분(180초)이 되면 멈추도록
  useEffect(() => {
    if (screen === 'training') {
      // 초기화(혹시 이전에 남아있다면)
      if (trainingTimer.current) {
        clearInterval(trainingTimer.current);
        trainingTimer.current = null;
      }

      trainingTimer.current = setInterval(() => {
        setTrainingTime(prev => {
          const next = prev + 1;
          if (next >= MAX_TRAINING_SECONDS) {
            // 3분 도달 시 타이머 정지 및 피드백 변경
            if (trainingTimer.current) {
              clearInterval(trainingTimer.current);
              trainingTimer.current = null;
            }
            setFeedback('훈련이 종료되었습니다. 잘하셨어요!');
            return MAX_TRAINING_SECONDS; // 정확히 180으로 고정
          }
          return next;
        });
      }, 1000);
    }

    return () => {
      if (trainingTimer.current) {
        clearInterval(trainingTimer.current);
        trainingTimer.current = null;
      }
    };
  }, [screen]);

  // 재시도
  const handleRetry = () => {
    setError(null);
    setCountdown(3);
    setTrainingTime(0);
    setFeedback('정확한 자세로 압박을 시작하세요.');
    setScreen('loading');
  };

  const formatTime = (seconds: number) => {
    const mm = Math.floor(seconds / 60).toString().padStart(2, '0');
    const ss = (seconds % 60).toString().padStart(2, '0');
    return `${mm}:${ss}`;
  };

  const renderTrainingScreen = () => (
    <SafeAreaView style={styles.trainingContainer}>
      {/* onBackPress 제거 */}
      <TrainingSidebar formattedTime={formatTime(trainingTime)} />
      <View style={styles.mainContent}>
        <Text style={styles.title}>가슴압박</Text>
        <Text style={styles.subtitle}>일정한 간격으로 알맞은 깊이를 눌러주세요.</Text>
        <Text style={styles.instructionText}>튀어나온 부분을 눌러주세요.</Text>
        <View style={styles.contentRow}>
          <View style={styles.feedbackContainer}>
            <Text style={styles.feedbackTitle}>피드백</Text>
            <Text style={styles.feedbackText}>{feedback}</Text>
          </View>
          <View style={styles.imagePlaceholder}>
            <Text style={styles.placeholderText}>{/* 이미지 자리 */}</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );

  const renderScreen = () => {
    switch (screen) {
      case 'loading':
        return <LoadingScreen />;
      case 'countdown':
        return <CountdownScreen countdown={countdown} />;
      case 'training':
        return renderTrainingScreen();
      case 'error':
        return <ErrorScreen errorMessage={error ?? '알 수 없는 오류'} onRetry={handleRetry} />;
      default:
        return <LoadingScreen />;
    }
  };

  return <View style={{ flex: 1 }}>{renderScreen()}</View>;
};

const styles = StyleSheet.create({
  trainingContainer: { flex: 1, flexDirection: 'row', backgroundColor: '#FFFFFF' },
  mainContent: { flex: 1, padding: 40 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#FF7F50', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#666666', marginBottom: 10 },
  instructionText: { fontSize: 16, color: '#666666', marginBottom: 30, fontWeight: 'bold' },
  contentRow: { flex: 1, flexDirection: 'row', gap: 20 },
  feedbackContainer: {
    flex: 1,
    backgroundColor: '#FFE5D9',
    borderRadius: 15,
    padding: 20,
    justifyContent: 'center',
  },
  feedbackTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    position: 'absolute',
    top: 20,
    left: 20,
  },
  feedbackText: { fontSize: 18, color: '#333333', textAlign: 'center' },
  imagePlaceholder: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
  },
  placeholderText: { color: '#AAAAAA', fontSize: 16 },
});

export default TrainingFlowScreen;
