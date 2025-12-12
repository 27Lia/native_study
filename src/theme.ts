// NOTE: 공통 이미지
import { Theme } from "@emotion/react";

export const image = {};

export const fontWeight = {
  thin: 100,
  extraLight: 200,
  light: 300,
  regular: 400,
  medium: 500,
  semiBold: 600,
  bold: 700,
  extraBold: 800,
  black: 900,
};

// NOTE: 공통 컬러
export const color = {
  primary: "#CB88CB",
  black: "#000",
  white: "#fff",
};

export const fontFamily = {
  primary: "'Noto Sans KR', 'Roboto'",
};

export const AppTheme: Theme = {
  image,
  color,
  fontWeight,
  fontFamily: {
    // NOTE: 공통 폰트 스타일
    primary: "Pretendard",
  },
  shadow: {},
  radius: {},
};
export default AppTheme;
