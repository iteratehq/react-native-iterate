import * as React from 'react';

import {Appearance, StyleSheet, View, Button} from 'react-native';
import Iterate, {IterateProvider} from 'react-native-iterate';
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
      buttonFont: {
        filename: 'WorkSans-Regular.ttf',
        postscriptName: 'WorkSans-Regular',
      },
      surveyTextFont: {
        filename: 'Merriweather-Regular.ttf',
        postscriptName: 'Merriweather-Regular',
      },
    });

    Iterate.onResponse((response, question, survey) => {
      console.log('onResponseCallback', response, question, survey);
    });
    Iterate.onEvent((event, data) => {
      console.log('onEventCallback', event, data);
    });
  }, []);

  const apiKey =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb21wYW55X2lkIjoiNWRmZTM2OGEwOWI2ZWYwMDAxYjNlNjE4IiwiaWF0IjoxNTc2OTQxMTk0fQ.QBWr2goMwOngVhi6wY9sdFAKEvBGmn-JRDKstVMFh6M';

  const externalId = 'user-123';
  const email = 'exampl@email.com';

  const theme = Appearance.getColorScheme();
  const backgroundColor = theme === 'dark' ? '#000' : '#fff';

  return (
    <SafeAreaProvider>
      <IterateProvider>
        <View
          style={{
            ...styles.container,
            backgroundColor: backgroundColor,
          }}>
          <Button
            title="Trigger survey"
            onPress={() => {
              Iterate.sendEvent('show-survey-button-tapped', {
                currentTime: new Date().getTime(),
              });
            }}
          />
          <Button
            title="Login"
            onPress={() => {
              Iterate.identify({
                external_id: externalId,
                email,
              });
            }}
          />
          <Button
            title="Logout"
            onPress={() => {
              Iterate.reset();
            }}
          />
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
