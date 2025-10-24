# Change Log

All notable changes to this project will be documented in this file.
`react-native-iterate` adheres to [Semantic Versioning](https://semver.org/).

## [2.8.1](https://github.com/iteratehq/react-native-iterate/releases/tag/v2.8.1)

Released on 2025-10-48.

**Added**

- The prompt button text color is now dynamically selected based on the background color

## [2.8.0](https://github.com/iteratehq/react-native-iterate/releases/tag/v2.8.0)

**Added**

- Added support for React 19

## [2.7.2](https://github.com/iteratehq/react-native-iterate/releases/tag/v2.7.2)

Released on 2025-04-11.

**Fixed**

Ampersand's are correctly encoded when present in response properties

## [2.7.1](https://github.com/iteratehq/react-native-iterate/releases/tag/v2.7.1)

**Added**

- Added support server-returned response properties

## [2.7.0](https://github.com/iteratehq/react-native-iterate/releases/tag/v2.7.0)

**Added**

- Added support for multi-language surveys


## [2.6.0](https://github.com/iteratehq/react-native-iterate/releases/tag/v2.6.0)

**Added**

- Added support for survey appearance options (Light/Dark/Auto)

## [2.5.0](https://github.com/iteratehq/react-native-iterate/releases/tag/v2.5.0)

**Added**

- Added support for markdown in the prompt

## [2.4.0](https://github.com/iteratehq/react-native-iterate/releases/tag/v2.4.0)

**Added**

- Added support for date types in user and response properties

## [2.3.5](https://github.com/iteratehq/react-native-iterate/releases/tag/v2.3.5)

**Fixed**

- Fixed an issue preventing response properties from being sent in 2.3.4

## [2.3.4](https://github.com/iteratehq/react-native-iterate/releases/tag/v2.3.4)

**Fixed**

- Fixed an issue preventing file:/// URLs from being loaded in the survey webview

## [2.3.3](https://github.com/iteratehq/react-native-iterate/releases/tag/v2.3.3)

**Added**

- Added support for custom fonts in survey UI

**Fixed**

- Fixed an issue preventing external links in the survey copy from opening

## [2.3.2](https://github.com/iteratehq/react-native-iterate/releases/tag/v2.3.2)

**Updated**

- Updated dependencies 

## [2.3.1](https://github.com/iteratehq/react-native-iterate/releases/tag/v2.3.1)

**Added**

- Ability to set the presentationStyle on the survey modal. This is a temporary solution to a bug in react-navigation which will be removed in the future.

## [2.3.0](https://github.com/iteratehq/react-native-iterate/releases/tag/v2.3.0)

**Added**

- Dark mode support. You can log into your Iterate dashboard and select a dark-mode color separate from your primary color.


## [2.2.4](https://github.com/iteratehq/react-native-iterate/releases/tag/v2.2.4)

**Updated**

- Updated dependencies

## [2.2.3](https://github.com/iteratehq/react-native-iterate/releases/tag/v2.2.3)

**Fixed**

- Fixed a bug that caused the user auth token not to be cleared when Iterate.reset() was called until the app was closed

**Added**

- Iterate.reset() can now safely be called before Iterate.init()

## [2.2.2](https://github.com/iteratehq/react-native-iterate/releases/tag/v2.2.2)

**Fixed**

- Fixed a bug that caused API requests for new users to use the incorrect auth token until Iterate.init was executed again

## [2.2.1](https://github.com/iteratehq/react-native-iterate/releases/tag/v2.2.1)

**Fixed**

- Fixed an error that occurred when attempting to remove data in the Iterate.reset() method that had not been set

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
