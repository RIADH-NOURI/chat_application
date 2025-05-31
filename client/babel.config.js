module.exports = function (api) {
  api.cache(true);

  return {
    presets: [
      [
        'babel-preset-expo',
        {
          jsxImportSource: "nativewind",
          'react-compiler': {
            sources: (filename) => {
              return (
                filename.includes('/app') ||
                filename.includes('/components')
              );
            },
          },
        },
      ],
      "nativewind/babel",
    ],   
  };
};
