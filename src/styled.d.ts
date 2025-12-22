import "@emotion/react";

import { image } from "./theme";

declare module "*.png";
declare module "*.jpg";
declare module "*.jpeg";



declare module "@emotion/react" {
  export interface Theme {
    fontWeight: {
      thin: number;
      extraLight: number;
      light: number;
      regular: number;
      medium: number;
      semiBold: number;
      bold: number;
      extraBold: number;
      black: number;
    };
    fontFamily: {
      primary: string;
    };
    color: {
      white: string;
      black: string;
      primary: string;
    };
    shadow: {};
    radius: {};
    image: typeof image;
  }
}
