import React from 'react';
import { View, StyleSheet, Text, TouchableHighlight } from 'react-native';

interface Props {
  color: string;
  onPress: () => void;
  text: string;
}

const PromptButton: (Props: Props) => JSX.Element = ({
  color,
  onPress,
  text,
}) => {
  return (
    <View>
      <TouchableHighlight
        style={{
          ...styles.touchable,
          backgroundColor: color,
        }}
        underlayColor={color}
        onPress={onPress}
      >
        <View style={styles.container}>
          <Text style={styles.text}>{text}</Text>
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
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default PromptButton;
