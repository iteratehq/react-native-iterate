import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  useColorScheme,
  Platform,
  TouchableNativeFeedback,
  TouchableHighlight,
  View,
  PanResponder,
} from 'react-native';
import { connect } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Platforms, Themes } from '../../constants';
import type { State } from '../../redux';
import { showSurvey } from '../../redux';
import type { Survey } from '../../types';

import PromptButton from './Button';
import type { Dispatch } from 'src/iterate';

type Props = {
  dispatchShowSurvey: (Survey: Survey) => void;
  onDismiss: () => void;
  survey?: Survey;
};

const ANIMATION_DURATION = 300;
const DISMISSED_POSITION = 500;
const DISPLAYED_POSITION = 0;

const Prompt: (Props: Props) => JSX.Element = ({
  dispatchShowSurvey,
  onDismiss,
  survey,
}) => {
  const colorScheme = useColorScheme();

  const promptAnimation = useRef(new Animated.Value(DISMISSED_POSITION))
    .current;

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (_, gestureState) => {
          promptAnimation.setValue(
            Math.max(DISPLAYED_POSITION, DISPLAYED_POSITION + gestureState.dy)
          );
        },
        onPanResponderRelease: (_, gesture) => {
          const shouldDismiss = gesture.vy > DISPLAYED_POSITION;
          Animated.spring(promptAnimation, {
            toValue: shouldDismiss ? DISMISSED_POSITION : DISPLAYED_POSITION,
            velocity: gesture.vy,
            tension: 2,
            friction: 8,
            useNativeDriver: true,
          }).start(({ finished }) => {
            if (finished && shouldDismiss) {
              onDismiss();
            }
          });
        },
      }),
    [onDismiss, promptAnimation]
  );

  useEffect(() => {
    Animated.timing(promptAnimation, {
      toValue: DISPLAYED_POSITION,
      duration: ANIMATION_DURATION,
      useNativeDriver: true,
    }).start();
  }, [promptAnimation]);

  const onDismissAnimated = useCallback(() => {
    Animated.timing(promptAnimation, {
      toValue: DISMISSED_POSITION,
      duration: ANIMATION_DURATION,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      onDismiss();
    }, ANIMATION_DURATION);
  }, [onDismiss, promptAnimation]);

  const showSurveyButtonClicked = useCallback(() => {
    Animated.timing(promptAnimation, {
      toValue: DISMISSED_POSITION,
      duration: ANIMATION_DURATION,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      if (survey != null) {
        dispatchShowSurvey(survey);
      }
    }, ANIMATION_DURATION);
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
      }}
      {...panResponder.panHandlers}
    >
      <View
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          ...styles.prompt,
          backgroundColor: colorScheme === Themes.Dark ? '#000' : '#fff',
        }}
      >
        <SafeAreaView edges={['bottom']}>
          <CloseButton onPress={onDismissAnimated} />
          <Text
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              ...styles.promptText,
              color: colorScheme === Themes.Dark ? '#fff' : '#000',
            }}
          >
            {survey?.prompt?.message}
          </Text>
          <PromptButton
            text={`${survey?.prompt?.button_text || ''}`}
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

const CloseButton = ({ onPress }: { onPress: () => void }) => {
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

const mapStateToProps = ({ survey }: State) => ({
  survey,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  dispatchShowSurvey: (survey: Survey) => {
    dispatch(showSurvey(survey));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Prompt);
