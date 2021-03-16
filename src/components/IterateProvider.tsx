/**
 * @format
 * @flow
 */

import React from 'react';
import { Provider } from 'react-redux';

import Iterate, { store } from '../iterate';
import {
  setCompanyAuthToken,
  setLastUpdated,
  setUserAuthToken,
  setUserTraits,
} from '../redux';
import Storage, { Keys, StorageInterface } from '../storage';
import type { EdgeInsets } from '../types';

import PromptOrSurvey from './PromptOrSurvey';

interface Props {
  apiKey: string;
  children: React.ReactNode;
  storage: StorageInterface;
  safeArea: () => EdgeInsets;
}

const IterateProvider = ({ apiKey, children, safeArea, storage }: Props) => {
  // Set the user's secure storage if one was provided
  Storage.provider = storage;

  // Initialize with the company api key
  Iterate.configure(apiKey);

  // Initial state values
  store.dispatch(setCompanyAuthToken(apiKey));
  Storage.getItem(Keys.authToken).then((authToken?: string) => {
    Storage.getItem(Keys.lastUpdated).then((lastUpdated?: string) => {
      Storage.getItem(Keys.userTraits).then((userTraits?: {}) => {
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

  return (
    <>
      {children}
      <Provider store={store}>
        <PromptOrSurvey safeAreaInsets={safeArea()} />
      </Provider>
    </>
  );
};

export default IterateProvider;
