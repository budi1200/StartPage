module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,svelte}",
    ],
    theme: {
        fontFamily: {
            sans: ["Manrope", "sans-serif"],
        },
        extend: {
            fontSize: {
                xxs: ".7rem",
            },
            colors: {
                hoverGrey: "rgba(27, 26, 27, 0.445)"
            },
            boxShadow: {
                hoverOutline: "0 2.8px 2.2px rgba(0, 0, 0, 0.034), 0 6.7px 5.3px rgba(0, 0, 0, 0.048)"
            },
            minWidth: {
                4: "1rem"
            }
        }
    },
    variants: {
        extend: {},
    },
    plugins: [],
};
