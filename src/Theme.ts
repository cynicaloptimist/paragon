import { ThemeType } from "grommet";

export const Theme: ThemeType = {
  global: {
    colors: {
      brand: "#472654",
      "brand-revert": "#472654",
      "brand-desaturated": "#4d3b54",
      "brand-2": "#97A8C3",
      "accent-1": "#80D39B",
      "accent-2": "#FCCA46",
      "accent-3": "#FB3640",
      text: {
        light: "rgba(68, 68, 68, 1)",
      },
      "text-dark": {
        light: "rgba(20, 20, 20, 1)",
      },
      link: {
        light: "#3EB666",
      },
      "text-fade": {
        light: "rgba(68, 68, 68, 0.6)",
      },
      focus: "#81D2C7",
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
      "3": {
        small: {
          size: "16px",
          height: "16px",
        },
        medium: {
          size: "20px",
          height: "20px",
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
