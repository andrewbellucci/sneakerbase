import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        primary: ["Outfit, sans", ...defaultTheme.fontFamily.sans],
        sans: ["Outfit, sans", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        primary: "#2b395e",
        secondary: "#8c8e8f",
        tertiary: "#8694A7",
        green: "#35bb35",
        "bright-green": "#30cd32",
        red: "#e93f37",
        "bright-red": "#ff372c",
        "off-white": "#f4f6f8",
        "default-black": "#26292b",
        "light-gray": "#e8ebee",
      },
      dropShadow: {
        side: "5px 0 10px 0 rgba(0,0,0,0.25)",
      },
    },
    container: {
      center: true,
      padding: "1rem",
      screens: {
        sm: "600px",
        md: "728px",
        lg: "984px",
        xl: "1030px",
        "2xl": "1158px",
      },
    },
  },
  plugins: [],
} satisfies Config;
