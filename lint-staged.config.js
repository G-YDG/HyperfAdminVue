module.exports = {
  '*.{js,jsx,ts,tsx}': ['eslint --fix', 'prettier --write'],
  '*.json': ['prettier --write'],
  '*.vue': ['eslint --fix', 'prettier --write'],
  '*.{scss,less,styl,html}': ['prettier --write'],
  '*.md': ['prettier --write'],
};
