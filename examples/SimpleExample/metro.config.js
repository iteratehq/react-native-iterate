const { getDefaultConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
module.exports = {
  ...getDefaultConfig(__dirname),
  watchFolders: [
    // Watch the root directory for changes
    '/Users/mike/Iterate/react-native-iterate',
  ],
};
