/**
 * @format
 * @flow
 */

import React, {useCallback, useEffect, useRef} from 'react';
import {
  Animated,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  useColorScheme,
  Platform,
  TouchableNativeFeedback,
  TouchableHighlight,
  View,
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

  const promptAnimation = useRef(new Animated.Value(500)).current;

  useEffect(() => {
    Animated.timing(promptAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [promptAnimation]);

  const onDismissAnimated = useCallback(() => {
    Animated.timing(promptAnimation, {
      toValue: 500,
      duration: 300,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      onDismiss();
    }, 300);
  }, [onDismiss, promptAnimation]);

  const showSurveyButtonClicked = useCallback(() => {
    Animated.timing(promptAnimation, {
      toValue: 500,
      duration: 300,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      dispatchShowSurvey(survey);
    }, 300);
  }, [dispatchShowSurvey, promptAnimation, survey]);

  return (
    <Animated.View
      style={{
        ...styles.promptContainer,
        transform: [
          {
            translateY: promptAnimation,
          },
        ],
      }}>
      <View
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          ...styles.prompt,
          backgroundColor: colorScheme === Themes.Dark ? '#000' : '#fff',
        }}>
        <SafeAreaView>
          <CloseButton onPress={onDismissAnimated} />
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
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  promptContainer: {
    zIndex: 2,
    width: '100%',
    position: 'absolute',
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
  },
  prompt: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    shadowColor: '#000000',
    shadowOpacity: 0.4,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    maxWidth: 420,
    width: '100%',
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
    <TouchableHighlight style={closeButtonStyles.closeButton} onPress={onPress}>
      <Image source={require('./images/close.png')} />
    </TouchableHighlight>
  );
};

const closeButtonStyles = StyleSheet.create({
  closeButton: {
    backgroundColor: '#d6d6d6',
    borderRadius: 999,
    position: 'absolute',
    padding: 7,
    top: 8,
    right: 8,
  },
});

const mapStateToProps = ({survey}: State) => ({
  survey,
});

const mapDispatchToProps = (dispatch) => ({
  dispatchShowSurvey: (survey: Survey) => {
    dispatch(showSurvey(survey));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Prompt);
