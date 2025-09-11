import React from 'react';
import {
  Appearance,
  View,
  StyleSheet,
  Text,
  TouchableHighlight,
} from 'react-native';
import { Colors, Themes } from '../../constants';
import Iterate from '../../iterate';
import type { Survey } from '../../types';

interface Props {
  color: string;
  colorDark?: string;
  onPress: () => void;
  text: string;
  survey?: Survey;
}

const PromptButton: (Props: Props) => React.ReactElement = ({
  color,
  colorDark,
  onPress,
  text,
  survey,
}) => {
  let backgroundColor;
  let textColor;

  switch (survey?.appearance) {
    case Themes.Dark:
      backgroundColor = colorDark || color;
      textColor = Colors.Black;
      break;
    case Themes.Light:
      backgroundColor = color;
      textColor = Colors.White;
      break;
    default:
      Appearance.getColorScheme() === Themes.Dark
        ? ((backgroundColor = colorDark || color), (textColor = Colors.Black))
        : ((backgroundColor = color), (textColor = Colors.White));
  }

  return (
    <View>
      <TouchableHighlight
        style={{
          ...styles.touchable,
          backgroundColor: backgroundColor,
        }}
        underlayColor={backgroundColor}
        onPress={onPress}
      >
        <View style={styles.container}>
          <Text
            style={[
              styles.text,
              // eslint-disable-next-line react-native/no-inline-styles
              {
                color: textColor,
                fontFamily: Iterate.buttonFont?.postscriptName,
                fontWeight:
                  Iterate.buttonFont?.postscriptName != null
                    ? 'normal'
                    : styles.text.fontWeight,
              },
            ]}
          >
            {text}
          </Text>
        </View>
      </TouchableHighlight>
    </View>
  );
};

const styles = StyleSheet.create({
  touchable: {
    marginLeft: 40,
    marginRight: 40,
    borderRadius: 6,
    paddingTop: 2,
    paddingBottom: 2,
  },
  container: {
    padding: 10,
    borderRadius: 6,
  },
  text: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default PromptButton;
