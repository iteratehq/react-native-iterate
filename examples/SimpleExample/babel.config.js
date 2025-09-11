const path = require('path');
const pak = require('../../package.json');

module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        extensions: ['.tsx', '.ts', '.js', '.json'],
        alias: {
          // For development, we want to alias the library to the source
          [pak.name]: path.join(__dirname, '..', '..', pak.source),
          // Ensure both the library and app use the same React instance
          'react': path.join(__dirname, 'node_modules', 'react'),
          'react-native': path.join(__dirname, 'node_modules', 'react-native'),
          'react-native-webview': path.join(__dirname, 'node_modules', 'react-native-webview'),
        },
      },
    ],
  ],
};
