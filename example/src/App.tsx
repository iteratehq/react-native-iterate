import * as React from 'react';

import { StyleSheet, View, Text, Button } from 'react-native';
import Iterate, { IterateProvider } from 'react-native-iterate';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import SecureStorage from 'react-native-encrypted-storage';

const App = () => {
  React.useEffect(() => {
    Iterate.init({
      apiKey: apiKey,
      safeArea: useSafeAreaInsets,
      storage: SecureStorage,
    });

    Iterate.onResponse((response, question, survey) => {
      console.log('onResponseCallback', response, question, survey);
    });
    Iterate.onEvent((event, data) => {
      console.log('onEventCallback', event, data);
    });

    Iterate.identify({ email: 'example@email.com' });
  }, []);

  const apiKey =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb21wYW55X2lkIjoiNWRmZTM2OGEwOWI2ZWYwMDAxYjNlNjE4IiwiaWF0IjoxNTc2OTQxMTk0fQ.QBWr2goMwOngVhi6wY9sdFAKEvBGmn-JRDKstVMFh6M';

  return (
    <SafeAreaProvider>
      <IterateProvider>
        <View style={styles.container}>
          <Text>Hello</Text>
          <Button
            title="ok"
            onPress={() => {
              Iterate.sendEvent('show-survey-button-tapped', {
                currentTime: new Date().getTime(),
              });
            }}
          >
            Click
          </Button>
        </View>
      </IterateProvider>
    </SafeAreaProvider>
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

export default App;
