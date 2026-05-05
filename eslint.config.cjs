module.exports = [
  {
    ignores: [
      "node_modules/**",
      "packages/react-frontend/**",
      "packages/expo-mobile/**",
    ],
  },
  {
    files: ["packages/express-backend/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        process: "readonly",
        console: "readonly",
      },
    },
  },
  {
    files: ["**/*.test.js"],
    languageOptions: {
      globals: {
        describe: "readonly",
        test: "readonly",
        expect: "readonly",
      },
    },
  },
  {
    files: ["**/*.js"],
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "error",
    },
  },
];
