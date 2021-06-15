const { tailwindExtractor } = require("tailwindcss/lib/lib/purgeUnusedStyles");

module.exports = {
    purge: {
        content: ["./src/**/*.{html,js,svelte,ts}"],
        options: {
            defaultExtractor: (content) => [
                ...tailwindExtractor(content),
                // Match Svelte class: directives (https://github.com/tailwindlabs/tailwindcss/discussions/1731)
                ...[...content.matchAll(/(?:class:)*([\w\d-/:%.]+)/gm)].map(
                    ([_match, group, ..._rest]) => group,
                ),
            ],
            keyframes: true,
        },
    },
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
