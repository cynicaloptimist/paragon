import { ThemeType } from "grommet";

export const Theme: ThemeType = {
  global: {
    colors: {
      brand: {
        light: "#472654",
      },
      "brand-desaturated": {
        light: "#4d3b54",
      },
      "brand-2": {
        light: "#97A8C3",
      },
      "accent-1": {
        light: "#80D39B",
      },
      "accent-2": {
        light: "#FCCA46",
      },
      "accent-3": {
        light: "#FB3640",
      },
      text: {
        light: "rgba(68, 68, 68, 1)",
      },
      link: {
        light: "#358600",
      },
      "text-fade": {
        light: "rgba(68, 68, 68, 0.6)",
      },
      focus: {
        light: "#81D2C7",
      },
      background: "#EEE5E9",
      "background-contrast": "#E7DAE0",
    },
    font: {
      family: "'Roboto', sans-serif",
    },
    input: {
      weight: 300,
    },
  },
  heading: {
    font: {
      family: "'Vollkorn', serif",
    },
    weight: 300,
    level: {
      "2": {
        small: {
          size: "20px",
          height: "26px",
        },
      },
    },
  },
  paragraph: {
    medium: {
      maxWidth: "none",
    },
  },
  button: {
    border: {
      radius: "1px",
    },
  },
};
