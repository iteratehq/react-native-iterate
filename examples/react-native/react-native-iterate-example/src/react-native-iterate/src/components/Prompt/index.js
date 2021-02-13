/**
 * @format
 * @flow
 */

import React, {useEffect} from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  Text,
  useColorScheme,
} from 'react-native';
import {connect} from 'react-redux';

import {Themes} from '../../constants';
import type {State} from '../../redux';
import type {Survey} from '../../types';

import PromptButton from './Button';

type Props = {
  showPrompt: boolean,
  showSurvey: boolean,
  survey?: Survey,
};

const Prompt: (Props) => React$Node = ({survey, showPrompt, showSurvey}) => {
  const colorScheme = useColorScheme();

  useEffect(() => {
    console.log('Survey: ', survey, showPrompt, showSurvey);
  }, [survey, showPrompt, showSurvey]);

  const showSurveyButtonClicked = () => {};

  return showPrompt === true ? (
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
          onPress={showSurveyButtonClicked}
        />
      </SafeAreaView>
    </View>
  ) : null;
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

const mapStateToProps = ({showPrompt, showSurvey, survey}: State) => ({
  showPrompt,
  showSurvey,
  survey,
});

export default connect(mapStateToProps)(Prompt);
