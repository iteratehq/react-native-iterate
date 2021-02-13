/**
 * @format
 * @flow
 */

import React from 'react';
import {View, StyleSheet} from 'react-native';

const withIterate = (Comp: () => React$Node) => (props: {}) => {
  return (
    <View style={styles.container}>
      <View style={styles.app}>
        <Comp {...props} />
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
