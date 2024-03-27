/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        drawer: {
          background: "var(--drawer-background)",
        },
        main: {
          background: "var(--main-background)",
        },
        nav: {
          background: "var(--nav-background)",
        },
        accordian: {
          background: "var(--accordian-background)",
        },
        foreground: "var(--foreground)",
        taskcard: {
          foreground: "var(--taskcard-foreground)",
          background: "var(--taskcard-background)",
        },
        taskcardsmall: {
          // foreground: "var(--taskcard-foreground)",
          background: "var(--taskcardsmall-background)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
          hover: "var(--card-forefround)",
        },
        badgeYellow: "var(--badgeYellow)",
        badgeGreen: "var(--badgeGreen)",
        badgePurple: "var(--badgePurple)",
        badgeRed: "var(--badgeRed)",
        badgeBlue: "var(--badgeBlue)",
        badgeOrange: "var(--badgeOrange)",
        badgeGray: "var(--badgeGray)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      screens: {
        mobileLandscape: {
          raw: "(min-width: 544px) and (min-height:386px) and (max-height:480px)",
        },
        // mobilePortrait: {
        //   raw: "(max-width: 640px) and (orientation: portrait)",
        // },
        smallWidth: { raw: "(max-width: 414px)" },
        // tall: { raw: "(min-height: 768px)" },
        tooSmall: {
          // raw: "(max-width: 325px)",
          // raw: "(max-width: 325px), (max-height:325px)",
          // raw: "(max-width:515px) and (min-height:325px) and (max-height:640px)",
          raw: "(max-width: 319px), (max-height:319px), (max-width:515px) and (min-height:319px) and (max-height:567px)",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
