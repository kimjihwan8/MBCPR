// src/screens/TrainingFlowScreen.tsx
import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

// --- 분리된 컴포넌트들 불러오기 ---
// (프로젝트 구조에 따라 경로가 달라질 수 있으니 실제 위치와 일치시키기)
import CountdownScreen from '../components/CountdownScreen';
import ErrorScreen from '../components/ErrorScreen';
import LoadingScreen from '../components/LoadingScreen';
import TrainingSidebar from '../components/TrainingSidebar';

// --- 설정 ---
// 앱(React Native) 환경에서는 보통 .env 라이브러리(react-native-config 등) 사용.
// 지금은 하드코딩되어 있음. 배포 시에는 환경변수로 바꾸는 것을 권장.
const BASE_URL = 'http://13.209.6.11:8080';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

type ScreenState = 'loading' | 'countdown' | 'training' | 'error';

const MAX_TRAINING_SECONDS = 180; // 3분 = 180초

const TrainingFlowScreen: React.FC = () => {
  const [screen, setScreen] = useState<ScreenState>('loading');
  const [countdown, setCountdown] = useState<number>(3);
  const [trainingTime, setTrainingTime] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>('정확한 자세로 압박을 시작하세요.');
  const [error, setError] = useState<string | null>(null);

  // RN 환경에서 setTimeout/setInterval은 숫자를 반환하므로 number | null 로 명시
  const countdownTimer = useRef<number | null>(null);
  const trainingTimer = useRef<number | null>(null);

  // 1. 로딩 → 서버 체크 및 통신 시작
  useEffect(() => {
    if (screen !== 'loading') return;

    let mounted = true;

    const startTrainingSequence = async () => {
      try {
        console.log('✅ 서버 상태 확인 중...');
        const healthRes = await api.get('/api/cpr/health');
        console.log('🩺 서버 상태 응답:', healthRes.status);

        if (healthRes.status !== 200) throw new Error('서버 응답 이상');

        const serialNumber = 'BOARD123';

        console.log('✅ 보드 연결 확인 중...');
        const checkRes = await api.post('/api/cpr/check-connection', { serialNumber });
        console.log('🔌 보드 연결 응답:', checkRes.status);

        console.log('✅ 실시간 통신 시작 요청 중...');
        const startRes = await api.post('/api/cpr/start-communication', { serialNumber });
        console.log('📡 통신 시작 응답:', startRes.status);

        if (!mounted) return;
        // 모두 성공 시 카운트다운 시작
        setCountdown(3);
        setScreen('countdown');
      } catch (err: unknown) {
        // axios 에러일 경우 구조가 다르므로 안전하게 파싱
        const status = (err as any)?.response?.status ?? null;
        const data = (err as any)?.response?.data ?? (err as any)?.message ?? err;
        console.error('❌ startTrainingSequence 오류:', { status, data });

        if (!mounted) return;
        setError('서버 또는 장비 연결에 실패했습니다.\n잠시 후 다시 시도해주세요.');
        setScreen('error');
      }
    };

    startTrainingSequence();

    return () => {
      mounted = false;
    };
  }, [screen]);

  // countdown 처리
  useEffect(() => {
    // only run when screen === 'countdown'
    if (screen !== 'countdown') return;

    // 안전하게 기존 타이머 제거
    if (countdownTimer.current !== null) {
      clearTimeout(countdownTimer.current);
      countdownTimer.current = null;
    }

    if (countdown > 0) {
      // RN: window.setTimeout 으로 명시하면 TS에서 number 타입 반환으로 명시됨
      countdownTimer.current = global.setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000) as unknown as number;
    } else {
      // countdown === 0
      setScreen('training');
    }

    return () => {
      if (countdownTimer.current !== null) {
        clearTimeout(countdownTimer.current);
        countdownTimer.current = null;
      }
    };
  }, [screen, countdown]);

  // training 처리 — 3분(180초)이 되면 멈추도록 (안전한 클리닝)
  useEffect(() => {
    if (screen !== 'training') return;

    // 초기화
    if (trainingTimer.current !== null) {
      clearInterval(trainingTimer.current);
      trainingTimer.current = null;
    }

    trainingTimer.current = global.setInterval(() => {
      setTrainingTime(prev => {
        const next = prev + 1;
        if (next >= MAX_TRAINING_SECONDS) {
          // 3분 도달 시 타이머 정지 및 피드백 변경
          if (trainingTimer.current !== null) {
            clearInterval(trainingTimer.current);
            trainingTimer.current = null;
          }
          // 피드백 세팅
          setFeedback('훈련이 종료되었습니다. 잘하셨어요!');
          return MAX_TRAINING_SECONDS; // 정확히 180으로 고정
        }
        return next;
      });
    }, 1000) as unknown as number;

    return () => {
      if (trainingTimer.current !== null) {
        clearInterval(trainingTimer.current);
        trainingTimer.current = null;
      }
    };
  }, [screen]);

  // 재시도
  const handleRetry = () => {
    // 기존 타이머 정리
    if (countdownTimer.current !== null) {
      clearTimeout(countdownTimer.current);
      countdownTimer.current = null;
    }
    if (trainingTimer.current !== null) {
      clearInterval(trainingTimer.current);
      trainingTimer.current = null;
    }

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

  // 'gap' 대신 마진으로 처리 — RN 스타일 타입과 런타임 안전을 위해 변경
  contentRow: { flex: 1, flexDirection: 'row' },

  feedbackContainer: {
    flex: 1,
    backgroundColor: '#FFE5D9',
    borderRadius: 15,
    padding: 20,
    justifyContent: 'center',
    marginRight: 20, // gap 대체
  },
  feedbackTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    // position absolute 유지하면 텍스트가 겹칠 수 있으니 삭제해도 됨.
    // position: 'absolute',
    // top: 20,
    // left: 20,
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