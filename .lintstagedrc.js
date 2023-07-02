module.exports = {
  '*.{js,jsx,ts,tsx}': ['eslint .'],
  '*': ['prettier . --check --ignore-path .gitignore'],
};
