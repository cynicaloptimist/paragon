import { ThemeType } from "grommet";
import { FontFacesUrlString } from "./FontFacesUrlString";

export const Theme: ThemeType = {
  global: {
    colors: {
      brand: {
        dark: "#555F3E",
        light: "#AFD5AA",
      },
      "brand-2": {
        dark: "#52675E",
        light: "#A3C4BC",
      }
    },
    font: {
      family: "Roboto",
      face: FontFacesUrlString,
    },
  },
  heading: {
    font: {
      family: "Spectral SC",
    },
  },
};
