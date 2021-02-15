/**
 * @format
 * @flow
 */

import React, {useCallback} from 'react';
import {
  Image,
  View,
  SafeAreaView,
  StyleSheet,
  Text,
  useColorScheme,
  Platform,
  TouchableNativeFeedback,
  TouchableHighlight,
} from 'react-native';
import {connect} from 'react-redux';

import {Platforms, Themes} from '../../constants';
import type {State} from '../../redux';
import {showSurvey} from '../../redux';
import type {Survey} from '../../types';

import PromptButton from './Button';

type Props = {
  dispatchShowSurvey: (Survey) => void,
  onDismiss: () => void,
  survey: Survey,
};

const Prompt: (Props) => React$Node = ({
  dispatchShowSurvey,
  onDismiss,
  survey,
}) => {
  const colorScheme = useColorScheme();

  const showSurveyButtonClicked = useCallback(() => {
    dispatchShowSurvey(survey);
  }, [dispatchShowSurvey, survey]);

  return (
    <View
      // eslint-disable-next-line react-native/no-inline-styles
      style={{
        ...styles.prompt,
        backgroundColor: colorScheme === Themes.Dark ? '#000' : '#fff',
      }}>
      <SafeAreaView>
        <CloseButton onPress={onDismiss} />
        <Text
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            ...styles.promptText,
            color: colorScheme === Themes.Dark ? '#fff' : '#000',
          }}>
          {survey.prompt?.message}
        </Text>
        <PromptButton
          text={survey.prompt?.button_text || ''}
          color="#7457be"
          onPress={showSurveyButtonClicked}
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  prompt: {
    borderRadius: 10,
    shadowColor: '#000000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 0,
    },
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

const CloseButton: ({onPress: () => void}) => React$Node = ({onPress}) => {
  return Platform.OS === Platforms.Android ? (
    <TouchableNativeFeedback onPress={onPress}>
      <Image source={require('./images/close.png')} />
    </TouchableNativeFeedback>
  ) : (
    <TouchableHighlight
      style={{
        backgroundColor: '#d6d6d6',
        borderRadius: 999,
        position: 'absolute',
        padding: 7,
        top: 8,
        right: 8,
      }}
      onPress={onPress}>
      <Image source={require('./images/close.png')} />
    </TouchableHighlight>
  );
};

const mapStateToProps = ({survey}: State) => ({
  survey,
});

const mapDispatchToProps = (dispatch) => ({
  dispatchShowSurvey: (survey: Survey) => {
    dispatch(showSurvey(survey));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Prompt);
