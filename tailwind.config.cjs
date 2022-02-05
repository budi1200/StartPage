const colors = require('tailwindcss/colors');

module.exports = {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    fontFamily: {
      sans: ["Manrope", "sans-serif"],
    },
    extend: {
      zIndex: {
        '-1': '-1',
      },
      gridTemplateColumns: {
        42: "42px 1fr",
      },
      spacing: {
        190: "1px",
        191: "8px",
        192: "-16px",
      },
      fontSize: {
        xxs: ".7rem",
      },
    }
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
