// src/screens/TrainingFlowScreen.tsx

import axios from "axios";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { WebView } from "react-native-webview";

import CountdownScreen from "../components/CountdownScreen";
import ErrorScreen from "../components/ErrorScreen";
import LoadingScreen from "../components/LoadingScreen";
import TrainingSidebar from "../components/TrainingSidebar";

const CONFIG = {
  BASE_URL: "http://13.209.6.11:8080",
  SERIAL_NUMBER: "BOARD123",
  TIMEOUT: 10000,
  COUNTDOWN_SECONDS: 3,
  MAX_TRAINING_SECONDS: 180,
  TIMER_INTERVAL: 1000,
} as const;

const apiClient = axios.create({
  baseURL: CONFIG.BASE_URL,
  timeout: CONFIG.TIMEOUT,
  headers: { "Content-Type": "application/json" },
});

type AppState = "loading" | "countdown" | "training" | "error";
type QualityType = "good" | "too_slow" | "too_fast" | "too_shallow";

interface StreamData {
  pressure: number;
  compressionRate: number;
  quality: QualityType;
  timestamp: number;
}

const TrainingFlowScreen: React.FC = () => {
  const [appState, setAppState] = useState<AppState>("loading");
  const [countdown, setCountdown] = useState<number>(CONFIG.COUNTDOWN_SECONDS);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [feedbackMessage, setFeedbackMessage] =
    useState<string>("정확한 자세로 압박을 시작하세요.");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [lastStreamData, setLastStreamData] = useState<StreamData | null>(null);

  const countdownTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const trainingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isMountedRef = useRef<boolean>(true);

  // 피드백 업데이트
  const updateFeedback = useCallback(
    (quality: QualityType, pressure: number) => {
      let newMessage = "";
      if (pressure < 10) {
        newMessage = "정확한 자세로 압박을 시작하세요.";
      } else {
        switch (quality) {
          case "too_fast":
            newMessage = "너무 빠릅니다. 속도를 늦춰주세요.";
            break;
          case "too_slow":
            newMessage = "너무 느립니다. 속도를 높여주세요.";
            break;
          case "too_shallow":
            newMessage = "너무 얕습니다. 더 깊게 눌러주세요.";
            break;
          case "good":
            newMessage = "좋아요! 이 속도를 유지하세요.";
            break;
          default:
            newMessage = "정확한 자세로 압박을 계속하세요.";
            break;
        }
      }
      console.log(`✅ 피드백 업데이트: "${newMessage}"`);
      setFeedbackMessage(newMessage);
    },
    []
  );

  // 서버 헬스체크
  const checkServerHealth = async (): Promise<boolean> => {
    console.log("🔍 서버 헬스체크 시작...");
    try {
      const response = await apiClient.get("/api/cpr/health");
      console.log("✅ 서버 헬스체크 성공");
      return response.status === 200;
    } catch (error) {
      console.error("❌ 서버 헬스체크 실패:", error);
      throw new Error("서버에 연결할 수 없습니다.");
    }
  };

  // 보드 연결 확인
  const checkBoardConnection = async (): Promise<boolean> => {
    console.log("🔍 보드 연결 확인 중...");
    try {
      const response = await apiClient.post("/api/cpr/check-connection", {
        serialNumber: CONFIG.SERIAL_NUMBER,
      });
      console.log("📡 보드 연결 응답:", response.data);
      if (response.data.connected === true) {
        console.log("✅ 보드 연결 확인 완료");
        return true;
      }
      throw new Error(response.data.message || "보드 연결에 실패했습니다.");
    } catch (error: any) {
      console.error("❌ 보드 연결 실패:", error);
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "보드 연결에 실패했습니다."
      );
    }
  };

  // 통신 시작
  const startCommunication = async (): Promise<boolean> => {
    console.log("🚀 실시간 통신 시작 요청...");
    try {
      const response = await apiClient.post("/api/cpr/start-communication", {
        serialNumber: CONFIG.SERIAL_NUMBER,
      });
      console.log("📡 통신 시작 응답:", response.data);
      if (response.data.success === true) {
        console.log("✅ 실시간 통신 시작 성공");
        return true;
      }
      throw new Error(response.data.message || "통신 시작에 실패했습니다.");
    } catch (error: any) {
      console.error("❌ 통신 시작 실패:", error);
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "통신 시작에 실패했습니다."
      );
    }
  };

  // 통신 중단
  const stopCommunication = async (): Promise<void> => {
    console.log("🛑 통신 중단 요청...");
    try {
      const response = await apiClient.post("/api/cpr/stop-communication", {
        serialNumber: CONFIG.SERIAL_NUMBER,
      });
      console.log("📡 통신 중단 응답:", response.data);
      if (response.data.success === true) {
        console.log("✅ 통신 중단 성공");
      } else {
        console.warn("⚠️ 통신 중단 실패:", response.data.message);
      }
    } catch (error: any) {
      console.error("❌ 통신 중단 실패:", error);
    }
  };

  // 정리
  const clearAllTimers = useCallback(() => {
    if (countdownTimerRef.current) {
      clearTimeout(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    if (trainingTimerRef.current) {
      clearInterval(trainingTimerRef.current);
      trainingTimerRef.current = null;
    }
  }, []);

  // 초기화
  const initializeTraining = useCallback(async () => {
    if (!isMountedRef.current) return;

    console.log("🎬 트레이닝 초기화 시작");

    try {
      await checkServerHealth();
      if (!isMountedRef.current) return;

      await checkBoardConnection();
      if (!isMountedRef.current) return;

      await startCommunication();
      if (!isMountedRef.current) return;

      console.log("✅ 초기화 완료, 카운트다운 시작");
      setAppState("countdown");
    } catch (error: any) {
      console.error("❌ 초기화 실패:", error);
      if (!isMountedRef.current) return;

      setErrorMessage(error.message || "서버 또는 장비 연결에 실패했습니다.");
      setAppState("error");
    }
  }, []);

  // 카운트다운
  useEffect(() => {
    if (appState !== "countdown") return;

    console.log(`⏱️ 카운트다운: ${countdown}`);

    if (countdown > 0) {
      countdownTimerRef.current = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else {
      console.log("🏁 카운트다운 종료, 트레이닝 시작");
      setAppState("training");
    }

    return () => {
      if (countdownTimerRef.current) clearTimeout(countdownTimerRef.current);
    };
  }, [appState, countdown]);

  // 트레이닝
  useEffect(() => {
    if (appState !== "training") return;

    console.log("🏃 트레이닝 모드 시작");
    console.log(
      "🌐 SSE 스트림 URL:",
      `${CONFIG.BASE_URL}/api/cpr/stream/${CONFIG.SERIAL_NUMBER}`
    );

    trainingTimerRef.current = setInterval(() => {
      setElapsedTime((prev) => {
        const next = prev + 1;
        if (next >= CONFIG.MAX_TRAINING_SECONDS) {
          console.log("⏰ 트레이닝 시간 종료 (3분)");
          clearAllTimers();
          stopCommunication();
          setFeedbackMessage("훈련이 종료되었습니다. 잘하셨어요!");
          return CONFIG.MAX_TRAINING_SECONDS;
        }
        return next;
      });
    }, CONFIG.TIMER_INTERVAL);

    return () => {
      clearAllTimers();
    };
  }, [appState, clearAllTimers]);

  // 로딩 상태
  useEffect(() => {
    if (appState !== "loading") return;
    initializeTraining();
  }, [appState, initializeTraining]);

  // 언마운트
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      clearAllTimers();
      stopCommunication();
    };
  }, [clearAllTimers]);

  // WebView 메시지 핸들러
  const handleWebViewMessage = useCallback(
    (event: any) => {
      try {
        const txt = event?.nativeEvent?.data;
        if (!txt) return;

        console.log("📩 [WebView] 수신:", txt);
        const msg = JSON.parse(txt);

        if (msg.type === "connected") {
          console.log("✅ [WebView] SSE 연결 완료");
          return;
        }

        if (msg.type === "data") {
          const data = msg.payload;
          console.log("📦 [WebView] 데이터:", JSON.stringify(data));

          // 필드 추출
          const pressure = Number(data.pressure) || 0;
          const compressionRate = Math.round(Number(data.compressionRate) || 0);
          const quality = String(data.quality || "")
            .toLowerCase()
            .trim();
          const timestamp = Number(data.timestamp) || Date.now();

          // quality 검증
          if (
            !["good", "too_slow", "too_fast", "too_shallow"].includes(quality)
          ) {
            console.warn("⚠️ [WebView] 잘못된 quality:", quality);
            return;
          }

          const normalized: StreamData = {
            pressure,
            compressionRate,
            quality: quality as QualityType,
            timestamp,
          };

          console.log("✅ [WebView] 정규화 완료:", JSON.stringify(normalized));
          setLastStreamData(normalized);
          updateFeedback(normalized.quality, normalized.pressure);
        }

        if (msg.type === "error") {
          console.error("❌ [WebView] 에러:", msg.payload);
        }
      } catch (e) {
        console.error("❌ [WebView] 파싱 오류:", e);
      }
    },
    [updateFeedback]
  );

  // WebView HTML - SSE 스트림 수신
  const sseHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body>
<script>
(function() {
  var url = "${CONFIG.BASE_URL}/api/cpr/stream/${CONFIG.SERIAL_NUMBER}";
  var es = null;
  var reconnectTimer = null;
  var messageCount = 0;

  console.log("🚀 [SSE] 초기화:", url);

  function sendToRN(type, payload) {
    try {
      var msg = JSON.stringify({ type: type, payload: payload });
      window.ReactNativeWebView.postMessage(msg);
      console.log("✅ [SSE] RN 전송:", type, payload);
    } catch (e) {
      console.error("❌ [SSE] RN 전송 실패:", e);
    }
  }

  function connect() {
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }

    try {
      console.log("🔌 [SSE] 연결 시도...");
      es = new EventSource(url);

      es.onopen = function() {
        console.log("✅ [SSE] 연결 성공");
        sendToRN("connected", { url: url, time: Date.now() });
      };

      es.onmessage = function(event) {
        messageCount++;
        console.log("📨 [SSE] 기본 메시지 #" + messageCount + ":", event.data);
        sendToRN("raw_message", { data: event.data, count: messageCount });

        try {
          var data = JSON.parse(event.data);
          console.log("📦 [SSE] 파싱 성공:", JSON.stringify(data));
          sendToRN("data", data);
        } catch (e) {
          console.warn("⚠️ [SSE] JSON 파싱 실패:", event.data);
        }
      };

      // sensor-data 이벤트 리스너
      es.addEventListener("sensor-data", function(event) {
        messageCount++;
        console.log("📨 [SSE] sensor-data #" + messageCount + ":", event.data);
        sendToRN("raw_sensor_data", { data: event.data, count: messageCount });

        try {
          var data = JSON.parse(event.data);
          console.log("📦 [SSE] sensor-data 파싱:", JSON.stringify(data));
          sendToRN("data", data);
        } catch (e) {
          console.warn("⚠️ [SSE] sensor-data 파싱 실패:", event.data);
        }
      });

      // connected 이벤트 리스너
      es.addEventListener("connected", function(event) {
        console.log("📨 [SSE] connected 이벤트:", event.data);
        sendToRN("server_connected", { data: event.data });
      });

      es.onerror = function(error) {
        console.error("❌ [SSE] 에러 발생");
        sendToRN("error", { message: "SSE connection error", count: messageCount });
        
        try {
          es.close();
        } catch (e) {}

        console.log("🔄 [SSE] 3초 후 재연결...");
        reconnectTimer = setTimeout(connect, 3000);
      };

    } catch (e) {
      console.error("❌ [SSE] 연결 예외:", e);
      sendToRN("error", { message: "Connection exception: " + e.message });
      reconnectTimer = setTimeout(connect, 3000);
    }
  }

  // 5초마다 상태 로깅
  setInterval(function() {
    console.log("📊 [SSE] 상태 체크 - 총 " + messageCount + "개 메시지 수신");
    sendToRN("status", { messageCount: messageCount, time: Date.now() });
  }, 5000);

  connect();
})();
</script>
</body>
</html>
`;

  // 시간 포맷
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${minutes}:${secs}`;
  };

  // 재시도
  const handleRetry = useCallback(async () => {
    console.log("🔄 재시도 시작");
    clearAllTimers();
    try {
      await stopCommunication();
    } catch {}
    setErrorMessage("");
    setCountdown(CONFIG.COUNTDOWN_SECONDS);
    setElapsedTime(0);
    setFeedbackMessage("정확한 자세로 압박을 시작하세요.");
    setLastStreamData(null);
    setAppState("loading");
  }, [clearAllTimers]);

  // UI 렌더링
  const renderTrainingScreen = () => (
    <SafeAreaView style={styles.container}>
      <TrainingSidebar formattedTime={formatTime(elapsedTime)} />
      <View style={styles.mainContent}>
        <Text style={styles.title}>가슴압박</Text>
        <Text style={styles.subtitle}>
          일정한 간격으로 알맞은 깊이를 눌러주세요.
        </Text>
        <Text style={styles.instruction}>튀어나온 부분을 눌러주세요.</Text>
        <View style={styles.contentRow}>
          <View style={styles.feedbackBox}>
            <Text style={styles.feedbackTitle}>피드백</Text>
            <Text style={styles.feedbackText}>{feedbackMessage}</Text>

            {__DEV__ && lastStreamData && (
              <View style={styles.debugInfo}>
                <Text style={styles.debugText}>
                  압력: {lastStreamData.pressure.toFixed(1)}
                </Text>
                <Text style={styles.debugText}>
                  속도: {lastStreamData.compressionRate} bpm
                </Text>
                <Text style={styles.debugText}>
                  품질: {lastStreamData.quality}
                </Text>
              </View>
            )}
          </View>
          <View style={styles.imagePlaceholder} />
        </View>

        {/* SSE 스트림 수신용 WebView */}
        <WebView
          originWhitelist={["*"]}
          source={{ html: sseHtml }}
          onMessage={handleWebViewMessage}
          javaScriptEnabled={true}
          domStorageEnabled={false}
          style={{ width: 0, height: 0, opacity: 0, position: "absolute" }}
          onError={(e) => console.error("❌ [WV] 에러:", e.nativeEvent)}
          onHttpError={(e) =>
            console.error("❌ [WV] HTTP 에러:", e.nativeEvent)
          }
        />
      </View>
    </SafeAreaView>
  );

  const renderScreen = () => {
    switch (appState) {
      case "loading":
        return <LoadingScreen />;
      case "countdown":
        return <CountdownScreen countdown={countdown} />;
      case "training":
        return renderTrainingScreen();
      case "error":
        return (
          <ErrorScreen
            errorMessage={errorMessage || "알 수 없는 오류가 발생했습니다."}
            onRetry={handleRetry}
          />
        );
      default:
        return <LoadingScreen />;
    }
  };

  return <View style={styles.root}>{renderScreen()}</View>;
};

const styles = StyleSheet.create({
  root: { flex: 1 },
  container: { flex: 1, flexDirection: "row", backgroundColor: "#FFFFFF" },
  mainContent: { flex: 1, padding: 40 },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FF7F50",
    marginBottom: 8,
  },
  subtitle: { fontSize: 16, color: "#666666", marginBottom: 10 },
  instruction: {
    fontSize: 16,
    color: "#666666",
    marginBottom: 30,
    fontWeight: "bold",
  },
  contentRow: { flex: 1, flexDirection: "row" },
  feedbackBox: {
    flex: 1,
    backgroundColor: "#FFE5D9",
    borderRadius: 15,
    padding: 20,
    justifyContent: "center",
    marginRight: 20,
  },
  feedbackTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 10,
  },
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
  debugInfo: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#FFD0C0",
  },
  debugText: { fontSize: 12, color: "#666666", marginBottom: 4 },
});

export default TrainingFlowScreen;
