module.exports = {
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  collectCoverage: true,
  transformIgnorePatterns: ['node_modules/(?!(@molgenis|igv)/)']
};
