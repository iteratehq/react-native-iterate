/**
 * @format
 * @flow
 */

import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Provider} from 'react-redux';

import Iterate, {store} from '../../iterate';

import Prompt from '../Prompt';

interface Props {
  apiKey: string;
}

const withIterate = ({apiKey}: Props) => {
  Iterate.configure(apiKey);

  return (Comp: () => React$Node) => (props: {}) => (
    <View style={styles.container}>
      <View style={styles.app}>
        <Comp {...props} />
        <Provider store={store}>
          <Prompt />
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
