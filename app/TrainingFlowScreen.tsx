// src/screens/TrainingFlowScreen.tsx
import axios, { isCancel } from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

// --- 분리된 컴포넌트들 불러오기 ---
import CountdownScreen from '../components/CountdownScreen';
import ErrorScreen from '../components/ErrorScreen';
import LoadingScreen from '../components/LoadingScreen';
import TrainingSidebar from '../components/TrainingSidebar';

// --- 설정 ---
const BASE_URL = 'http://13.209.6.11:8080';

// 1. 스트리밍 API: timeout: 0 유지 (AbortController로 제어)
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 0,
});

// 2. 초기 연결 API: 10초 타임아웃 적용 (로딩 화면 안정성 확보)
const initialApi = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10초 타임아웃
});

type ScreenState = 'loading' | 'countdown' | 'training' | 'error';

const MAX_TRAINING_SECONDS = 180; // 3분 = 180초

const TrainingFlowScreen: React.FC = () => {
  const [screen, setScreen] = useState<ScreenState>('loading');
  const [countdown, setCountdown] = useState<number>(3);
  const [trainingTime, setTrainingTime] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>('정확한 자세로 압박을 시작하세요.');
  const [error, setError] = useState<string | null>(null);

  const countdownTimer = useRef<number | null>(null);
  const trainingTimer = useRef<number | null>(null);

  // 1. 로딩 → 서버 체크 및 통신 시작
  useEffect(() => {
    if (screen !== 'loading') return;

    let mounted = true;

    const startTrainingSequence = async () => {
      try {
        console.log('✅ 서버 상태 확인 중...');
        const healthRes = await initialApi.get('/api/cpr/health');
        console.log('🩺 서버 상태 응답:', healthRes.status);

        if (healthRes.status !== 200) throw new Error('서버 응답 이상');

        const serialNumber = 'BOARD123';

        console.log('✅ 보드 연결 확인 중...');
        const checkRes = await initialApi.post('/api/cpr/check-connection', { serialNumber });
        console.log('🔌 보드 연결 응답:', checkRes.status);

        console.log('✅ 실시간 통신 시작 요청 중...');
        const startRes = await initialApi.post('/api/cpr/start-communication', { serialNumber });
        console.log('📡 통신 시작 응답:', startRes.status);

        if (!mounted) return;
        setCountdown(3);
        setScreen('countdown');
      } catch (err: unknown) {
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

  // 2. 카운트다운 처리
  useEffect(() => {
    if (screen !== 'countdown') return;

    if (countdownTimer.current !== null) {
      clearTimeout(countdownTimer.current);
      countdownTimer.current = null;
    }

    if (countdown > 0) {
      countdownTimer.current = global.setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000) as unknown as number;
    } else {
      setScreen('training');
    }

    return () => {
      if (countdownTimer.current !== null) {
        clearTimeout(countdownTimer.current);
        countdownTimer.current = null;
      }
    };
  }, [screen, countdown]);

  // 3. 트레이닝 처리
  useEffect(() => {
    if (screen !== 'training') return;

    const streamInterval = setInterval(async () => {
      const controller = new AbortController();
      const abortTimer = global.setTimeout(() => controller.abort(), 1000);

      try {
        const res = await api.get('/api/cpr/stream/BOARD123', {
          signal: controller.signal,
        });

        clearTimeout(abortTimer);
        const quality = res?.data?.quality;

        if (quality === 'too_fast') setFeedback('너무 빠릅니다. 속도를 늦춰주세요.');
        else if (quality === 'too_slow') setFeedback('너무 느립니다. 속도를 높여주세요.');
        else if (quality === 'good') setFeedback('좋아요! 이 속도를 유지하세요.');
      } catch (err) {
        clearTimeout(abortTimer);
        if (isCancel(err) || (err as any)?.name === 'AbortError') return;
        console.error('스트림 데이터 수신 오류:', err);
      }
    }, 1000);

    if (trainingTimer.current !== null) {
      clearInterval(trainingTimer.current);
      trainingTimer.current = null;
    }

    trainingTimer.current = global.setInterval(() => {
      setTrainingTime(prev => {
        const next = prev + 1;
        if (next >= MAX_TRAINING_SECONDS) {
          if (trainingTimer.current !== null) {
            clearInterval(trainingTimer.current);
            trainingTimer.current = null;
          }
          clearInterval(streamInterval);
          setFeedback('훈련이 종료되었습니다. 잘하셨어요!');
          return MAX_TRAINING_SECONDS;
        }
        return next;
      });
    }, 1000) as unknown as number;

    return () => {
      clearInterval(streamInterval);
      if (trainingTimer.current !== null) {
        clearInterval(trainingTimer.current);
        trainingTimer.current = null;
      }
    };
  }, [screen]);

  const handleRetry = () => {
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
          <View style={styles.imagePlaceholder} />
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
  contentRow: { flex: 1, flexDirection: 'row' },
  feedbackContainer: {
    flex: 1,
    backgroundColor: '#FFE5D9',
    borderRadius: 15,
    padding: 20,
    justifyContent: 'center',
    marginRight: 20,
  },
  feedbackTitle: { fontSize: 16, fontWeight: 'bold', color: '#333333' },
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
