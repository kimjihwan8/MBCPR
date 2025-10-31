// src/screens/TrainingFlowScreen.tsx
import axios, { isCancel } from "axios";
import React, { useEffect, useState, useRef } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";

// --- 분리된 컴포넌트들 불러오기 ---
import CountdownScreen from "../components/CountdownScreen";
import ErrorScreen from "../components/ErrorScreen";
import LoadingScreen from "../components/LoadingScreen";
import TrainingSidebar from "../components/TrainingSidebar";

// --- 설정 ---
const BASE_URL = "http://13.209.6.11:8080";
const SERIAL_NUMBER = "BOARD123";

// 통합 API: 타임아웃 증가
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000, // 15초로 증가
  headers: {
    'Content-Type': 'application/json',
  },
});

type ScreenState = "loading" | "countdown" | "training" | "error";

const MAX_TRAINING_SECONDS = 180; // 3분 = 180초

const TrainingFlowScreen: React.FC = () => {
  const [screen, setScreen] = useState<ScreenState>("loading");
  const [countdown, setCountdown] = useState<number>(3);
  const [trainingTime, setTrainingTime] = useState<number>(0);
  const [feedback, setFeedback] =
    useState<string>("정확한 자세로 압박을 시작하세요.");
  const [error, setError] = useState<string | null>(null);

  const countdownTimer = useRef<number | null>(null);
  const trainingTimer = useRef<number | null>(null);
  const streamInterval = useRef<number | null>(null);

  // 연결 테스트 함수 추가
  const testConnection = async () => {
    console.log("🧪 === 연결 테스트 시작 ===");
    console.log("📍 BASE_URL:", BASE_URL);
    
    // fetch로 먼저 테스트
    try {
      console.log("🔄 fetch 시도...");
      const response = await fetch(`${BASE_URL}/api/cpr/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log("✅ fetch 성공! 상태:", response.status);
      const data = await response.text();
      console.log("📦 fetch 응답 데이터:", data);
      return true;
    } catch (fetchErr: any) {
      console.error("❌ fetch 실패:", {
        message: fetchErr.message,
        name: fetchErr.name,
        stack: fetchErr.stack?.substring(0, 200),
      });
      return false;
    }
  };

  // 1. 로딩 → 서버 체크 및 통신 시작
  useEffect(() => {
    if (screen !== "loading") return;

    let mounted = true;

    const startTrainingSequence = async () => {
      try {
        // 연결 테스트 먼저 실행
        console.log("🔍 === 초기화 시작 ===");
        const isConnectable = await testConnection();
        
        if (!isConnectable) {
          throw new Error("서버에 연결할 수 없습니다. 네트워크를 확인해주세요.");
        }

        console.log("✅ 서버 상태 확인 중...");
        const healthRes = await api.get("/api/cpr/health");
        console.log("🩺 서버 상태:", healthRes.status);
        console.log("📦 서버 응답 데이터:", healthRes.data);

        if (healthRes.status !== 200) {
          throw new Error("서버 응답 이상");
        }

        console.log("✅ 보드 연결 확인 중...");
        const checkRes = await api.post("/api/cpr/check-connection", {
          serialNumber: SERIAL_NUMBER,
        });
        console.log("🔌 보드 연결 응답:", checkRes.data);

        if (checkRes.data?.connected !== true) {
          console.log("❌ 보드 연결 실패");
          throw new Error(
            checkRes.data?.message || "보드 연결에 실패했습니다."
          );
        }
        console.log("✅ 보드 연결 확인!");

        console.log("✅ 실시간 통신 시작 요청 중...");
        const startRes = await api.post("/api/cpr/start-communication", {
          serialNumber: SERIAL_NUMBER,
        });
        console.log("📡 통신 시작 응답:", startRes.data);

        if (startRes.data?.success !== true) {
          console.log("❌ 통신 시작 실패");
          throw new Error(
            startRes.data?.message || "통신 시작에 실패했습니다."
          );
        }
        console.log("✅ 통신 시작 성공!");

        if (!mounted) return;
        console.log("🎯 모든 연결 완료! 카운트다운 시작");
        setCountdown(3);
        setScreen("countdown");
      } catch (err: unknown) {
        console.error("❌ === 초기화 오류 상세 정보 ===");
        
        const axiosError = err as any;
        
        // 네트워크 에러 상세 로깅
        if (axiosError.message === "Network Error" || axiosError.code === "ECONNABORTED") {
          console.error("🔴 네트워크 에러 발생!");
          console.error("  - 메시지:", axiosError.message);
          console.error("  - 코드:", axiosError.code);
          console.error("  - URL:", axiosError.config?.url);
          console.error("  - 타임아웃:", axiosError.config?.timeout);
        } else {
          console.error("🔴 기타 에러:");
          console.error("  - 상태 코드:", axiosError?.response?.status);
          console.error("  - 응답 데이터:", axiosError?.response?.data);
          console.error("  - 메시지:", axiosError?.message);
        }

        if (!mounted) return;
        
        let errorMessage = "서버 또는 장비 연결에 실패했습니다.";
        
        if (axiosError.message === "Network Error") {
          errorMessage = 
            "네트워크 연결에 실패했습니다.\n\n" +
            "확인사항:\n" +
            "1. 서버가 실행 중인지 확인\n" +
            "2. 방화벽 설정 확인\n" +
            "3. app.json 설정 확인";
        } else if (axiosError.code === "ECONNABORTED") {
          errorMessage = "서버 응답 시간이 초과되었습니다.\n서버 상태를 확인해주세요.";
        } else if (axiosError?.response?.status) {
          errorMessage = `서버 오류 (${axiosError.response.status})\n${axiosError.response.data?.message || "알 수 없는 오류"}`;
        }
        
        setError(errorMessage);
        setScreen("error");
      }
    };

    startTrainingSequence();

    return () => {
      mounted = false;
    };
  }, [screen]);

  // 2. 카운트다운 처리
  useEffect(() => {
    if (screen !== "countdown") return;

    if (countdownTimer.current !== null) {
      clearTimeout(countdownTimer.current);
      countdownTimer.current = null;
    }

    if (countdown > 0) {
      countdownTimer.current = global.setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000) as unknown as number;
    } else {
      console.log("🎯 카운트다운 종료, 트레이닝 시작!");
      setScreen("training");
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
    if (screen !== "training") return;

    console.log("🏃 트레이닝 시작!");

    // 스트림 데이터 폴링 (1초마다)
    streamInterval.current = global.setInterval(async () => {
      const controller = new AbortController();
      const abortTimer = global.setTimeout(() => controller.abort(), 5000); // 5초로 증가

      try {
        const res = await api.get(`/api/cpr/stream/${SERIAL_NUMBER}`, {
          signal: controller.signal,
        });

        clearTimeout(abortTimer);

        console.log("📊 스트림 데이터:", res.data);
        console.log("📊 quality 값:", res?.data?.quality);

        const quality = res?.data?.quality;
        let newFeedback = feedback;

        if (quality === "too_fast") {
          newFeedback = "너무 빠릅니다. 속도를 늦춰주세요.";
        } else if (quality === "too_slow") {
          newFeedback = "너무 느립니다. 속도를 높여주세요.";
        } else if (quality === "good") {
          newFeedback = "좋아요! 이 속도를 유지하세요.";
        } else {
          console.log("⚠️ 예상치 못한 quality:", quality);
          newFeedback = "압박을 계속하세요.";
        }

        console.log("🔄 피드백 업데이트:", newFeedback);
        setFeedback(newFeedback);

      } catch (err) {
        clearTimeout(abortTimer);

        if (isCancel(err) || (err as any)?.name === "AbortError") {
          return;
        }

        console.error("❌ 스트림 데이터 수신 오류:", err);
        setFeedback("데이터 수신 중... 압박을 계속하세요.");
      }
    }, 1000) as unknown as number;

    // 트레이닝 타이머 (1초마다 시간 증가)
    if (trainingTimer.current !== null) {
      clearInterval(trainingTimer.current);
      trainingTimer.current = null;
    }

    trainingTimer.current = global.setInterval(() => {
      setTrainingTime((prev) => {
        const next = prev + 1;

        if (next >= MAX_TRAINING_SECONDS) {
          console.log("⏰ 3분 경과, 훈련 종료!");

          if (trainingTimer.current !== null) {
            clearInterval(trainingTimer.current);
            trainingTimer.current = null;
          }
          if (streamInterval.current !== null) {
            clearInterval(streamInterval.current);
            streamInterval.current = null;
          }

          stopCommunication();

          setFeedback("훈련이 종료되었습니다. 잘하셨어요!");
          return MAX_TRAINING_SECONDS;
        }
        return next;
      });
    }, 1000) as unknown as number;

    return () => {
      if (streamInterval.current !== null) {
        clearInterval(streamInterval.current);
        streamInterval.current = null;
      }
      if (trainingTimer.current !== null) {
        clearInterval(trainingTimer.current);
        trainingTimer.current = null;
      }
    };
  }, [screen]);

  const stopCommunication = async () => {
    try {
      console.log("🛑 통신 중단 요청 중...");
      const res = await api.post("/api/cpr/stop-communication", {
        serialNumber: SERIAL_NUMBER,
      });

      console.log("🛑 통신 중단 응답:", res.data);

      if (res.data?.success === true) {
        console.log("✅ 통신 중단 성공!");
      } else {
        console.log("⚠️ 통신 중단 응답이 예상과 다름:", res.data);
      }
    } catch (err) {
      console.error("❌ 통신 중단 요청 오류:", err);
    }
  };

  const handleRetry = async () => {
    console.log("🔄 재시도 중...");

    if (countdownTimer.current !== null) {
      clearTimeout(countdownTimer.current);
      countdownTimer.current = null;
    }
    if (trainingTimer.current !== null) {
      clearInterval(trainingTimer.current);
      trainingTimer.current = null;
    }
    if (streamInterval.current !== null) {
      clearInterval(streamInterval.current);
      streamInterval.current = null;
    }

    try {
      await stopCommunication();
    } catch (err) {
      console.log("⚠️ 재시도 시 통신 중단 실패 (무시):", err);
    }

    setError(null);
    setCountdown(3);
    setTrainingTime(0);
    setFeedback("정확한 자세로 압박을 시작하세요.");
    setScreen("loading");
  };

  const formatTime = (seconds: number) => {
    const mm = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const ss = (seconds % 60).toString().padStart(2, "0");
    return `${mm}:${ss}`;
  };

  const renderTrainingScreen = () => (
    <SafeAreaView style={styles.trainingContainer}>
      <TrainingSidebar formattedTime={formatTime(trainingTime)} />
      <View style={styles.mainContent}>
        <Text style={styles.title}>가슴압박</Text>
        <Text style={styles.subtitle}>
          일정한 간격으로 알맞은 깊이를 눌러주세요.
        </Text>
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
      case "loading":
        return <LoadingScreen />;
      case "countdown":
        return <CountdownScreen countdown={countdown} />;
      case "training":
        return renderTrainingScreen();
      case "error":
        return (
          <ErrorScreen
            errorMessage={error ?? "알 수 없는 오류"}
            onRetry={handleRetry}
          />
        );
      default:
        return <LoadingScreen />;
    }
  };

  return <View style={{ flex: 1 }}>{renderScreen()}</View>;
};

const styles = StyleSheet.create({
  trainingContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
  },
  mainContent: { flex: 1, padding: 40 },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FF7F50",
    marginBottom: 8,
  },
  subtitle: { fontSize: 16, color: "#666666", marginBottom: 10 },
  instructionText: {
    fontSize: 16,
    color: "#666666",
    marginBottom: 30,
    fontWeight: "bold",
  },
  contentRow: { flex: 1, flexDirection: "row" },
  feedbackContainer: {
    flex: 1,
    backgroundColor: "#FFE5D9",
    borderRadius: 15,
    padding: 20,
    justifyContent: "center",
    marginRight: 20,
  },
  feedbackTitle: { fontSize: 16, fontWeight: "bold", color: "#333333" },
  feedbackText: { fontSize: 18, color: "#333333", textAlign: "center" },
  imagePlaceholder: {
    flex: 1,
    borderWidth: 2,
    borderColor: "#E0E0E0",
    borderStyle: "dashed",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
  },
  placeholderText: { color: "#AAAAAA", fontSize: 16 },
});

export default TrainingFlowScreen;