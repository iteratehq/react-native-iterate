/**
 * @format
 * @flow
 */

import React from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  Text,
  useColorScheme,
} from 'react-native';

import {Themes} from '../../constants';

import PromptButton from './Button';

const Prompt: () => React$Node = () => {
  const colorScheme = useColorScheme();

  const showSurvey = () => {};

  return (
    <View
      // eslint-disable-next-line react-native/no-inline-styles
      style={{
        ...styles.prompt,
        backgroundColor: colorScheme === Themes.Dark ? '#000' : '#fff',
      }}>
      <SafeAreaView>
        <Text
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            ...styles.promptText,
            color: colorScheme === Themes.Dark ? '#fff' : '#000',
          }}>
          Help us improve the Iterate React Native SDK by answering a few
          questions about your ideal use cases
        </Text>
        <PromptButton
          text="Happy to help"
          color="#7457be"
          onPress={showSurvey}
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  prompt: {
    zIndex: 2,
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
  promptText: {
    fontSize: 16,
    marginLeft: 40,
    marginRight: 40,
    marginTop: 24,
    marginBottom: 16,
    lineHeight: 23,
    textAlign: 'center',
  },
});

export default Prompt;
