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