module.exports = {
  "extends": [
    "airbnb",
    "plugin:prettier/recommended",
    "prettier/react"
  ],
  "parser": "babel-eslint",
  "env": {
    "browser": true,
    "commonjs": true,
    "es6": true,
    "jest": true,
    "node": true
  },
  "rules": {
    "jsx-a11y/href-no-hash": 0,
    "react/jsx-filename-extension": ["warn", { "extensions": [".js", ".jsx"] }],
    "react/prefer-stateless-function": 0,
    "import/no-unresolved": 0,
    "camelcase": 0,
    "react/prop-types": 0,
    "import/prefer-default-export": 0,
    "react/destructuring-assignment": 0,
    "no-else-return": 0,
    "no-lonely-if": 0,
    "react/no-multi-comp": 0,
    "class-methods-use-this": 0,
    "react/no-access-state-in-setstate": 0,
    "react/jsx-no-bind": 0,
    "jsx-a11y/no-static-element-interactions": 0,
    "jsx-a11y/click-events-have-key-events": 0,
    "prefer-destructuring": 0,
    "no-param-reassign": 0,
    "no-underscore-dangle": 0,
    "max-len": [
      "warn",
      {
        "code": 100,
        "tabWidth": 2,
        "comments": 100,
        "ignoreComments": false,
        "ignoreTrailingComments": true,
        "ignoreUrls": true,
        "ignoreStrings": true,
        "ignoreTemplateLiterals": true,
        "ignoreRegExpLiterals": true
      }
    ]
  }
};
