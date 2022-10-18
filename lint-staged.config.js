module.exports = {
  '*.(ts|tsx)': ['npm run lint', 'prettier --write --ignore-unknown'],
  '*.sass': 'stylelint --fix',
  '*.scss': 'stylelint --fix',
  '*.css': 'stylelint --fix',
}
