module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  parser: '@typescript-eslint/parser',
  ignorePatterns: [
    '**/*.json',
    '**/log/*',
    '**/node_modules/*',
    '**/coverage/*',
    '**/build/*',
    '**/*.d.ts',
    '**/*.html',
    '**/*.css',
    '**/Dockerfile*',
    '**/*.properties',
    'grubdash.js',
    'grubdash.map.js',
    '.env*',
    '.dockerignore',
    '.gitignore',
    '**/assets',
    'LICENSE',
    '**/*.md',
    '**/*.yml',
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    indent: [
      'error',
      2,
    ],
    'linebreak-style': 0,
    'import/no-unresolved': 0,
    'import/prefer-default-export': 0,
    'import/extensions': 0,
    quotes: [
      'error',
      'single',
    ],
    semi: [
      'error',
      'always',
    ],
  },
};
