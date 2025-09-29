import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView } from 'react-native';
import axios from 'axios';

// --- 분리된 컴포넌트들 불러오기 ---
// NOTE: 파일명(대소문자)을 실제 파일과 일치시켜야 합니다.
import LoadingScreen from '../components/LoadingScreen';
import CountdownScreen from '../components/CountdownScreen';
import ErrorScreen from '../components/ErrorScreen';
import TrainingSidebar from '../components/TrainingSidebar';

// --- 설정 ---
const BASE_URL = 'http://YOUR_SERVER_IP:PORT';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
});

const feedbackMap: Record<string, string> = {
  all_ok: '잘하고 있습니다. 이대로 유지하세요',
  rate_slow: '조금 더 빠르게 눌러주세요',
  rate_fast: '너무 빠릅니다. 조금 천천히 눌러주세요',
  depth_weak: '더 세게 눌러주세요',
  depth_strong: '조금 약하게 눌러주세요',
  position_bad: '압박 위치가 잘못되었습니다.',
};

type ScreenState = 'loading' | 'countdown' | 'training' | 'error';

const TrainingFlowScreen: React.FC = () => {
  const [screen, setScreen] = useState<ScreenState>('loading');
  const [countdown, setCountdown] = useState<number>(3);
  const [trainingTime, setTrainingTime] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>('정확한 자세로 압박을 시작하세요.');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // cross-platform-safe timer type
    let timer: ReturnType<typeof setTimeout> | undefined;

    if (screen === 'loading') {
      const startTrainingSequence = async () => {
        try {
          await api.get('/RealTime/board/checkConnection');
          await api.post('/RealTime/start');
          setScreen('countdown');
        } catch (err) {
          setError('장비 연결 또는 서버 시작에 실패했습니다.');
          setScreen('error');
        }
      };
      startTrainingSequence();
    }

    if (screen === 'countdown') {
      if (countdown === 0) {
        setScreen('training');
      } else {
        timer = setTimeout(() => setCountdown(c => c - 1), 1000);
      }
    }

    if (screen === 'training') {
      const trainingTimer = setInterval(() => setTrainingTime(t => t + 1), 1000);
      const pollingTimer = setInterval(async () => {
        try {
          const response = await api.get('/RealTime/data/processed');
          const statusFromServer = String(response.data.status);
          const message = feedbackMap[statusFromServer] || '피드백을 기다리는 중입니다...';
          setFeedback(message);
        } catch (err) {
          setFeedback('서버와 연결이 끊어졌습니다.');
        }
      }, 2000);

      return () => {
        clearInterval(trainingTimer);
        clearInterval(pollingTimer);
        api.post('/RealTime/stop').catch(() => {});
      };
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [screen, countdown]);

  const handleRetry = () => {
    setError(null);
    setCountdown(3);
    setTrainingTime(0);
    setScreen('loading');
  };

  const handleBackPress = () => {
    // 뒤로가기 동작 — 필요에 따라 navigation.goBack() 등으로 바꾸세요
    setScreen('loading');
  };

  const formatTime = (seconds: number) => {
    const mm = Math.floor(seconds / 60).toString().padStart(2, '0');
    const ss = (seconds % 60).toString().padStart(2, '0');
    return `${mm}:${ss}`;
  };

  const renderTrainingScreen = () => (
    <SafeAreaView style={styles.trainingContainer}>
      {/* TrainingSidebar는 formattedTime과 onBackPress를 기대합니다 */}
      <TrainingSidebar formattedTime={formatTime(trainingTime)} onBackPress={handleBackPress} />
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
      case 'loading':
        return <LoadingScreen />;
      case 'countdown':
        // CountdownScreen은 prop 이름이 `countdown` 입니다.
        return <CountdownScreen countdown={countdown} />;
      case 'training':
        return renderTrainingScreen();
      case 'error':
        // ErrorScreen은 `errorMessage: string`을 기대하므로 null 방지
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
  subtitle: { fontSize: 16, color: '#666666', marginBottom: 30 },
  contentRow: { flex: 1, flexDirection: 'row', gap: 20 },
  feedbackContainer: { flex: 1, backgroundColor: '#FFE5D9', borderRadius: 15, padding: 20, justifyContent: 'center' },
  feedbackTitle: { fontSize: 16, fontWeight: 'bold', color: '#333333', position: 'absolute', top: 20, left: 20 },
  feedbackText: { fontSize: 18, color: '#333333', textAlign: 'center' },
  imagePlaceholder: { flex: 1, borderWidth: 2, borderColor: '#E0E0E0', borderStyle: 'dashed', borderRadius: 15, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9F9F9' },
  placeholderText: { color: '#AAAAAA', fontSize: 16 },
});

export default TrainingFlowScreen;
