module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module:react-native-dotenv",
        {
          envName: "APP_ENV",
          moduleName: "@env",
          path: ".env",
          safe: true, // Set to true for safety
          allowUndefined: true,
          verbose: true, // Set to true during development for more information
        },
      ],
      "react-native-paper/babel",
      "react-native-reanimated/plugin",
    ],
  };
};
