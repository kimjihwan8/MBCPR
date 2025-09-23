import React from 'react';

/**
 * 로딩 UI를 담당하는 재사용 가능한 컴포넌트
 * (웹 미리보기 환경 호환성을 위해 표준 HTML 태그로 변환)
 */
const LoadingScreen = () => {
  return (
    <div style={styles.centerContainer}>
      <p style={styles.loadingText}>서버에 연결 중입니다...</p>
      {/* CSS로 구현한 ActivityIndicator */}
      <div style={styles.activityIndicator}></div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

// React Native의 StyleSheet 대신 표준 JavaScript 객체를 사용하여 스타일을 정의합니다.
const styles = {
  centerContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  loadingText: {
    fontSize: '22px',
    color: '#FF7F50',
    fontWeight: 'bold',
  },
  activityIndicator: {
    marginTop: '20px',
    border: '4px solid rgba(255, 127, 80, 0.2)',
    borderLeftColor: '#FF7F50',
    borderRadius: '50%',
    width: '36px',
    height: '36px',
    animation: 'spin 1s linear infinite',
  },
};

export default LoadingScreen;
