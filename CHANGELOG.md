# Change Log

All notable changes to this project will be documented in this file.
`react-native-iterate` adheres to [Semantic Versioning](https://semver.org/).

## [2.2.0](https://github.com/iteratehq/react-native-iterate/releases/tag/v2.2.0)

**Added**

- 'dismiss' event now includes a 'progress' property that includes how far the user got in the survey
- All events now include the survey they are related to (helpful when getting events on multiple surveys)
- New 'displayed' event which is fired when the survey or prompt are displayed

## [2.1.0](https://github.com/iteratehq/react-native-iterate/releases/tag/v2.1.0)

**Added**

- Add Iterate.onEvent callback to get additional interaction events on the survey like 'dismiss' and 'survey-complete'

## [2.0.0](https://github.com/iteratehq/react-native-iterate/releases/tag/v2.0.0)

**Breaking Changes**

See the README for the updated way to initialize Iterate 
- Changes from the withIterate high-order component to the <IterateProvider> component
- Iterate.init(...) is now required to be called before any other methods
- Changed the API for sending event properties from happening in the Identify method, to the sendEvent method
- The user now provides their own safe area

**Optimizations**
- All initialization is now lazy-loaded to maximize app boot performance
- Additional error handling

## [1.2.0](https://github.com/iteratehq/react-native-iterate/releases/tag/v1.2.0)

**Added**

- Add a 'reset' method that clears all data from local storage and the local redux store. This is useful when logging out a user to ensure their data isn't associated with the next logged in user
- Exports StorageInterface interface

## [1.1.0](https://github.com/iteratehq/react-native-iterate/releases/tag/v1.1.0)

**Added**

- withIterate now requires a storage facility to be passed in

**Removed**

- react-native-encrypted-storage is no longer a required peer dependency

## [1.0.0](https://github.com/iteratehq/react-native-iterate/releases/tag/v1.0.0)

**Added**

- Shipped version 1.0.0

## [0.2.3](https://github.com/iteratehq/react-native-iterate/releases/tag/v0.2.3)

**Fixed**

- Use the correct survey color for the prompt button

## [0.2.2](https://github.com/iteratehq/react-native-iterate/releases/tag/v0.2.2)

**Fixed**

- Link to the correct typescript definition file

## [0.2.1](https://github.com/iteratehq/react-native-iterate/releases/tag/v0.2.1)

**Fixed**

- Include redux as a dependency instead of relying on a peerDependency

## [0.2.0](https://github.com/iteratehq/react-native-iterate/releases/tag/v0.2.0)

**Fixed**

- UI bug fixes for devices without a notch

**Added**

- Loading indicator on the survey

## [0.1.0](https://github.com/iteratehq/react-native-iterate/releases/tag/v0.1.0)

Released on 2021-02-21.

**Added**

- Initial release of react-native-iterate.
