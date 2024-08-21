const { nextui } = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        Slate: {
          10: "162B33",
        },
        red: {
          default: "#FF385C",
        },
        text: {
          "body-2nd": "#5A5E6B",
          default: "#13151A",
          placehoder: "#AAAEBD",
        },
        gray: {
          900: "#1A1A1A",
        },
        primary: "#FF385C",
        secondary: "#FFE8E8",
        "card-title": "#112238",
        "related-bg": "#2ec2ca",
        "title-black": "#112238",
        "active-link": "#196ACC",
      },
      screens: {
        xxs: "300px",
        xs: "375px",
      },
      fontSize: {
        xxs: [
          "11px",
          {
            lineHeight: "20px",
          },
        ],
        xm: [
          "13px",
          {
            lineHeight: "22px",
          },
        ],
        lm: [
          "15px",
          {
            lineHeight: "24px",
          },
        ],
        mg: [
          "17px",
          {
            lineHeight: "26px",
          },
        ],
      },
      boxShadow: {
        "shadow-card": "0px 0px 6px 0px rgba(0, 0, 0, 0.16)",
      },
    },
  },
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            danger: {
              DEFAULT: "#FF385C",
              foreground: "white",
            },
          },
        },
      },
    }),
    require("@tailwindcss/line-clamp"),
    require("@tailwindcss/typography"),
  ],
};
