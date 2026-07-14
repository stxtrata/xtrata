module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  settings: {
    react: {
      version: 'detect'
    }
  },
  globals: {
    __XSTRATA_HAS_HIRO_KEY__: 'readonly'
  },
  plugins: ['react', 'react-hooks', 'react-refresh'],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'prettier'
  ],
  rules: {
    'react/react-in-jsx-scope': 'off',
    // eslint-plugin-react-refresh now publishes flat-config presets. This is
    // the plugin's supported legacy-config equivalent of its Vite preset.
    'react-refresh/only-export-components': [
      'error',
      { allowConstantExport: true }
    ],
    // Best-effort browser storage, diagnostics, and compatibility shims use
    // empty catch blocks deliberately; other empty blocks remain errors.
    'no-empty': ['error', { allowEmptyCatch: true }]
  }
};
