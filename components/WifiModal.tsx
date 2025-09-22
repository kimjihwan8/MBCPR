import axios from 'axios';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  PermissionsAndroid,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import WifiManager from 'react-native-wifi-reborn';

interface Props {
  onClose: () => void;
}



export default function WifiModal({ onClose }: Props) {
  const [step, setStep] = useState<'idle' | 'scanning' | 'wifiFound' | 'inputCredentials' | 'connecting' | 'connected' | 'error'>('idle');
  const [networks, setNetworks] = useState<string[]>([]);
  const [selectedNetwork, setSelectedNetwork] = useState<string | null>(null);
  const [ssid, setSsid] = useState('');
  const [password, setPassword] = useState('');

  const { width } = useWindowDimensions();

useEffect(() => {
    // step이 'scanning'일 때만 아래 로직을 실행합니다.
    if (step === 'scanning') {
      const checkBoardConnection = async () => {
        try {
          // true 조건: API 호출이 성공하면 연결된 것으로 판단
          console.log("API 요청: 서버-보드 연결 상태를 확인합니다...");
          await api.get('/RealTime/board/checkConnection');

          // 성공 시 'connected' 단계로 전환 (true)
          console.log("연결 확인 성공 (true). 'connected' 단계로 이동합니다.");
          setStep('connected');

        } catch (error) {
          // false 조건: API 호출이 실패하면 연결되지 않은 것으로 판단
          console.log("연결 확인 실패 (false). 'wifiFound' 단계로 이동합니다.");
          setStep('wifiFound'); // WiFi 목록을 보여주는 단계로 이동
        }
      };

      checkBoardConnection();
    }
  }, [step]);

  const connectedWifi = async () => {
      const hasPermission = await requestWifiPermissions();
    if (!hasPermission) {
      Alert.alert("권한 필요", "WiFi 연결 권한이 필요합니다.");
      return;
    } 
    try {
      await (WifiManager as any).connectToProtectedSSID("MY_ESP32_AP", "password123", false, false);
      Alert.alert("성공, 보드 와이파이에 연결되었습니다.");
      setStep("scanning");
    } catch (error: any) {
      console.log("WiFi 연결 실패:", error);
    }
  }

  const disconnectWifi = async () => {
    try {
      await WifiManager.disconnect();
      console.log("WiFi 연결 끊기 성공");
    } catch (error) {
      console.log("WiFi 연결 끊기 실패:", error);
    }
  };

  const handleSubmit = async (ssid: string, password: string) => {
    try {
      const url = `http://192.168.4.1/connect?ssid=${encodeURIComponent(ssid)}&password=${encodeURIComponent(password)}`;
      const response = await axios.get(url);

        // ESP32 서버는 성공 시 "Success" 문자열 반환
      if (response.data === "Success") {
        Alert.alert("연결 성공", "WiFi에 연결되었습니다.");
        disconnectWifi()
        setStep("connected"); // 연결 성공 상태로 변경
      } else {
        Alert.alert("연결 실패", "WiFi 연결에 실패했습니다.");
        // setStep("error");
      }
    } catch (error) {
      console.error('wifi연결 실패:', error);
      Alert.alert(`wifi연결에 실패했습니다. 오류:${error}`);
    }
  };


  // 🔑 권한 요청 함수 분리
  const requestWifiPermissions = async () => {
    if (Platform.OS !== "android") return true;

    try {
      if (Platform.Version >= 33) {
        // Android 13 (API 33) 이상 → 위치 + NEARBY_WIFI_DEVICES 필요
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.NEARBY_WIFI_DEVICES,
        ]);

        const fineGranted =
          granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] ===
          PermissionsAndroid.RESULTS.GRANTED;
        const nearbyGranted =
          granted[PermissionsAndroid.PERMISSIONS.NEARBY_WIFI_DEVICES] ===
          PermissionsAndroid.RESULTS.GRANTED;

        return fineGranted && nearbyGranted;
      } else if (Platform.Version >= 29) {
        // Android 10(API 29) 이상 → 위치 권한 2개 + 백그라운드 권한
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
          PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
        ]);

        return (
          granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          granted[PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION] ===
            PermissionsAndroid.RESULTS.GRANTED
        );
      } else {
        // Android 9 이하
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        ]);

        return (
          granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          granted[PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION] ===
            PermissionsAndroid.RESULTS.GRANTED
        );
      }
    } catch (err) {
      console.warn("권한 요청 실패:", err);
      return false;
    }
  };


  // WiFi 검색
  // WifiModal.tsx 권한 요청 부분 최소 수정
  useEffect(() => {
    if (step === "scanning") {
      const connectAndFetch = async () => {
        if (Platform.OS === "ios") {
          Alert.alert(
            "알림",
            "iOS에서는 앱에서 WiFi를 직접 연결할 수 없습니다.\n설정에서 Wi-Fi를 선택해주세요."
          );
          setStep("idle");
          return;
        }

        try {
          // ✅ 최신 버전 대응 권한 요청
          const hasPermission = await requestWifiPermissions();
          if (!hasPermission) {
            Alert.alert("권한 필요", "WiFi 검색을 위해 권한이 필요합니다.");
            setStep("idle");
            return;
          }

          // ✅ 주변 WiFi 목록 불러오기
          const wifiList = await WifiManager.loadWifiList();
          // @ts-ignore
          const ssidList = wifiList.map((w: any) => w.SSID).filter(Boolean);
          setNetworks(ssidList);
          setStep("wifiFound");
        } catch (err: any) {
          console.log("WiFi 스캔 실패:", err);
          Alert.alert("오류", "WiFi 목록을 불러오지 못했습니다.");
          setStep("error");
        }
      };

      connectAndFetch();
    }
  }, [step]);

  // UI 렌더링
  const renderContent = () => {
    switch (step) {
      case 'idle':
        return (
          <>
            <Text style={styles.title}>WiFi 연결</Text>
            <Pressable style={styles.button} onPress={() => {
                connectedWifi()
              }}>
              <Text style={styles.buttonText}>보드 검색</Text>
            </Pressable>
          </>
        );
      case 'scanning':
        return (
          <>
            <Text style={styles.title}>보드와 연결 상태 확인 중...</Text>
            <ActivityIndicator size="large" color="#FF7F50" style={{ marginTop: 20 }} />
          </>
        );
      case 'wifiFound':
        return (
          <>
            <Text style={styles.title}>주변 WiFi를 찾았습니다</Text>
            {networks.length === 0 ? (
              <Text>주변 WiFi를 찾을 수 없습니다.</Text>
            ) : (
              <ScrollView style={{ maxHeight: 280, width: '100%' }}>
              {
                networks.map((n, index) => (
                  <Pressable
                    key={index} // index를 붙여 고유 key 생성
                    style={[styles.networkItem, selectedNetwork === n && styles.selectedNetwork]}
                    onPress={() => {
                      setSelectedNetwork(n);
                      setSsid(n);
                      setStep('inputCredentials');
                    }}
                  >
                    <Text style={selectedNetwork === n ? styles.selectedText : styles.networkText}>
                      {n}
                    </Text>
                  </Pressable>
                ))}
                </ScrollView>
              )}
          </>
        );
      case 'inputCredentials':
        return (
          <>
            <Text style={styles.title}>WiFi 정보 입력</Text>
            <TextInput
              placeholder="SSID"
              placeholderTextColor="gray"
              style={styles.input}
              value={ssid}
              onChangeText={setSsid}
            />
            <TextInput
              placeholder="비밀번호"
              placeholderTextColor="gray"
              style={styles.input}
              secureTextEntry={true}
              value={password}
              onChangeText={setPassword}
              // keyboardType="phone-pad"
              />
            <Pressable style={styles.button} onPress={()=>{
                // connectWifi()
                if (ssid.trim() !== "" && password.trim() !== "") {
                  console.log(ssid);
                  console.log(password);
                  handleSubmit(ssid, password)
                  setPassword('');
                  setSsid('');
                } else {
                  alert("아이디와 비밀번호를 모두 입력해주세요.");
                  return;
                }
              }}>
              <Text style={styles.buttonText}>연결</Text>
            </Pressable>
          </>
        );
      case 'connecting':
        return (
          <>
            <Text style={styles.title}>서버와 연결 중...</Text>
            <ActivityIndicator size="large" color="#FF7F50" style={{ marginTop: 20 }} />
          </>
        );
      case 'connected':
        return (
          <>
            <Text style={styles.title}>연결 성공!</Text>
            <Pressable style={styles.button} onPress={onClose}>
              <Text style={styles.buttonText}>확인</Text>
            </Pressable>
          </>
        );
      case 'error':
        return (
          <>
            <Text style={styles.title}>연결 실패, 다시 시도하세요</Text>
            <Pressable style={styles.button} onPress={() => setStep('wifiFound')}>
              <Text style={styles.buttonText}>다시 선택</Text>
            </Pressable>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.overlay}>
      <Pressable style={styles.background} onPress={onClose} />
      <View style={[styles.modalBox, { width: width * 0.85, maxWidth: 400 }]}>
        {renderContent()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalBox: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    zIndex: 2100,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  button: {
    marginTop: 16,
    backgroundColor: '#FF7F50',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  networkItem: {
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#f0f0f0',
  },
  selectedNetwork: {
    backgroundColor: '#FF7F50',
  },
  networkText: {
    fontSize: 16,
    color: '#333',
  },
  selectedText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    color: 'black',
    borderRadius: 8,
    marginBottom: 12,
  },
});
