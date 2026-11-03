module.exports = {
  multipass: true,
  js2svg: { pretty: false },
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          removeViewBox: false,
          removeTitle: false,
          removeUnknownsAndDefaults: { keepRoleAttr: true },
          convertPathData: { floatPrecision: 2, noSpaceAfterFlags: false },
          cleanupNumericValues: { floatPrecision: 2 },
        },
      },
    },
  ],
};
