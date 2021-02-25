/**
 * @format
 * @flow
 */

import React from 'react';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import Iterate, { store } from '../iterate';
import {
  setCompanyAuthToken,
  setLastUpdated,
  setUserAuthToken,
  setUserTraits,
} from '../redux';
import Storage, { Keys, StorageInterface } from '../storage';

import PromptOrSurvey from './PromptOrSurvey';

interface Props {
  apiKey: string;
  storage: StorageInterface;
}

const withIterate = ({ apiKey, storage }: Props) => {
  // Set the user's secure storage if one was provided
  Storage.storageProvider = storage;

  // Initialize with the company api key
  Iterate.configure(apiKey);

  // Initial state values
  store.dispatch(setCompanyAuthToken(apiKey));
  Storage.get(Keys.authToken).then((authToken?: string) => {
    Storage.get(Keys.lastUpdated).then((lastUpdated?: string) => {
      Storage.get(Keys.userTraits).then((userTraits?: {}) => {
        // Initialize the api with the user auth token
        if (authToken != null) {
          Iterate.configure(authToken);
          store.dispatch(setUserAuthToken(authToken));
        }

        // Initialize the last updated timestamp
        if (lastUpdated != null) {
          store.dispatch(setLastUpdated(parseInt(lastUpdated, 10)));
        }

        // Initialize the user traits
        if (userTraits != null) {
          store.dispatch(setUserTraits(userTraits));
        }

        // Let the iterate client know we're all initialized and it's safe
        // to make the embed request
        Iterate.init();
      });
    });
  });

  return (Comp: () => JSX.Element) => (props: {}) => (
    <SafeAreaProvider>
      <Comp {...props} />
      <Provider store={store}>
        <PromptOrSurvey />
      </Provider>
    </SafeAreaProvider>
  );
};

export default withIterate;
