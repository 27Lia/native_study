import React from "react";
import { css, Global } from "@emotion/react";

const style = css`
  @import url("https://fonts.googleapis.com/earlyaccess/notosanskr.css");

  html {
    font-size: 62.5%;
    box-sizing: border-box;
    line-height: normal;
    font-family: "Noto Sans KR", sans-serif;
    font-weight: 500;
    overflow-x: hidden;
  }

  body {
    width: 100vw;
    overflow-x: hidden;
    box-sizing: border-box;
    font-size: 1.4rem;
    font-weight: 400;
    color: #212121;
    padding: 0;
    margin: 0;

    &::-webkit-scrollbar {
      width: 1rem;
      height: 0.6rem;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #dcdcdc;
    }

    &::-webkit-scrollbar-track {
      background-color: transparent;
    }
  }

  iframe {
    width: 100dvw;
    height: 100dvh;
  }

  a {
    color: inherit;
    font-size: inherit;
    text-decoration: none;
  }

  *::placeholder {
    font-family: "Noto Sans KR", sans-serif;
    font-weight: 350;
    color: #909090;
  }

  button,
  a {
    &:hover {
      transition: all 0.3s;
    }
  }

  ul,
  li {
    list-style: none;
  }

  button {
    font: inherit;
    cursor: pointer;
    outline: none;
    background: inherit;
  }

  textarea,
  input,
  select {
    outline: none;
    font-family: "Noto Sans KR", sans-serif;
    font-weight: 500;
    color: #212121;
    opacity: 1;

    &::placeholder {
      transition: all 0.3s;
    }

    &:focus {
      &::placeholder {
        opacity: 0;
      }
    }
  }
`;

const GlobalStyle = () => {
  return <Global styles={style} />;
};

export default GlobalStyle;
