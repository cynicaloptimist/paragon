import { ThemeType } from "grommet";

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
      },
      text: {
        light: "rgba(68, 68, 68, 1)",
      },
      link: {
        light: "#5eab54",
      },
      "text-fade": {
        light: "rgba(68, 68, 68, 0.2)",
      },
      focus: {
        light: "#A3C4BC",
      },
      background: "#F1F7EE",
      "background-contrast": "#E8F2E3",
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
};
