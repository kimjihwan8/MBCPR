import React from "react";
import { View, Text, Pressable, StyleSheet, useWindowDimensions } from "react-native";
import Svg, { Path } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { transform } from "@babel/core";

export default function TrainingSetup() {
  const router = useRouter();
  const { width, height } = useWindowDimensions(); // 화면 크기 가져오기

  // 화면 크기에 맞춘 동적 스타일
  const dynamicStyles = {
    heartSize: height * 4,        // 하트 크기
    titleFont: width * 0.03,        // 제목 폰트 크기
    // titleMarginTo
    buttonWidth: width * 0.35,      // 버튼 가로
    buttonHeight: height * 0.15,    // 버튼 세로
    buttonFont: width * 0.06,       // 버튼 글자
    gap: width * 0.05,              // 버튼 간격
    container: {
      // marginTop: height * 0.0,
      flex: 1,
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "center",
    } as const,
    choiceButton: {
    width : height * 0.7,    // 버튼 세로
    height : height * 0.5,
    marginTop: 30,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  } as const,
  choiceText: {
    fontSize : height * 0.09,
    color: "#fff",
    fontWeight: "bold",
  } as const,
  heart: {
    position: "absolute",
    zIndex: -1, // 뒤로 보내기
    top: "0%",
    left: "50%",
    // transform: [{translateX(-13%)}],
  } as const,
  title: {
    fontWeight: "bold",
    marginBottom: 0,
    color: "#333",
  } as const,
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {/* 배경 하트 */}
      <Svg
        width={dynamicStyles.heartSize}
        height={dynamicStyles.heartSize}
        viewBox="0 0 539 525"
        style={[
        dynamicStyles.heart,
        { transform: [{ translateX: -(dynamicStyles.heartSize * 0.13) }] }
      ]}
      >
        <Path
          d="M97.8594 0.625C109.318 0.625 118.915 4.86458 126.652 13.3437C134.389 21.8229 138.255 31.9062 138.25 43.5938C138.25 45.6562 138.135 47.6912 137.906 49.6987C137.677 51.7062 137.276 53.6817 136.703 55.625H93.7344L82.0469 38.0938C81.4739 37.1771 80.6719 36.4323 79.6406 35.8594C78.6094 35.2865 77.5208 35 76.375 35C74.8854 35 73.5402 35.4583 72.3394 36.375C71.1385 37.2917 70.3067 38.4375 69.8437 39.8125L60.5625 67.6562L54.5469 58.7188C53.9739 57.8021 53.1719 57.0573 52.1406 56.4844C51.1094 55.9115 50.0208 55.625 48.875 55.625H2.29687C1.72396 53.6771 1.32292 51.7017 1.09375 49.6987C0.864583 47.6958 0.75 45.7181 0.75 43.7656C0.75 31.9635 4.58854 21.8229 12.2656 13.3437C19.9427 4.86458 29.5104 0.625 40.9687 0.625C46.4687 0.625 51.6548 1.71354 56.5269 3.89062C61.3989 6.06771 65.7233 9.10417 69.5 13C73.1667 9.10417 77.436 6.06771 82.3081 3.89062C87.1802 1.71354 92.3639 0.625 97.8594 0.625ZM69.5 124.375C67.4375 124.375 65.4621 124.004 63.5737 123.261C61.6854 122.519 59.9942 121.4 58.5 119.906L12.4375 73.6719C11.75 72.9844 11.1198 72.2969 10.5469 71.6094C9.97396 70.9219 9.40104 70.1771 8.82812 69.375H45.0937L56.7812 86.9062C57.3542 87.8229 58.1562 88.5677 59.1875 89.1406C60.2187 89.7135 61.3073 90 62.4531 90C63.9427 90 65.3177 89.5417 66.5781 88.625C67.8385 87.7083 68.6979 86.5625 69.1562 85.1875L78.4375 57.3438L84.2812 66.2812C84.9687 67.1979 85.8281 67.9427 86.8594 68.5156C87.8906 69.0885 88.9792 69.375 90.125 69.375H130L126.562 73.5L80.3281 119.906C78.8385 121.396 77.1771 122.514 75.3437 123.261C73.5104 124.008 71.5625 124.38 69.5 124.375Z"
          fill="#FFEDE7"
        />
      </Svg>

      {/* 제목 */}
      <Text style={[dynamicStyles.title, { fontSize: dynamicStyles.titleFont }]}>
        당신이 하고싶은 것은...
      </Text>

      {/* 버튼 */}
      <View style={[styles.buttonRow, { gap: dynamicStyles.gap }]}>
        <Pressable
          style={[
            dynamicStyles.choiceButton,
            styles.blue
          ]}
          onPress={() => router.push("/guide" as any)}
        >
          <Text style={dynamicStyles.choiceText}>방법</Text>
        </Pressable>

        <Pressable
          style={[
            dynamicStyles.choiceButton,
            styles.orange
          ]}
          onPress={() => router.push("/training")}
        >
          <Text style={dynamicStyles.choiceText}>실습</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonRow: {
    flexDirection: "row",
  },
  blue: { backgroundColor: "#4285F4" },
  orange: { backgroundColor: "#FF7043" },
});
