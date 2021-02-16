/**
 * @format
 * @flow
 */

import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  useColorScheme,
  TouchableHighlight,
} from 'react-native';

import {Themes} from '../../constants';

interface Props {
  color: string;
  onPress: () => void;
  text: string;
}

const PromptButton: (Props) => React$Node = ({color, onPress, text}) => {
  const colorScheme = useColorScheme();

  return (
    <View>
      <TouchableHighlight
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          ...styles.touchable,
          backgroundColor: colorScheme === Themes.Dark ? '#fff' : color,
        }}
        underlayColor={color}
        onPress={onPress}>
        <View style={styles.container}>
          <Text
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              ...styles.text,
              color: colorScheme === Themes.Dark ? color : '#fff',
            }}>
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
