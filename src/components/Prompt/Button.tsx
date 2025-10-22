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

const calculateLuminance = (hexColor: string): number => {
  // Remove # if present
  const hex = hexColor.replace('#', '');

  // Convert hex to RGB (0-255)
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Linearize sRGB values (gamma correction) per WCAG spec
  const linearize = (channel: number): number => {
    const c = channel / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };

  const rLinear = linearize(r);
  const gLinear = linearize(g);
  const bLinear = linearize(b);

  // Calculate relative luminance using WCAG formula
  // https://www.w3.org/TR/WCAG20/#relativeluminancedef
  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
};

const PromptButton: (Props: Props) => React.ReactElement = ({
  color,
  colorDark,
  onPress,
  text,
  survey,
}) => {
  let backgroundColor;

  switch (survey?.appearance) {
    case Themes.Dark:
      backgroundColor = colorDark || color;
      break;
    case Themes.Light:
      backgroundColor = color;
      break;
    default:
      backgroundColor =
        Appearance.getColorScheme() === Themes.Dark
          ? colorDark || color
          : color;
  }

  const luminance = calculateLuminance(backgroundColor);
  const textColor = luminance < 0.5 ? Colors.White : Colors.Black;

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
