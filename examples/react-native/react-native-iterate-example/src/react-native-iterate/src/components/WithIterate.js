/**
 * @format
 * @flow
 */

import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Provider} from 'react-redux';

import Iterate, {store} from '../iterate';
import {
  setCompanyAuthToken,
  setLastUpdated,
  setUserAuthToken,
  setUserTraits,
} from '../redux';
import Storage, {Keys} from '../storage';

import PromptOrSurvey from './PromptOrSurvey';

interface Props {
  apiKey: string;
}

const withIterate = ({apiKey}: Props) => {
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

  return (Comp: () => React$Node) => (props: {}) => (
    <View style={styles.container}>
      <View style={styles.app}>
        <Comp {...props} />
        <Provider store={store}>
          <PromptOrSurvey />
        </Provider>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
  app: {
    width: '100%',
    height: '100%',
    zIndex: 1,
  },
});

export default withIterate;
