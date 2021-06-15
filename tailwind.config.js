module.exports = {
    purge: {
        content: ["./src/**/*.js", "./src/**/*.svelte"],
    },
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
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
        },
        fontFamily: {
            sans: ["Manrope", "sans-serif"],
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
};
