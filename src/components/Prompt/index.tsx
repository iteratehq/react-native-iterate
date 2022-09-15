import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  Appearance,
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  PanResponder,
} from 'react-native';
import { connect } from 'react-redux';

import { Colors, Themes } from '../../constants';
import type { State } from '../../redux';
import { showSurvey } from '../../redux';
import type { EdgeInsets } from '../../types';
import type { Survey } from '../../types';

import PromptButton from './Button';
import type { Dispatch } from 'src/iterate';
import Iterate from '../../iterate';
import {
  InteractionEvents,
  InteractionEventSource,
} from '../../interaction-events';

type Props = {
  dispatchShowSurvey: (Survey: Survey) => void;
  onDismiss: (source: InteractionEventSource) => void;
  safeAreaInsets: EdgeInsets;
  survey?: Survey;
};

const ANIMATION_DURATION = 300;
const DISMISSED_POSITION = 500;
const DISPLAYED_POSITION = 0;

const Prompt: (Props: Props) => JSX.Element = ({
  dispatchShowSurvey,
  onDismiss,
  safeAreaInsets,
  survey,
}) => {
  const promptAnimation = useRef(
    new Animated.Value(DISMISSED_POSITION)
  ).current;

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
              onDismiss('prompt');
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
      onDismiss('prompt');
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
        InteractionEvents.SurveyDisplayed(survey);
      }
    }, ANIMATION_DURATION);
  }, [dispatchShowSurvey, promptAnimation, survey]);

  const theme = Appearance.getColorScheme();
  const promptBackgroundColor =
    theme === Themes.Dark ? Colors.LightBlack : Colors.White;
  const promptTextColor = theme === Themes.Dark ? Colors.White : Colors.Black;
  const shadowOpacity = theme === Themes.Dark ? 0.8 : 0.4;

  const paddingBottom = safeAreaInsets.bottom > 0 ? safeAreaInsets.bottom : 20;

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
        style={[
          styles.prompt,
          {
            backgroundColor: promptBackgroundColor,
            shadowOpacity: shadowOpacity,
          },
        ]}
      >
        <View style={{ paddingBottom }}>
          <CloseButton onPress={onDismissAnimated} />
          <Text
            style={[
              styles.promptText,
              {
                color: promptTextColor,
                fontFamily: Iterate.surveyTextFont?.postscriptName,
              },
            ]}
          >
            {survey?.prompt?.message}
          </Text>
          <PromptButton
            text={`${survey?.prompt?.button_text || ''}`}
            color={`${survey?.color || '#7457be'}`}
            colorDark={survey?.color_dark}
            onPress={showSurveyButtonClicked}
          />
        </View>
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
    elevation: 20,
    shadowColor: '#000000',
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
  const theme = Appearance.getColorScheme();
  const backgroundColor =
    theme === Themes.Dark ? Colors.LightBlack : Colors.Grey;

  return (
    <TouchableHighlight
      style={[closeButtonStyles.closeButton, { backgroundColor }]}
      onPress={onPress}
    >
      <Image source={require('./images/close.png')} />
    </TouchableHighlight>
  );
};

const closeButtonStyles = StyleSheet.create({
  closeButton: {
    borderRadius: 999,
    position: 'absolute',
    padding: 7,
    top: 8,
    right: 8,
  },
});

const mapStateToProps = ({ safeAreaInsets, survey }: State) => ({
  safeAreaInsets,
  survey,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  dispatchShowSurvey: (survey: Survey) => {
    dispatch(showSurvey(survey));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Prompt);
