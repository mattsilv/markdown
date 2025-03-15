/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class", // Use class for dark mode instead of media queries
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--body-font)"],
        serif: ["var(--heading-font)"],
        mono: ["var(--code-font)"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "var(--primary-color)",
        secondary: "var(--secondary-color)",
        accent: "var(--accent-color)",
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        border: "var(--border-color)",
        success: "var(--success-color)",
        warning: "var(--warning-color)",
        error: "var(--error-color)",
      },
      borderRadius: {
        DEFAULT: "var(--border-radius)",
      },
      boxShadow: {
        DEFAULT: "var(--box-shadow)",
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            p: {
              marginTop: "0.5em",
              marginBottom: "0.5em",
            },
            "p + p": {
              marginTop: "2em", // Increased spacing between consecutive paragraphs
            },
            "h1, h2, h3, h4, h5, h6": {
              marginTop: "1.5em",
              marginBottom: "0.5em",
            },
          },
        },
        lg: {
          css: {
            "p + p": {
              marginTop: "2em", // Ensure consistent spacing in large prose
            },
          },
        },
        sm: {
          css: {
            "p + p": {
              marginTop: "1.75em", // Slightly reduced spacing for small prose (print mode)
            },
          },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
