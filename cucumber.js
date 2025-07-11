module.exports = {
  default: [
    "features/**/*.feature",
    "--require-module ts-node/register",
    "--require steps/**/*.ts",
    "--format progress-bar",
    "--format @cucumber/pretty-formatter",
    // removed unsupported --timeout option
  ].join(' ')
};
