module.exports = {
  env: {
    browser: true,
    amd: true,
    es6: true
  },
  extends: ["airbnb-base"],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly"
  },
  parserOptions: {
    ecmaVersion: 2018
  },
  rules: {
    "func-names": "off",
    "no-useless-escape": "off",
    "no-tabs": "off",
    "import/no-unresolved": "off",
    "no-nested-ternary": "off",
    "no-param-reassign": "off",
    "no-use-before-define": "off"
  }
};
