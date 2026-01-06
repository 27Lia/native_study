/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      padding: {
        safe: "env(safe-area-inset-bottom)",
      },
      margin: {
        safe: "env(safe-area-inset-bottom)",
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ".scrollbar-hide": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        },
        ".pt-safe": {
          "padding-top": "env(safe-area-inset-top)",
        },
        ".pb-safe": {
          "padding-bottom": "env(safe-area-inset-bottom)",
        },
      });
    },
  ],
};
