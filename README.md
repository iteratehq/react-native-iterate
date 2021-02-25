
![Iterate for React Native](https://iterate-assets.s3.amazonaws.com/clients/iterate-react-native-banner.png)

# Iterate for React Native

[![build](https://img.shields.io/circleci/build/github/iteratehq/react-native-iterate)](https://github.com/iteratehq/react-native-iterate) 
[![maintainability](https://img.shields.io/codeclimate/maintainability/iteratehq/react-native-iterate)](https://codeclimate.com/github/iteratehq/react-native-iterate)
[![version](https://img.shields.io/github/v/tag/iteratehq/react-native-iterate?label=version)](https://github.com/iteratehq/react-native-iterate/releases)
[![license](https://img.shields.io/github/license/iteratehq/react-native-iterate?color=%23000000)](https://github.com/iteratehq/react-native-iterate/blob/master/LICENSE.txt) 

[Iterate](https://iteratehq.com) surveys put you directly in touch with your app users to learn how you can change for the better—from your product to your app experience.

Run surveys that are highly targeted, user-friendly, and on-brand. You’ll understand not just what your visitors are doing, but why.

## Platforms Supported

- [x] iOS
- [x] Android

## Install

With yarn

```
$ yarn add react-native-iterate
```

With npm

```
$ npm install --save react-native-iterate
```

**Install peer dependencies**

We rely on two popular peer dependencies, if you already have them in your app you can skip this step.

- [react-native-webview](https://github.com/react-native-webview/react-native-webview) - used to display the survey
- [react-native-safe-area-context](https://github.com/th3rdwave/react-native-safe-area-context) - used to layout the survey using the native safe area

With yarn

```
$ yarn add react-native-safe-area-context react-native-webview
```

With npm

```
$ npm install --save react-native-safe-area-context react-native-webview
```

**Install storage facility**

When you initialize Iterate you provide it with a storage facility that's used to save the API key as well as any additional user data set by calling the `identify` method. We recommend using an encrypted storage facility like [react-native-encrypted-storage](https://github.com/emeraldsanto/react-native-encrypted-storage), however you can also use [async-storage](https://github.com/react-native-async-storage/async-storage) or provide your own, the only requirement is that it complies with our StorageInterface.

```Typescript
export interface SecureStorage {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
}
```

Install a storage facility

With yarn

```
$ yarn add react-native-encrypted-storage
```

With npm

```
$ npm install --save react-native-encrypted-storage
```

**Link native dependencies**

From react-native 0.60 autolinking will take care of the link step and you can safely skip

React Native modules that include native Objective-C, Swift, Java, or Kotlin code have to be "linked" so that the compiler knows to include them in the app.

```
$ react-native link react-native-safe-area-context
$ react-native link react-native-webview
```

Link your storage facility
```
$ react-native link react-native-encrypted-storage
```

**Install pods**

For iOS you need to run pod install to complete the installation. Within the `ios` library of your app, run the following

```
$ pod install
```

## Usage

Within your app, surveys are shown in response to _events_. An event can be anything from viewing a screen, clicking a button, or any other user action. You use the Iterate SDK to send events to Iterate, then from your Iterate dashboard you create surveys that target those events.

**Quickstart**

Create your [Iterate](https://iteratehq.com) account if you haven't already.

1. Create a new survey and select "Install in your mobile app"
2. Go to the "Preview & Publish" tab and copy your SDK API key
3. Wrap your App in the `withIterate` higher-order component

```JSX
import Iterate, { withIterate } from 'react-native-iterate';
import SecureStorage from 'react-native-encrypted-storage';

const App: () => JSX.Element = () => {
    // ...your application component
}

export default withIterate({ 
    apiKey: YOUR_API_KEY,
    storage: SecureStorage, 
})(App);
```

4. Implement events

Here's an example of an event being fired when the user views the activity feed screen

```JSX
import Iterate from 'react-native-iterate';

const ActivityFeed: () => JSX.Element = () => {
  useEffect(() => {
    Iterate.sendEvent('viewed-activity-feed');
  }, []);

  // ...rest of component
}
```
5. Create your survey on iteratehq.com and target it to that event
6. Publish your survey and you're done 🎉

## Previewing your survey

You'll likely want to preview your survey before publishing it so you can test that everything works correctly. When previewing a survey you'll be able to see a survey before it's published. When previewing a survey all targeting options for that survey are ignored (e.g. rate limiting, targeting user properties), the only thing you need to do is trigger the event that your survey is targeting and it will show up.

1. In the "Preview & Publish" tab select 'Learn more' and copy the code.
2. Implement into your application, this can be done once in any component that's rendered before the event you're targeting

```JSX
    const App: () => JSX.Element = () => {
        useEffect(() => {
            Iterate.preview('your-survey-id');
        }, []);

        // ...your application component
    }
```

## Recommendations

When implementing Iterate for the first time, we encourage you to implement events for _all_ of your core use cases which you may want to target surveys to in the future. e.g. signup, purchased, viewed X screen, tapped notification, etc. This way you can easily launch new surveys targeting these events without needing to instrument a new event each time.

## Associating data with a user

Using the `identify` method, you can easily add 'user properties' to a user that can be used to target surveys to them and associate the information with all of their future responses.

```JSX
    const App: () => JSX.Element = () => {
        useEffect(() => {
            Iterate.identify({
                email: 'example@email.com',
                user_id: 123456,
                is_subscriber: true,
            });
        }, []);

        // ...your application component
    }
```

You can also associated 'response properties' with the user's responses to a specific survey (not associated with any future surveys they fill out), by passing a second data object to the `identify` method.

```JSX
    const App: () => JSX.Element = () => {
        useEffect(() => {
            Iterate.identify({
                // User properties
                email: 'example@email.com',
                user_id: 123456,
                is_subscriber: true,
            },{
                // Event properties
                selected_product_id: 12345,
                timestamp: 140002658477
            });
        }, []);

        // ...your application component
    }
```


For more information see our [help article](https://help.iteratehq.com/en/articles/4457590-associating-data-with-a-user-or-response).

## Response callbacks

If you need access to the user's responses on the client, you can use the `onResponse` method to pass a callback function that will return the question and response

```JSX
    const App: () => JSX.Element = () => {
        useEffect(() => {
            Iterate.onResponse((response, question) => {
                // Your logic here
            });
        }, []);

        // ...your application component
    }
```


## Survey eligibility and frequency

By default surveys are only shown once per person and user's can only see at most 1 survey every 72 hours (which is configurable). You can learn more about how [eligibility and frequency works](https://help.iteratehq.com/en/articles/2835008-survey-eligibility-and-frequency).

## Troubleshooting

If you have any issues you can head over to our [help center](https://help.iteratehq.com) to search for an answer or chat with our support team.
