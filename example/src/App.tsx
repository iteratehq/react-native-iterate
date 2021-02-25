import * as React from 'react';

import { StyleSheet, View, Text } from 'react-native';
import Iterate, { withIterate } from 'react-native-iterate';
import SecureStorage from 'react-native-encrypted-storage';

const App = () => {
  React.useEffect(() => {
    Iterate.onResponse((response, question) => {
      console.log('onResponseCallback', response, question);
    });

    Iterate.sendEvent('show-survey-button-tapped');
  }, []);

  return (
    <View style={styles.container}>
      <Text>Hello</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});

export default withIterate({
  apiKey:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb21wYW55X2lkIjoiNWRmZTM2OGEwOWI2ZWYwMDAxYjNlNjE4IiwiaWF0IjoxNTc2OTQxMTk0fQ.QBWr2goMwOngVhi6wY9sdFAKEvBGmn-JRDKstVMFh6M',
  storage: SecureStorage,
})(App);
