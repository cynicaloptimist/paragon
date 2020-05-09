import { ThemeType } from "grommet";
import { FontFacesUrlString } from "./FontFacesUrlString";

export const Theme: ThemeType = {
  global: {
    colors: {
      brand: {
        dark: "#476A6F",
        light: "#AFD5AA",
      },
    },
    font: {
      family: "Roboto",
      face: FontFacesUrlString,
    },
  },
  heading: {
    font: {
      family: "Spectral SC"
    }
  }
};
