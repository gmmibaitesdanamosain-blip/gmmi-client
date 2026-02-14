import type { Config } from "tailwindcss";
import { heroui } from "@heroui/react";

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  // theme: {
  //   extend: {
  //     colors: {
  //       'gmmi-navy': '#1e3a8a',
  //       'gmmi-gold': '#d4af37',
  //     },
  //   },
  // },
  darkMode: "class",
  plugins: [heroui()],
};

export default config;
