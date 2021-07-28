import React from 'react';
import {
  Appearance,
  View,
  StyleSheet,
  Text,
  TouchableHighlight,
} from 'react-native';
import { Colors, Themes } from '../../constants';

interface Props {
  color: string;
  colorDark?: string;
  onPress: () => void;
  text: string;
}

const PromptButton: (Props: Props) => JSX.Element = ({
  color,
  colorDark,
  onPress,
  text,
}) => {
  const theme = Appearance.getColorScheme();

  const backgroundColor =
    theme === Themes.Dark && colorDark != null ? colorDark : color;
  const textColor = theme === Themes.Dark ? Colors.Black : Colors.White;

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
          <Text style={[styles.text, { color: textColor }]}>{text}</Text>
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
