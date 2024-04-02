/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        "inria-sans": ["Inria Sans", "sans-serif"],

        oswald: ["Oswald", "sans-serif"],

        "open-sans": ["Open Sans", "sans-serif"],
      },
      colors: {
        primary: {
          DEFAULT: "var(--primary-90)",
          light: "var(--primary-light-90)",
          90: "var(--primary-90)",
          80: "var(--primary-80)",
          70: "var(--primary-70)",
          60: "var(--primary-60)",
          50: "var(--primary-50)",
          40: "var(--primary-40)",
          30: "var(--primary-30)",
          20: "var(--primary-20)",
          10: "var(--primary-10)",
          0: "var(--primary-0)",
        },
        primaryLight: {
          DEFAULT: "var(--primary-light-90)",
          90: "var(--primary-light-90)",
          80: "var(--primary-light-80)",
          70: "var(--primary-light-70)",
          60: "var(--primary-light-60)",
          50: "var(--primary-light-50)",
          40: "var(--primary-light-40)",
          30: "var(--primary-light-30)",
          20: "var(--primary-light-20)",
          10: "var(--primary-light-10)",
          0: "var(--primary-light-0)",
        },
        secondary: {
          DEFAULT: "var(--secondary-90)",
          light: "var(--secondary-light-90)",
          90: "var(--secondary-90)",
          80: "var(--secondary-80)",
          70: "var(--secondary-70)",
          60: "var(--secondary-60)",
          50: "var(--secondary-50)",
          40: "var(--secondary-40)",
          30: "var(--secondary-30)",
          20: "var(--secondary-20)",
          10: "var(--secondary-10)",
          0: "var(--secondary-0)",
        },
        secondaryLight: {
          DEFAULT: "var(--secondary-light-90)",
          90: "var(--secondary-light-90)",
          80: "var(--secondary-light-80)",
          70: "var(--secondary-light-70)",
          60: "var(--secondary-light-60)",
          50: "var(--secondary-light-50)",
          40: "var(--secondary-light-40)",
          30: "var(--secondary-light-30)",
          20: "var(--secondary-light-20)",
          10: "var(--secondary-light-10)",
          0: "var(--secondary-light-0)",
        },
        neutral: {
          DEFAULT: "var(--neutral-90)",
          90: "var(--neutral-90)",
          80: "var(--neutral-80)",
          70: "var(--neutral-70)",
          60: "var(--neutral-60)",
          50: "var(--neutral-50)",
          40: "var(--neutral-40)",
          30: "var(--neutral-30)",
          20: "var(--neutral-20)",
          10: "var(--neutral-10)",
          0: "var(--neutral-0)",
        },
      },
    },
  },
  plugins: [],
};
