module.exports = [
    {
        files: ["**/*.js"],
        ignores: ["node_modules/**"],
        languageOptions: {
        ecmaVersion: "latest",
        sourceType: "commonjs",
        },
        rules: {
        "no-unused-vars": "warn",
        "no-undef": "error",
        },
    },
];