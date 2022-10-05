module.exports = {
  '*.(js|jsx)': ['make lint', 'prettier --write --ignore-unknown'],
  '*.sass': 'stylelint --fix',
  '*.scss': 'stylelint --fix',
  '*.css': 'stylelint --fix',
}
