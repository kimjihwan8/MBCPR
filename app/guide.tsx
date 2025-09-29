import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';


const { width, height } = Dimensions.get('window')
const router = useRouter();

const GuideScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#FFFFFF', '#ffdbcf', '#ffaa94', '#FF724F', '#FF9E7E', '#FFFFFF']}
        locations={[0.1893, 0.3126, 0.4168, 0.7915, 0.8678, 0.9056]}
        style={styles.background}
      >
        <View style={styles.section}>
          {/* Back Button */}
          <TouchableOpacity style={styles.backButton} onPress={() => router.push("/")}>
            <Text style={styles.backText}>{'<'}</Text>
          </TouchableOpacity>

          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.mainTitle}>반려견 CPR <br/><br/>
              | 당신의 손이 <Text style={{color:'#FF724F'}}>생명</Text>을 살립니다</Text>
              <br/><br/><br/>
            <Text style={styles.subTitle}>
              응급 상황에서 우리 아이를 지키는 가장 중요한 방법, 지금 바로 배워보세요.
            </Text>
          </View>
        </View>
        <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
        {/* Why CPR Section */}
        <Text style={styles.sectionTitle}>왜 반려견 CPR을 배워야 할까요?</Text>
        <View style={styles.section}>
          <View style={styles.div}>
            <Text style={styles.cardTitle}>골든타임 확보</Text>
            <Text style={styles.cardText}>
              갑작스러운 사고는 언제든 일어날 수 있습니다. 골든 타임을 놓치지 마세요.
            </Text>
          </View>
          <View style={styles.card}></View>
        </View>
        <View style={styles.section}>
          <View style={styles.div}>
            <Text style={styles.cardTitle}>뇌 손상 예방</Text>
            <Text style={styles.cardText}>
              심장 압박은 뇌로 혈액을 공급해 뇌사 상태를 막는 데 큰 도움이 됩니다.
            </Text>
          </View>
        </View>
        <View style={styles.section}>
          <View style={styles.div}>
            <Text style={styles.cardTitle}>가족을 위한 첫걸음</Text>
            <Text style={styles.cardText}>
              반려견 CPR은 사랑하는 아이에게 가장 소중한 선물이 될 수 있습니다.
            </Text>
          </View>
        </View>
<br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
        {/* 4-Step CPR Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>반려견 CPR, 4단계로 따라하기</Text>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>준비 | 기도 확보 및 자세</Text>
            <Text style={styles.cardText}>
              먼저, 반려동물의 입을 벌려 털이나 이물질을 제거하고, 목을 곧게 펴 호흡이 잘 가능하게 합니다.
            </Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>실행 | 가슴 압박</Text>
            <Text style={styles.cardText}>
              1초에 2번, 흉부 깊이 1/3~1/4로 30회 압박합니다.
            </Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>실행 | 인공 호흡</Text>
            <Text style={styles.cardText}>
              가슴 압박 30회 후, 코를 들어 올리고 인공호흡 2회 실시합니다.
            </Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>평가 | 반복 및 확인</Text>
            <Text style={styles.cardText}>
              4세트를 진행 후 의식, 호흡, 심장박동을 확인합니다. 변화 없으면 반복.
            </Text>
          </View>
        </View>
        <View>
          <Text>가까운 동물병원 찾기</Text>
          <View>
            <Text>응급 상황 발생 시, CPR과 함께 가까운 동물병원으로 이동하는 것이 가장 중요합니다.
현재 위치를 기준으로 주변 동물병원을 찾아보세요.</Text>
            <View>
              <MapSearch />
              <Text>근처 동물병원 검색</Text>
            </View>
          </View>
        </View>
          <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
        {/* Close Button */}
        <TouchableOpacity style={styles.closeButton}>
          <Text style={styles.closeText}>나가기</Text>
        </TouchableOpacity>
      </LinearGradient>
    </ScrollView>
  );
};

const MapSearch: React.FC = ()=> {
  return (
    <View>
      <MapView
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: 37.541,
          longitude: 126.986,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        // style={styles.map}
      />
      ...
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: { flex: 1, paddingBottom: 50 },
  overlay: {
    paddingHorizontal: 40,
  },
  backButton: {
    position: 'absolute',
    width: 75,
    height: 75,
    left: 45,
    top: 33,
    borderRadius: 100,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  backText: { fontSize: 36, fontWeight: 'bold', color: '#FF724F' },
  titleSection: {
    marginTop: 120,
    paddingHorizontal: 20,
  },
  mainTitle: {
    fontSize: 100,
    fontWeight: '700',
    color: '#000',
    lineHeight: 50,
    marginBottom: 20,
  },

  // subTitle: { fontSize: 24, fontWeight: '700', color: '#000000', marginTop: 10 },
  highlight: {
    color: '#ffc5b3', // 주황색 강조
  },
  subTitle: {
    fontSize: 48,
    color: '#333',
    lineHeight: 25,
    fontWeight: 600,
  },
  section: {
    width: width,
    height: height,
    flexDirection:'row',
    paddingVertical: 40,
    paddingHorizontal: 120,
    backgroundColor: 'linear-gradient(to bottom, #fff, #ffd3c0)', // iOS/Expo에서는 LinearGradient 사용
  },
  sectionTitle: {
    fontSize: 100,
    fontWeight: '700',
    marginBottom: 30,
  },
  cardContainer: {
    flexDirection: 'column', // 세로 정렬
    gap: 20, // 카드 사이 간격 (RN 0.71 이상)
  },
  div: {
    width: '50%',
  },
  card: {
    width: '50%',
    backgroundColor: '#f0f0f0',
    justifyContent:'center',
    alignItems:'center',
    padding: 120,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5, // 안드로이드 그림자
  },
  cardTitle: {
    fontSize: 60,
    fontWeight: '700',
    color: '#FF5A2B', // Figma 오렌지 색상
    marginBottom: 10,
  },
  cardText: {
    fontSize: 48,
    color: '#333',
  },
  closeButton: {
    width: 991,
    height: 122,
    alignSelf: 'center',
    marginTop: 50,
    borderWidth: 3,
    borderColor: '#FF724F',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: { fontSize: 36, fontWeight: '700', color: '#000000' },
});

export default GuideScreen;
