import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions, ActivityIndicator, Alert, Image, } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import MapView, { Marker } from 'react-native-maps';
import { Rect, Svg, Path } from 'react-native-svg';
import * as Location from 'expo-location';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { moderateScale } from 'react-native-size-matters';

const images = {
  1: require('../assets/images/Guide-page/1.png'),
  2: require('../assets/images/Guide-page/2.png'),
  3: require('../assets/images/Guide-page/3.png'),
  4: require('../assets/images/Guide-page/4.png'),
  5: require('../assets/images/Guide-page/5.png'),
  6: require('../assets/images/Guide-page/6.png'),
  7: require('../assets/images/Guide-page/7.png'),
  8: require('../assets/images/Guide-page/8.png'),
  9: require('../assets/images/Guide-page/9.png'),
  10: require('../assets/images/Guide-page/10.png'),
};

const App = ({ a }: { a: keyof typeof images }) => {
  return (
    <>
      <Image 
        source={images[a]} // 프로젝트 내 이미지 경로
        style={{ width: '100%', height: 250, borderRadius: 12}}
        resizeMode="cover" // 'cover', 'stretch', 'center' 등 가능
      />
    </>
  );
};


const GuideScreen = () => {
  const router = useRouter();
    useEffect(() => {
    const { width, height } = Dimensions.get('window');
    console.log('Dimensions:', width, height);

    const testWp = wp('5%');
    const testHp = hp('5%');
    console.log('wp(5%) =', testWp, 'hp(5%) =', testHp);

    // wp/hp가 숫자가 아닌 경우 경고
    if (isNaN(testWp) || isNaN(testHp)) {
      console.warn('wp/hp 계산에서 NaN 발생!');
    }
  }, []);

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#FFFFFF', '#ffd3c4', '#ff7e5e', '#FF724F', '#FF9E7E', '#FFFFFF']}
        locations={[0.0693, 0.2026, 0.3768, 0.5015, 0.8078, 0.9996]}
        style={styles.background}
      >
        <TouchableOpacity style={styles.backButton} onPress={() => router.push("/")}>
          <Text style={styles.backText}>{'<'}</Text>
        </TouchableOpacity>
        <View style={styles.containerss}>
          <View style={styles.section}>
            {/* Back Button */}

            {/* Title Section */}
            <View style={styles.titleSection}>
              <Text style={styles.mainTitle}>
                반려견 CPR {'\n'}
                |당신의 손이 <Text style={{ color: '#FF724F' }}>생명</Text>을 살립니다
              </Text>
              <Text style={styles.subTitle}>
                응급 상황에서 우리 아이를 지키는 가장 중요한 방법, 지금 바로 배워보세요.
              </Text>
            </View>
          </View>

          {/* SVG Logo */}
          <View style={styles.Logo}>
            <Svg width={wp('100%')} height={hp('44%')} viewBox="0 0 1191 527" fill="none">
              {/* 기존 Rect, Path 그대로 */}
              <Rect width="101.886" height="375.854" rx="50.943" transform="matrix(0.912672 0.408693 -0.404786 0.914412 196.141 29.8906)" fill="#FFC2AD"/>
              <Rect width="101.886" height="375.854" rx="50.943" transform="matrix(0.882948 0.469472 -0.465691 0.884948 257.032 123)" fill="#FFC2AD"/>
              <Rect width="101.886" height="375.854" rx="50.943" transform="matrix(0.912672 0.408693 -0.404786 0.914412 414.577 84.4419)" fill="#FFC2AD"/>
              <Rect width="101.886" height="375.854" rx="50.943" transform="matrix(0.912672 0.408693 -0.404786 0.914412 340.279 139.74)" fill="#FFC2AD"/>
              <Rect width="101.954" height="375.606" rx="50.977" transform="matrix(0.846673 0.532114 -0.527727 0.849414 375.211 0)" fill="#FFC2AD"/>
              <Rect width="101.886" height="375.854" rx="50.943" transform="matrix(0.912672 0.408693 -0.404786 0.914412 491.105 84.4419)" fill="#FFC2AD"/>
              <Rect width="101.927" height="375.704" rx="50.9635" transform="matrix(0.873432 0.486946 -0.482677 0.875798 631.755 76.9688)" fill="#FFC2AD"/>
              <Rect width="101.886" height="375.854" rx="50.943" transform="matrix(0.912672 0.408693 -0.404786 0.914412 634.5 157.674)" fill="#FFC2AD"/>
              <Rect width="101.886" height="375.854" rx="50.943" transform="matrix(0.961262 0.275637 -0.271523 0.962432 688.053 143)" fill="#FFC2AD"/>
              <Rect width="101.954" height="375.606" rx="50.977" transform="matrix(0.846673 0.532114 -0.527727 0.849414 545.354 163.652)" fill="#FFC2AD"/>
              <Path d="M252.84 407.78C240.24 407.78 228.45 405.62 217.47 401.3C206.49 396.8 196.77 390.14 188.31 381.32C180.03 372.5 173.46 361.7 168.6 348.92C163.92 336.14 161.58 321.47 161.58 304.91C161.58 288.35 164.01 273.68 168.87 260.9C173.73 247.94 180.39 236.96 188.85 227.96C197.49 218.96 207.39 212.12 218.55 207.44C229.89 202.76 241.86 200.42 254.46 200.42C267.24 200.42 278.58 203.03 288.48 208.25C298.56 213.29 306.75 219.23 313.05 226.07L292.26 251.45C287.22 246.41 281.64 242.36 275.52 239.3C269.58 236.24 262.83 234.71 255.27 234.71C245.19 234.71 236.1 237.5 228 243.08C220.08 248.48 213.87 256.31 209.37 266.57C204.87 276.83 202.62 289.16 202.62 303.56C202.62 318.14 204.69 330.65 208.83 341.09C213.15 351.35 219.18 359.27 226.92 364.85C234.84 370.43 244.02 373.22 254.46 373.22C263.1 373.22 270.75 371.42 277.41 367.82C284.25 364.04 290.28 359.27 295.5 353.51L316.83 378.35C308.55 388.07 299.1 395.45 288.48 400.49C277.86 405.35 265.98 407.78 252.84 407.78ZM348.758 404V203.93H414.368C429.128 203.93 442.358 205.91 454.058 209.87C465.938 213.83 475.298 220.4 482.138 229.58C489.158 238.58 492.668 251 492.668 266.84C492.668 281.96 489.158 294.47 482.138 304.37C475.298 314.09 466.028 321.29 454.328 325.97C442.808 330.65 429.848 332.99 415.448 332.99H388.718V404H348.758ZM388.718 301.4H412.748C426.428 301.4 436.598 298.52 443.258 292.76C450.098 287 453.518 278.36 453.518 266.84C453.518 255.32 449.918 247.31 442.718 242.81C435.698 238.13 425.258 235.79 411.398 235.79H388.718V301.4ZM528.845 404V203.93H598.235C612.455 203.93 625.235 205.82 636.575 209.6C647.915 213.2 656.915 219.5 663.575 228.5C670.235 237.32 673.565 249.38 673.565 264.68C673.565 279.44 670.235 291.59 663.575 301.13C656.915 310.49 647.915 317.42 636.575 321.92C625.235 326.24 612.455 328.4 598.235 328.4H568.805V404H528.845ZM568.805 296.81H594.725C607.685 296.81 617.495 294.11 624.155 288.71C630.995 283.31 634.415 275.3 634.415 264.68C634.415 253.88 630.995 246.41 624.155 242.27C617.495 237.95 607.685 235.79 594.725 235.79H568.805V296.81ZM637.385 404L590.945 318.14L619.025 293.3L682.205 404H637.385ZM836.018 296.608H853.042V415.52H836.018V296.608ZM789.17 304.928C795.229 304.928 800.605 306.677 805.298 310.176C809.992 313.589 813.661 318.496 816.306 324.896C819.037 331.211 820.402 338.677 820.402 347.296C820.402 356 819.037 363.552 816.306 369.952C813.661 376.267 809.992 381.173 805.298 384.672C800.605 388.085 795.229 389.792 789.17 389.792C783.197 389.792 777.864 388.085 773.17 384.672C768.477 381.173 764.765 376.267 762.034 369.952C759.389 363.552 758.066 356 758.066 347.296C758.066 338.677 759.389 331.211 762.034 324.896C764.765 318.496 768.477 313.589 773.17 310.176C777.864 306.677 783.197 304.928 789.17 304.928ZM789.17 320.416C786.269 320.416 783.709 321.44 781.49 323.488C779.272 325.536 777.522 328.565 776.242 332.576C775.048 336.501 774.45 341.408 774.45 347.296C774.45 353.099 775.048 358.048 776.242 362.144C777.522 366.155 779.272 369.184 781.49 371.232C783.709 373.28 786.269 374.304 789.17 374.304C792.157 374.304 794.76 373.28 796.978 371.232C799.197 369.184 800.904 366.155 802.098 362.144C803.378 358.048 804.018 353.099 804.018 347.296C804.018 341.408 803.378 336.501 802.098 332.576C800.904 328.565 799.197 325.536 796.978 323.488C794.76 321.44 792.157 320.416 789.17 320.416ZM948.648 296.864H965.672V384.16H948.648V296.864ZM960.936 330.912H981.416V344.864H960.936V330.912ZM889.768 399.648H970.152V413.344H889.768V399.648ZM889.768 377.12H906.792V404.128H889.768V377.12ZM876.712 353.568H886.696C894.462 353.568 901.374 353.483 907.432 353.312C913.576 353.141 919.251 352.8 924.456 352.288C929.747 351.776 935.123 351.008 940.584 349.984L942.12 363.552C936.659 364.576 931.155 365.387 925.608 365.984C920.147 366.496 914.259 366.837 907.944 367.008C901.715 367.179 894.632 367.264 886.696 367.264H876.712V353.568ZM876.456 304.032H930.6V341.28H893.48V358.56H876.712V328.736H913.832V317.6H876.456V304.032ZM1007.65 371.744C1007.05 367.563 1007.26 363.851 1008.29 360.608C1009.4 357.365 1010.93 354.464 1012.89 351.904C1014.86 349.259 1016.86 346.784 1018.91 344.48C1020.96 342.176 1022.71 339.915 1024.16 337.696C1025.61 335.477 1026.33 333.131 1026.33 330.656C1026.33 328.523 1025.86 326.688 1024.93 325.152C1024.07 323.531 1022.84 322.293 1021.21 321.44C1019.68 320.587 1017.76 320.16 1015.45 320.16C1012.64 320.16 1010.08 320.843 1007.77 322.208C1005.47 323.488 1003.29 325.237 1001.25 327.456L990.75 317.856C994.078 314.016 998.004 310.901 1002.53 308.512C1007.13 306.123 1012.21 304.928 1017.76 304.928C1022.88 304.928 1027.44 305.824 1031.45 307.616C1035.55 309.408 1038.75 312.139 1041.05 315.808C1043.36 319.392 1044.51 323.915 1044.51 329.376C1044.51 333.045 1043.74 336.288 1042.21 339.104C1040.76 341.92 1038.92 344.565 1036.7 347.04C1034.57 349.429 1032.44 351.819 1030.3 354.208C1028.25 356.597 1026.59 359.2 1025.31 362.016C1024.03 364.832 1023.6 368.075 1024.03 371.744H1007.65ZM1015.97 405.792C1012.55 405.792 1009.74 404.597 1007.52 402.208C1005.3 399.819 1004.19 396.917 1004.19 393.504C1004.19 389.92 1005.3 386.976 1007.52 384.672C1009.74 382.368 1012.55 381.216 1015.97 381.216C1019.29 381.216 1022.07 382.368 1024.29 384.672C1026.5 386.976 1027.61 389.92 1027.61 393.504C1027.61 396.917 1026.5 399.819 1024.29 402.208C1022.07 404.597 1019.29 405.792 1015.97 405.792Z" fill="black"/>
            </Svg>
            <Text style={[styles.LogoText, {marginTop:0, paddingTop:0}]}>
              심정지 상태의 아이의 
              {"\n"}<Text style={styles.highlight}>생존 확률</Text>을 높일 수 있는 기법
            </Text>
          </View>

          {/* Why CPR Section */}
          <Text style={styles.sectionTitle}>왜 반려견 CPR을 배워야 할까요?</Text>
          <View style={styles.section}>
            <View style={styles.div}>
              <Text style={styles.cardTitle}>골든타임 확보</Text>
              <Text style={styles.cardText}>
                갑작스러운 사고는 언제든 일어날 수 있습니다. 골든 타임을 놓치지 마세요.
              </Text>
            </View>
            <View style={styles.card}><App a={1}/></View>
          </View>
          <View style={styles.section}>
            <View style={styles.card}><App a={2}/></View>
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
            <View style={styles.card}><App a={3}/></View>
          </View>

          {/* Pre-Info Section */}
          <View style={styles.sections}>
            <Text style={styles.sectionHeader}>시작전 알아두기</Text>
            <Text style={styles.sectionDesc}>
              반려동물 심폐소생술(CPR)은 심정지나 호흡정지 상태에서 반려동물의 생존 확률을 높이는 중요한 기법입니다.
              초기 목격자의 역할에 따라 소생 확률을 현격하게 높일 수 있습니다.
            </Text>
          </View>
          <View style={styles.section}>
            <View style={styles.sideBar} />
            <View style={{ flex: 1, justifyContent: 'flex-end', paddingBottom: hp('5%') }}>
              <Text style={styles.pointText}>
                • 혈액 공급이 약 4분 정도 중단되면 허혈성 손상을 입을 수 있습니다.
                이는 혈류 정체로 인해 장기들이 손상되는 것을 의미합니다.
              </Text>
              <Text style={styles.pointText}>
                • CPR 시작 조건: 반려동물이 의식이 없고, 심장이 뛰지 않으며,
                호흡도 하지 않을 때 즉시 CPR을 시작해야 합니다.
              </Text>
              <Text style={styles.pointText}>
                • 심장은 뛰고 호흡만 없다면 인공호흡만 진행하며,
                가까운 동물병원으로 내원해야 합니다.
              </Text>
            </View>
          </View>

          {/* 4-Step CPR Section */}
          <View style={styles.containers}>
            <Text style={styles.title}>반려견 CPR,{"\n"}4단계로 따라하기</Text>
            <View style={styles.sectionFour}>
              <View style={styles.cards}>
                <View style={styles.cardHeader}>
                  <Text style={styles.stepTitle}><Text style={styles.highlight}>준비</Text> | 기도 확보 및 자세</Text>
                </View>
                <Text style={styles.text}>
                  먼저, 반려동물의 입을 벌려 털이나 <Text style={styles.highlight}>이물질</Text>을 손으로 완전히 제거합니다
                  {'\n\n'}
                  그 뒤, 목을 곧게 펴주고 고개는 아래쪽으로 향하게 하여 침이 넘어가지{'\n'}
                  않고 <Text style={styles.highlight}>호흡을 잘 할 수 있는 자세</Text>를 취해줍니다
                </Text>
                <View style={{marginLeft:100, marginRight:100}}>
                  <App a={4}/>
                </View>
              </View>
            </View>
            <View style={styles.sectionFour}>
              <View style={styles.cards}>
                <View style={styles.cardHeader}>
                  <Text style={styles.stepTitle}><Text style={styles.highlight}>실행</Text> | 인공 호흡</Text>
                </View>
                <Text style={styles.text}>
                  가슴 압박 30회를 완료했다면{"\n"}
                  반려동물의 코를 손으로 들어 올리고 코에 인공호흡을 해줍니다{"\n\n"}
                  이때 입으로 공기가 새는 걸 막기 위해 볼을 입술 안쪽으로 말아 넣은 뒤, 손으로 입을 막습니다{"\n\n"}
                  이 과정을 2회 반복합니다
                </Text>
                <Text style={styles.text}>
                  <Text style={{fontWeight:600, fontSize: 20}}>소형견 및 고양이:</Text>{'\n\n'}
                  • 압박 위치: 팔꿈치를 접어 흉부에 닿는 부분에 엄지손가락을 올리고 나머지 손가락으로 흉곽을 감쌉니다.{'\n\n'}
                  • 압박 자세: 손 크기에 따라 한 손이나 양손을 사용합니다. 흉부 깊이의 1/3에서 1/4 정도 깊이로 충분히 압박합니다.
                  {'\n\n'}
                  <View style={{flex:1, flexDirection: 'column'}}>
                    <Text>
                    • 대상 견종:{'\n'}
                      {'\r\r\r'}• 말티즈{'\n'}
                      {'\r\r\r'}• 치와와{'\n'}
                      {'\r\r\r'}• 그 외 작은 강아지들{'\n'}
                      {'\r\r\r'}• 고양이{'\n'}
                    </Text>
                  </View>
                  <App a={5}/>{'\n\n'}
                  <Text style={styles.highlight}>MBCPR</Text>에서는 소형견 용 가슴 압박 실습을 제공하고 있습니다
                </Text>
                <Text style={styles.text}>
                  <Text style={{fontWeight:600, fontSize: 20}}>흉강이 깊은 견종:</Text>{'\n\n'}
                  • 압박 위치: 팔꿈치를 구부려 흉부에 닿는 부분을 찾은 뒤, 손바닥을 해당 부위에 올립니다.{'\n\n'}
                  • 압박 자세: 사람에게 하는 것처럼 양 손을 모아 깍지를 낀 뒤 팔을 곧게 편 채로 압박합니다.
                  {'\n\n'}
                  <View style={{flex:1, flexDirection: 'column'}}>
                    <Text>
                    • 대상 견종:{'\n'}
                      {'\r\r\r'}• 진돗개{'\n'}
                      {'\r\r\r'}• 도르만{'\n'}
                    </Text>
                  </View>
                  <App a={6}/>{'\n'}
                </Text>
                <Text style={styles.text}>
                  <Text style={{fontWeight:600, fontSize: 20}}>흉강이 동그란 대형견:</Text>{'\n\n'}
                  • 압박 위치: 반려동물을 옆으로 눕혔을 때 흉강에서 가장 높게 솟아 있는 부분에 팔을 올립니다.{'\n\n'}
                  • 압박 자세: 사람에게 하는 것처럼 양 손을 모아 깍지를 낀 뒤 팔을 곧게 편 채로 압박합니다.
                  {'\n\n'}
                  <View style={{flex:1, flexDirection: 'column'}}>
                    <Text>
                    • 대상 견종:{'\n'}
                      {'\r\r\r'}• 래브라도 리트리버{'\n'}
                      {'\r\r\r'}• 로트와일러{'\n'}
                    </Text>
                  </View>
                  <App a={7}/>{'\n'}
                </Text>
                <Text style={styles.text}>
                  <Text style={{fontWeight:600, fontSize: 20}}>흉강이 좌우로 넓은 대형견:</Text>{'\n\n'}
                  • 압박 위치: 복장뼈(갈비뼈가 만나는 중앙 부분)에 손을 올립니다. 사람의 형태와 유사합니다.{'\n\n'}
                  • 압박 자세: 사람에게 하는 것처럼 양 손을 모아 깍지를 낀 뒤 팔을 곧게 편 채로 압박합니다.
                  {'\n\n'}
                  <View style={{flex:1, flexDirection: 'column'}}>
                    <Text>
                    • 대상 견종:{'\n'}
                      {'\r\r\r'}• 핏불{'\n'}
                      {'\r\r\r'}• 퍼그{'\n'}
                    </Text>
                  </View>
                  <App a={8}/>{'\n'}
                </Text>
                <Text style={[styles.text, {fontSize: 20, fontWeight: 600}]}>
                  {'\n'}
                  이제 1초에 2번, 흉부 깊이의 1/3에서 1/4 정도로 압박해줍니다{'\n\n'}
                  이 과정을 30회 반복합니다
                </Text>
              </View>
            </View>
            <View style={styles.sectionFour}>
              <View style={styles.cards}>
                <View style={styles.cardHeader}>
                  <Text style={styles.stepTitle}><Text style={styles.highlight}>실행</Text> | 가슴 압박</Text>
                </View>
                <Text style={styles.text}>
                  압박 위치에 알맞은 압박 자세를 취합니다.{'\n\n'}
                  정확한 자세와 압박 위치는 견종마다 다르며, 다음과 같습니다.
                </Text>
                <View style={{marginLeft:100, marginRight:100}}>
                  <App a={9}/>
                </View>
              </View>
            </View>
            <View style={styles.sectionFour}>
              <View style={styles.cards}>
                <View style={styles.cardHeader}>
                  <Text style={styles.stepTitle}><Text style={styles.highlight}>평가</Text> | 반복 및 확인</Text>
                </View>
                <Text style={styles.text}>
                  가슴 압박 30회, 인공 호흡 2회를 1세트로 해, 총 4세트를 진행합니다{"\n\n"}
                  이후 다시 의식, 호흡, 심장박동을 확인하여 상태가 돌아왔는지 확인합니다{"\n"}
                  (<Text style={styles.highlight}>허벅지 안쪽</Text>에 손을 대보면 맥박을 확인할 수 있습니다){"\n\n"}
                  어느 하나라도 돌아왔다면 자세를 유지한 채로 즉시 근처 동물 병원으로
                  이동해야 합니다
                </Text>
                <View style={{marginLeft:100, marginRight:100}}>
                  <App a={10}/>
                </View>
              </View>
            </View>
          </View>
          

          {/* Nearby Vet Section */}
          <View>
            <Text style={styles.sectionTitle}>가까운 동물병원 찾기</Text>
            <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
              <Text>
                응급 상황 발생 시, CPR과 함께 가까운 동물병원으로 이동하는 것이 가장 중요합니다.
                현재 위치를 기준으로 주변 동물병원을 찾아보세요.
              </Text>
              <View style={{width: '100%', height: 300, backgroundColor: '#a0a0a0', borderRadius: 10, alignItems:'center'}}>
                <View style={{ backgroundColor: 'gray', borderRadius: 10, width: '60%', height: 300, marginBottom: 200 }}>
                  <MapSearch />
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Close Button */}
        <TouchableOpacity style={styles.closeButton} onPress={() => router.push("/")}>
          <Text style={styles.closeText}>나가기</Text>
        </TouchableOpacity>
      </LinearGradient>
    </ScrollView>
  );
};

// MapSearch Component
interface Place {
  id: string;
  name: string;
  lat: number;
  lon: number;
}

const MapSearch: React.FC = () => {
  const [region, setRegion] = useState({
    latitude: 37.541, // 기본값: 서울
    longitude: 126.986,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  const [markers, setMarkers] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        // 권한 요청
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("위치 권한이 필요합니다.");
          setLoading(false);
          return;
        }

        // 현재 위치 가져오기
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        const lat = loc.coords?.latitude;
        const lon = loc.coords?.longitude;

        if (lat == null || lon == null || isNaN(lat) || isNaN(lon)) {
          Alert.alert("유효하지 않은 현재 위치 값입니다.");
          setLoading(false);
          return;
        }

        // 지도 중심 이동
        setRegion({
          latitude: lat,
          longitude: lon,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });

        // Overpass API 요청
        const query = `[out:json];node(around:5000,${lat},${lon})["amenity"="veterinary"];out;`;
        const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(
          query
        )}`;

        const res = await fetch(url);
        const text = await res.text();

        let data: any;
        try {
          data = JSON.parse(text);
        } catch (err) {
          console.error("Overpass API JSON 파싱 실패:", text.slice(0, 200));
          Alert.alert("데이터 오류", "Overpass API에서 JSON이 아닌 응답을 받았습니다.");
          setLoading(false);
          return;
        }

        // 마커 변환
        const places: Place[] = (data.elements || [])
          .map((el: any) => {
            const elLat = parseFloat(el.lat);
            const elLon = parseFloat(el.lon);
            if (isNaN(elLat) || isNaN(elLon)) return null;

            const id = el.id?.toString() || Math.random().toString();
            const name = el.tags?.name || "동물병원";

            return { id, name, lat: elLat, lon: elLon };
          })
          .filter((p: any): p is Place => !!p);

        setMarkers(places);
      } catch (e: any) {
        console.error("Error:", e);
        Alert.alert(
          "위치 정보 또는 데이터 로딩 중 오류가 발생했습니다.",
          e?.message || String(e)
        );
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;

  return (
    <View style={{ flex: 1, borderRadius: 8 }}>
      <MapView style={{ flex: 1, borderRadius: 8 }} region={region}>
        {/* 내 위치 마커 */}
        <Marker
          coordinate={{ latitude: region.latitude, longitude: region.longitude }}
          title="내 위치"
          pinColor="blue"
        />

        {/* 주변 동물병원 마커 */}
        {markers.map((m) => (
          <Marker
            key={m.id}
            coordinate={{ latitude: m.lat, longitude: m.lon }}
            title={m.name}
          />
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  containerss: { flex: 1, margin: 40, marginTop: 0 },
  mainTitle: { fontSize: 28, fontWeight: '700', color: '#000', marginBottom: 12 },
  subTitle: { fontSize: 16, fontWeight: '600', color: '#444', marginBottom: 16 },
  step: { fontSize: 22, fontWeight: '600', marginTop: 12, marginBottom: 8, color: '#333' },
  description: { fontSize: 16, marginBottom: 12, color: '#555' },
  closeButton: { width: '80%', height: 48, alignSelf: 'center', marginTop: 16, borderWidth: 1, borderColor: '#FF724F', borderRadius: 32, justifyContent: 'center', alignItems: 'center' },
  closeText: { fontSize: 18, fontWeight: '700', color: '#000' },
  containers: { flex: 1, marginVertical: 20, paddingHorizontal: 16 },
  title: { fontSize: 36, fontWeight: 'bold', color: 'white', marginBottom: 12 },
  cards: { backgroundColor: 'white', borderRadius: 8, padding: 16, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 3, elevation: 3 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 2, borderBottomWidth: 0, borderBottomColor: '#ddd', paddingBottom: 8 },
  stepTitle: { fontSize: 22, fontWeight: '700', color: 'black' },
  text: { fontSize: 16, color: 'black', marginBottom: 18, paddingTop:20, borderTopWidth: 1, borderTopColor: '#979797'},
  highlight: { color: '#f37358', fontWeight: '700' },
  background: { flex: 1, paddingBottom: 16 },
  overlay: { paddingHorizontal: 16 },
  backButton: { position: 'absolute', width: 48, height: 48, left: 16, top: 16, borderRadius: 24, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', zIndex: 10 },
  backText: { fontSize: 20, fontWeight: 'bold', color: '#FF724F' },
  titleSection: { marginTop: 40, paddingHorizontal: 16 },
  section: { width: '100%', flexDirection: 'row', paddingVertical: 12, marginBottom: 150, gap: 12 },
  sections: { width: '100%', paddingVertical: 12, marginBottom: 150, gap: 12 },
  sectionFour: { width: '100%', marginBottom: 140, },
  sectionTitle: { fontSize: 30, fontWeight: '700', marginBottom: 12 },
  sectionHeader: { fontSize: 18, color: 'white', fontWeight: '700', marginBottom: 12 },
  sectionDesc: { fontSize: 16, color: 'white', fontWeight: '600', marginBottom: 12 },
  pointText: { fontSize: 16, color: 'white', marginBottom: 8 },
  Logo: { width: '100%', justifyContent: 'center', alignItems: 'center', marginVertical: 80, marginBottom: 200, },
  LogoText: { fontSize: 28, fontWeight: '600', margin: 0, padding: 0 },
  cardContainer: { flexDirection: 'column', gap: 8 },
  div: { flex: 1, padding: 12 },
  sideBar: { width: 4, height: '100%', backgroundColor: 'white', marginRight: 8, borderRadius: 2 },
  card: { flex: 1, backgroundColor: '#f0f0f0', justifyContent:'center', alignItems:'center', borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 5 },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#FF5A2B', marginBottom: 8 },
  cardText: { fontSize: 16, color: '#333' },
  map: { flex: 1, width: '100%', height: 300 },
});



export default GuideScreen;
